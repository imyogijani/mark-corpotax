"use client";

import { useEffect } from "react";
import { SiteEditor } from "@/components/admin/SiteEditor";
import { useAdmin } from "@/contexts/AdminContext";

export default function PageBuilderPage() {
  const { setTitle } = useAdmin();

  useEffect(() => {
    setTitle("Page Builder");
  }, [setTitle]);

  return (
    <div className="h-screen">
      <SiteEditor />
    </div>
  );
}
