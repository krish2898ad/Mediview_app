import React, { useRef, useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';


const Model = () => {
  const gltf = useLoader(GLTFLoader, '/anatomy.glb');
  const modelRef = useRef();
  const { scene } = useThree();
  const [selectedParts, setSelectedParts] = useState(new Map());
  const [isLoadingParts, setIsLoadingParts] = useState(new Set());
  const originalMaterials = useRef(new Map());

  
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        originalMaterials.current.set(child, child.material.clone());
      }
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 4, 5);
    scene.add(ambientLight, directionalLight);
  }, [gltf, scene]);

  const fetchPainCauses = async (selectedParts) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));  // Give some time for localStorage updates
        console.log(localStorage.getItem("authToken"));

        const token = localStorage.getItem("authToken");
        console.log("📥 Retrieved Token:", token);  // Debugging

        if (!token) {
            throw new Error("❌ Authentication token is missing.");
        }

        const response = await axios.post(
            "http://localhost:5000/api/pain/causes",
            { parts: selectedParts },
            { 
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        console.log("✅ Diagnosis Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error fetching pain causes:", error);
        return "Error retrieving pain causes.";
    }
};



  const handlePointerOver = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    if (!selectedParts.has(mesh.name)) {
      mesh.material.color.set('red');
    }
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    if (!selectedParts.has(mesh.name) && originalMaterials.current.has(mesh)) {
      mesh.material = originalMaterials.current.get(mesh);
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    const partName = mesh.name;
   
    setSelectedParts((prev) => {
      const updated = new Map(prev);
   
      if (updated.has(partName)) {
        updated.delete(partName);
        mesh.material = originalMaterials.current.get(mesh);
      } else {
        const worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);
   
        const offsetY = (updated.size * 0.5) + 1.5;
        const tooltipPosition = [worldPosition.x + 0.8, worldPosition.y + offsetY, worldPosition.z];
   
        updated.set(partName, { causes: 'Loading...', position: tooltipPosition });
        setSelectedParts(updated);  // First update the state immediately
   
        fetchPainCauses(partName).then((response) => {
          const causes = response.causes ? JSON.stringify(response.causes) : "No causes found";
          updated.set(partName, { causes, position: tooltipPosition });
          console.log(causes)
          setSelectedParts(new Map(updated));  // Then update the causes after fetching
        });
   
        mesh.material.color.set('red');
      }
   
      return updated;
    });
  }

  return (
    <>
      <primitive
        object={gltf.scene}
        scale={3}
        ref={modelRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      <OrbitControls />

      {[...selectedParts.entries()].map(([part, { causes, position }], index) => (
        <Html key={part} position={position} center>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '14px',
              width: '220px',
              textAlign: 'center',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
              transform: `translateX(${index * 10}px) translateY(-${index * 20}px)`,
            }}
          >
            <strong>{part}</strong>
            <br />
            {isLoadingParts.has(part) ? 'Loading...' : causes}
          </div>
        </Html>
      ))}
    </>
  );
};

export default Model;
