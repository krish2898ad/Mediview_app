import React from "react";

const PainMapper = () => {
  return (
    <div className="pain-mapper">
      <div className="left">
        <div className="container">Left Container 1</div>
        <div className="container">Left Container 2</div>
      </div>
      <div className="center container">Center Container (Main Area)</div>
      <div className="right">
        <div className="container right-top">Right Container (70%)</div>
        <div className="container right-bottom">Right Container (30%)</div>
      </div>
    </div>
  );
};

export default PainMapper;
