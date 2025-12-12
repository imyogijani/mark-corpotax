"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ComponentData } from "../BaseComponent";
import { VisualEditor } from "./VisualEditor";
import { ComponentEditModal } from "./ComponentEditModal";
import {
  Layout,
  Palette,
  FileText,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2,
  Save,
} from "lucide-react";

// Sample data for demonstration
const sampleComponents: ComponentData[] = [
  {
    id: "hero-1",
    name: "Hero Section",
    type: "text",
    category: "sections",
    content: {
      content: "Welcome to Our Website",
      tag: "h1",
      className: "text-4xl font-bold text-center text-white",
    },
    styles: {
      backgroundColor: "#1f2937",
      color: "white",
      padding: "80px 20px",
    },
    attributes: {},
    order: 1,
    page: "home",
    section: "hero",
    isVisible: true,
    isLocked: false,
    created: new Date("2024-01-01"),
    updated: new Date("2024-01-01"),
  },
  {
    id: "features-1",
    name: "Features Section",
    type: "card",
    category: "sections",
    content: {
      title: "Our Features",
      content:
        "Lightning fast performance, bank-level security, and scalable solutions that grow with your business.",
    },
    styles: {
      padding: "60px 20px",
      backgroundColor: "#f9fafb",
    },
    attributes: {},
    order: 2,
    page: "home",
    section: "features",
    isVisible: true,
    isLocked: false,
    created: new Date("2024-01-01"),
    updated: new Date("2024-01-01"),
  },
];

const sampleThemes = [
  {
    id: "default",
    name: "Default Theme",
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#f59e0b",
      background: "#ffffff",
      text: "#1f2937",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    isActive: true,
  },
  {
    id: "dark",
    name: "Dark Theme",
    colors: {
      primary: "#60a5fa",
      secondary: "#94a3b8",
      accent: "#fbbf24",
      background: "#111827",
      text: "#f9fafb",
    },
    fonts: {
      heading: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
    isActive: false,
  },
];

export const CMSAdminPanel: React.FC = () => {
  const [components, setComponents] =
    useState<ComponentData[]>(sampleComponents);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentData | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState("visual-editor");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleComponentEdit = (component: ComponentData) => {
    setSelectedComponent(component);
    setIsEditModalOpen(true);
  };

  const handleComponentSave = (updatedComponent: ComponentData) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    );
    setSelectedComponent(null);
    setIsEditModalOpen(false);
  };

  const handleComponentDelete = (componentId: string) => {
    setComponents((prev) => prev.filter((comp) => comp.id !== componentId));
  };

  const handleComponentAdd = (newComponentData: Partial<ComponentData>) => {
    const now = new Date();
    const newComponent: ComponentData = {
      id: newComponentData.id || `component-${Date.now()}`,
      name: newComponentData.name || "New Component",
      type: newComponentData.type || "text",
      category: newComponentData.category || "basic",
      content: newComponentData.content || {},
      styles: newComponentData.styles || {},
      attributes: newComponentData.attributes || {},
      order: newComponentData.order || components.length + 1,
      page: newComponentData.page || "home",
      section: newComponentData.section || "main",
      isVisible:
        newComponentData.isVisible !== undefined
          ? newComponentData.isVisible
          : true,
      isLocked:
        newComponentData.isLocked !== undefined
          ? newComponentData.isLocked
          : false,
      created: newComponentData.created || now,
      updated: newComponentData.updated || now,
      ...newComponentData,
    };
    setComponents((prev) => [...prev, newComponent]);
  };

  const handleComponentMove = (
    componentId: string,
    direction: "up" | "down"
  ) => {
    setComponents((prev) => {
      const componentIndex = prev.findIndex((comp) => comp.id === componentId);
      if (componentIndex === -1) return prev;

      const newComponents = [...prev];
      const targetIndex =
        direction === "up" ? componentIndex - 1 : componentIndex + 1;

      if (targetIndex < 0 || targetIndex >= newComponents.length) return prev;

      // Swap components
      [newComponents[componentIndex], newComponents[targetIndex]] = [
        newComponents[targetIndex],
        newComponents[componentIndex],
      ];

      // Update order values
      newComponents.forEach((comp, index) => {
        comp.order = index + 1;
      });

      return newComponents;
    });
  };

  const handlePreviewModeToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedComponent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Content Management System
            </h1>
            <Badge variant="secondary">{components.length} Components</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isPreviewMode ? "default" : "outline"}
              onClick={handlePreviewModeToggle}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? "Exit Preview" : "Preview"}
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="visual-editor" className="gap-2">
                <Layout className="w-4 h-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="themes" className="gap-2">
                <Palette className="w-4 h-4" />
                Themes
              </TabsTrigger>
              <TabsTrigger value="forms" className="gap-2">
                <FileText className="w-4 h-4" />
                Forms
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visual-editor" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Page Components</h3>
                <Button size="sm" onClick={() => handleComponentAdd({})}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {components
                  .sort((a, b) => a.order - b.order)
                  .map((component) => (
                    <Card
                      key={component.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{component.name}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                              {component.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleComponentEdit(component)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleComponentDelete(component.id)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant={
                              component.isVisible ? "default" : "secondary"
                            }
                          >
                            {component.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                          {component.isLocked && (
                            <Badge variant="outline">Locked</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="themes" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Theme Manager</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {sampleThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all ${
                      theme.isActive ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{theme.name}</h4>
                          <div className="flex gap-1 mt-2">
                            {Object.entries(theme.colors)
                              .slice(0, 5)
                              .map(([key, color]) => (
                                <div
                                  key={key}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: color }}
                                  title={key}
                                />
                              ))}
                          </div>
                        </div>
                        {theme.isActive && <Badge>Active</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="forms" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Form Builder</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No forms created yet</p>
                <p className="text-sm">Create your first form to get started</p>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <h3 className="font-semibold">Site Settings</h3>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Global Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label
                        htmlFor="site-title"
                        className="text-sm font-medium"
                      >
                        Site Title
                      </label>
                      <input
                        id="site-title"
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                        defaultValue="Mark Corpotax"
                        placeholder="Enter site title"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="meta-description"
                        className="text-sm font-medium"
                      >
                        Meta Description
                      </label>
                      <textarea
                        id="meta-description"
                        className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
                        rows={3}
                        defaultValue="Professional financial services"
                        placeholder="Enter meta description"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "visual-editor" ? (
            <VisualEditor
              components={components}
              isPreviewMode={isPreviewMode}
              onComponentAdd={handleComponentAdd}
              onComponentEdit={handleComponentEdit}
              onComponentDelete={handleComponentDelete}
              onComponentMove={handleComponentMove}
              onPreviewModeToggle={handlePreviewModeToggle}
            />
          ) : (
            <div className="h-full bg-gray-100 p-6">
              <div className="bg-white rounded-lg shadow-sm h-full overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {activeTab === "themes" && "Theme Management"}
                    {activeTab === "forms" && "Form Builder"}
                    {activeTab === "settings" && "Site Settings"}
                  </h2>
                  <div className="text-center text-gray-500 py-12">
                    <p>Feature coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Component Edit Modal */}
      <ComponentEditModal
        component={selectedComponent}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleComponentSave}
        onPreview={(component: ComponentData) => {
          // Handle preview functionality
          console.log("Preview component:", component);
        }}
      />
    </div>
  );
};

export default CMSAdminPanel;
