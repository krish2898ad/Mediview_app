import React from 'react';
import { Canvas } from '@react-three/fiber';
import Model from './Model';
import './Diagnostics.css';

function Diagnostics() {
    return (
        <div className="content-area">
            <div className="left-container">
                <div className="container">Left Container 1</div>
                <div className="container">Left Container 2</div>
            </div>
            <div className="middle-container">
                <div className="canvas-container">
                    <Canvas camera={{ position: [0, 0, 5] }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[-2, 5, 2]} intensity={1} />
                        <Model position={[0, 0, 0]} />
                    </Canvas>
                </div>
            </div>
            <div className="right-container">
                <div className="container">Right Container 1</div>
                <div className="container">Right Container 2</div>
                <div className="container">Right Container 3</div>
            </div>
        </div>
    );
}

export default Diagnostics;
