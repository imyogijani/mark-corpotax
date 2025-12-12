import React from "react";
import Image from "next/image";
import { ComponentData } from "./BaseComponent";

interface ComponentRendererProps {
  component: ComponentData;
  isEditing?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  isEditing = false,
  onEdit,
  onDelete,
}) => {
  const renderComponent = () => {
    switch (component.type) {
      case "text":
        return <div dangerouslySetInnerHTML={{ __html: component.content }} />;
      case "image":
        return (
          <Image
            src={component.content.src}
            alt={component.content.alt || "Image"}
            width={400}
            height={300}
            className="object-cover"
          />
        );
      case "button":
        return <button>{component.content.text}</button>;
      default:
        return <div>Unknown component type: {component.type}</div>;
    }
  };

  return (
    <div className={`component-wrapper ${isEditing ? "editing" : ""}`}>
      {renderComponent()}
      {isEditing && (
        <div className="component-controls">
          <button onClick={() => onEdit?.(component.id)}>Edit</button>
          <button onClick={() => onDelete?.(component.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};
