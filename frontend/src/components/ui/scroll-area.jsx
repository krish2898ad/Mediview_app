import React from "react";

export const ScrollArea = ({ children, className }) => {
  return (
    <div className={`overflow-y-auto max-h-60 p-2 border rounded-md ${className}`}>
      {children}
    </div>
  );
};
