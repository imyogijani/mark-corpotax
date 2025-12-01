import React from 'react';
import { ComponentData } from '../BaseComponent';

interface VisualEditorProps {
  components: ComponentData[];
  isPreviewMode?: boolean;
  onComponentUpdate?: (component: ComponentData) => void;
  onComponentAdd?: (component: Partial<ComponentData>) => void;
  onComponentEdit?: (component: ComponentData) => void;
  onComponentDelete?: (id: string) => void;
  onComponentMove?: (componentId: string, direction: 'up' | 'down') => void;
  onPreviewModeToggle?: () => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  components,
  isPreviewMode = false,
  onComponentUpdate,
  onComponentAdd,
  onComponentEdit,
  onComponentDelete,
  onComponentMove,
  onPreviewModeToggle
}) => {
  return (
    <div className="visual-editor">
      <div className="editor-canvas">
        {components.map((component) => (
          <div key={component.id} className="component-container">
            {/* Component preview */}
            <div className="component-preview">
              {component.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};