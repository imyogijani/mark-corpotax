"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Database,
  Server,
  RefreshCw,
  Terminal,
  BadgeCheck,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

/**
 * DebugStatus Component
 * Displays a floating button on the bottom right that shows the backend health/API status.
 * Useful for development and checking content fetching status.
 */
export function DebugStatus() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Hide component in production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getHealth();
      setHealth(data);
      setLastCheck(new Date());
    } catch (error) {
      console.error("Health check error:", error);
      setHealth({
        success: false,
        status: "Offline",
        message: "Failed to connect to backend",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] print:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full w-12 h-12 shadow-2xl bg-[#0b4c80] hover:bg-[#0b4c80]/90 transition-all duration-300 border-2 border-white/20"
          >
            <Terminal className="w-6 h-6 text-white" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          className="w-80 p-0 overflow-hidden border-2 border-[#0b4c80]/20 shadow-2xl bg-white"
        >
          {/* Header */}
          <div className="bg-[#0b4c80] p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Activity size={18} />
                Backend Monitor
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                onClick={fetchHealth}
                disabled={loading}
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
            {/* API Status Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Server size={14} className="text-[#0b4c80]" />
                  <span>API Status</span>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${health?.status === "OK"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {health?.status || "Offline"}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Database size={14} className="text-[#0b4c80]" />
                  <span>Active Database</span>
                </div>
                <span className="text-xs font-bold text-blue-700">
                  {health?.database || "Firebase Firestore"}
                </span>
              </div>

              {health?.environment && (
                <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BadgeCheck size={14} className="text-[#0b4c80]" />
                    <span>Mode</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-blue-50 text-[#0b4c80] px-2 py-0.5 rounded border border-blue-100">
                    {health.environment}
                  </span>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Development Quick Info */}
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={14} className="text-amber-700" />
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Dev Credentials
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-amber-600">Admin Email:</span>
                  <span className="font-mono font-bold text-amber-900">
                    admin@markcorpotax.com
                  </span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-amber-600">Password:</span>
                  <span className="font-mono font-bold text-amber-900">
                    admin123
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] text-gray-400 italic">
              <span>Next.js 15.5 (Turbopack)</span>
              {lastCheck && (
                <span>Last check: {lastCheck.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
