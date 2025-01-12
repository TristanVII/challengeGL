import React, { memo } from "react";

const DebugNodeComponent = memo(({ data }: { data: any }) => {
  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #4CAF50",
        borderRadius: "10px",
        backgroundColor: "#1E1E1E",
        color: "#FFFFFF",
        fontFamily: "monospace",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        minWidth: "150px",
        cursor: "pointer", // Indicates it's clickable
      }}
      onClick={data.onClick} // Handle click event
    >
      <div
        style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}
      >
        Debug Node
      </div>
    </div>
  );
});

export default DebugNodeComponent;
