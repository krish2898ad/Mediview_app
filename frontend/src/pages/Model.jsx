import React, { useRef, useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';

const Model = ({ onUpdate }) => {
  const gltf = useLoader(GLTFLoader, '/anatomy.glb');
  const modelRef = useRef();
  const { scene } = useThree();
  const [selectedParts, setSelectedParts] = useState(new Map());
  const [isLoadingParts, setIsLoadingParts] = useState(new Set());
  const originalMaterials = useRef(new Map());

  // Handle part deselection
  const handleDeselectPart = (event) => {
    const { part } = event.detail;
    deselectPart(part);
  };

  useEffect(() => {
    // Traverse model and store original materials
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        originalMaterials.current.set(child, child.material.clone());
      }
    });

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 4, 5);
    scene.add(ambientLight, directionalLight);

    // Add event listener for deselect event
    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer?.addEventListener('deselectPart', handleDeselectPart);

    return () => {
      canvasContainer?.removeEventListener('deselectPart', handleDeselectPart);
    };
  }, [gltf, scene]);

  // Notify parent component when selected parts change
  useEffect(() => {
    if (onUpdate) {
      onUpdate(selectedParts);
    }
  }, [selectedParts, onUpdate]);

  const fetchPainCauses = async (partName) => {
    try {
      setIsLoadingParts((prev) => new Set(prev).add(partName));

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const response = await axios.post(
        'http://localhost:5000/api/pain/causes',
        { parts: partName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsLoadingParts((prev) => {
        const updated = new Set(prev);
        updated.delete(partName);
        return updated;
      });

      return response.data.causes;
    } catch (error) {
      console.error('Error fetching pain causes:', error);

      setIsLoadingParts((prev) => {
        const updated = new Set(prev);
        updated.delete(partName);
        return updated;
      });

      return 'Error retrieving pain causes.';
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
      mesh.material = originalMaterials.current.get(mesh).clone();
    }
  };

  const deselectPart = (partName) => {
    // Find the mesh by name
    let meshToReset = null;
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.name === partName) {
        meshToReset = child;
      }
    });

    if (meshToReset && originalMaterials.current.has(meshToReset)) {
      meshToReset.material = originalMaterials.current.get(meshToReset).clone();
    }

    setSelectedParts((prev) => {
      const updated = new Map(prev);
      updated.delete(partName);
      return updated;
    });
  };

  const handleClick = (event) => {
    event.stopPropagation();
    const mesh = event.object;
    const partName = mesh.name;

    setSelectedParts((prev) => {
      const updated = new Map(prev);

      if (updated.has(partName)) {
        updated.delete(partName);
        if (originalMaterials.current.has(mesh)) {
          mesh.material = originalMaterials.current.get(mesh).clone();
        }
      } else {
        // Keep track of the world position for the parent component
        const worldPosition = new THREE.Vector3();
        mesh.getWorldPosition(worldPosition);

        // Set the part as loading initially
        updated.set(partName, {
          causes: 'Loading...',
          isLoading: true,
        });

        // Fetch pain causes
        fetchPainCauses(partName).then((causes) => {
          setSelectedParts((current) => {
            const updatedWithCauses = new Map(current);
            if (updatedWithCauses.has(partName)) {
              updatedWithCauses.set(partName, {
                causes,
                isLoading: false,
              });
            }
            return updatedWithCauses;
          });
        });

        mesh.material.color.set('red');
      }

      return updated;
    });
  };

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
    </>
  );
};

export default Model;
