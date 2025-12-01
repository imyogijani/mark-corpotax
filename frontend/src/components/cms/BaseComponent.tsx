export interface ComponentData {
  id: string;
  type: string;
  name: string;
  content: any;
  styles: Record<string, any>;
  isVisible: boolean;
  order: number;
  page: string;
  section: string;
  category: string;
  isLocked: boolean;
  attributes: Record<string, any>;
  created: Date;
  updated: Date;
}

export interface BaseComponentProps {
  data: ComponentData;
  isEditing?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const BaseComponent: React.FC<BaseComponentProps> = ({ 
  data, 
  isEditing = false, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="base-component">
      <div className="component-content">
        {/* Component content will be rendered by specific component types */}
      </div>
      {isEditing && (
        <div className="component-controls">
          <button onClick={() => onEdit?.(data.id)}>Edit</button>
          <button onClick={() => onDelete?.(data.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};