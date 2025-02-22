import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Model from './Model';
import './Diagnostics.css';

function Diagnostics() {
    const [selectedParts, setSelectedParts] = useState(new Map());
    
    // Handler to receive selected parts from the Model component
    const handleModelUpdate = (updatedParts) => {
        setSelectedParts(updatedParts);
    };

    return (
        <div className="content-area">
            <div className="middle-container">
                <div className="canvas-container">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[-2, 5, 2]} intensity={1} />
                        <Model onUpdate={handleModelUpdate} />
                    </Canvas>
                </div>
            </div>
            <div className="right-container">
                <div className="container">
                    <h3>Selected Parts</h3>
                    <p>{selectedParts.size === 0 ? "No parts selected" : Array.from(selectedParts.keys()).join(", ")}</p>
                </div>
                <div className="container">
                    <h3>Diagnosis</h3>
                    {Array.from(selectedParts.entries()).map(([part, { causes, isLoading }]) => (
                        <div key={part} className="part-detail">
                            <h4>{part}</h4>
                            <p>{isLoading ? "Loading..." : causes}</p>
                            <button 
                                onClick={() => {
                                    // Create a custom click event to deselect this part
                                    const modelElement = document.querySelector('.canvas-container');
                                    if (modelElement) {
                                        // Signal to Model component to deselect this part
                                        const event = new CustomEvent('deselectPart', { detail: { part } });
                                        modelElement.dispatchEvent(event);
                                    }
                                }}
                                className="deselect-button"
                            >
                                Deselect
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Diagnostics;