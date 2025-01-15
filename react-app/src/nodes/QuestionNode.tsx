import { Handle, Position } from "@xyflow/react";
import React, { memo } from "react";
import { QuestionNode } from "./types";

const QuestionNodeComponent = memo(
  ({ data }: { data: QuestionNode["data"] }) => {
    const style: React.CSSProperties = {
      backgroundColor: data.pending_question ? "#fee2e2" : "#ffffff",
      border: data.pending_question ? "2px solid #E91E63" : "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      padding: "10px",
      minWidth: "150px",
      maxWidth: "300px",
      wordWrap: "break-word",
    };

    // TODO: make as new component
    return (
      <div style={style}>
        <Handle type="target" position={Position.Top} />
        {data.isRoot && (
          <div
            style={{
              backgroundColor: "#fdf2f8",
              margin: "-10px -10px 8px -10px",
              padding: "4px 10px",
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem",
              borderBottom: "1px solid #fbcfe8",
              color: "#be185d",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            ROOT NODE
          </div>
        )}
        {data.pending_question && (
          <div
            style={{
              backgroundColor: "#fdf2f8",
              margin: "-10px -10px 8px -10px",
              padding: "4px 10px",
              borderTopLeftRadius: "0.5rem",
              borderTopRightRadius: "0.5rem",
              borderBottom: "1px solid #fbcfe8",
              color: "#be185d",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}
          >
            Has Pending Question
          </div>
        )}
        <div>{data.label}</div>
        <Handle type="source" position={Position.Bottom} />
      </div>
    );
  }
);

export default QuestionNodeComponent;
