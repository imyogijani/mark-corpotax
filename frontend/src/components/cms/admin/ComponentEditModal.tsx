import React from 'react';
import { ComponentData } from '../BaseComponent';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ComponentEditModalProps {
  isOpen: boolean;
  component?: ComponentData | null;
  onClose: () => void;
  onSave: (component: ComponentData) => void;
  onPreview?: (component: ComponentData) => void;
}

export const ComponentEditModal: React.FC<ComponentEditModalProps> = ({
  isOpen,
  component,
  onClose,
  onSave,
  onPreview
}) => {
  if (!component) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="component-name">Name</label>
            <Input id="component-name" defaultValue={component.name} />
          </div>
          <div>
            <label htmlFor="component-content">Content</label>
            <Textarea id="component-content" defaultValue={JSON.stringify(component.content)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSave(component)}>Save</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};