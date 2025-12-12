"use client";

import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

export function NotificationToast() {
  const { notifications } = useNotifications();

  React.useEffect(() => {
    // Find the most recent unread notification
    const latestUnread = notifications
      .filter((n) => !n.read)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (latestUnread) {
      const getIcon = () => {
        switch (latestUnread.type) {
          case "success":
            return CheckCircle2;
          case "warning":
            return AlertTriangle;
          case "error":
            return AlertCircle;
          default:
            return Info;
        }
      };

      const getVariant = () => {
        switch (latestUnread.type) {
          case "error":
            return "destructive" as const;
          default:
            return "default" as const;
        }
      };

      // Show toast for new notifications
      const timeDiff = Date.now() - latestUnread.createdAt.getTime();
      if (timeDiff < 5000) {
        // Show toast for notifications less than 5 seconds old
        // Get icon for potential future use
        void getIcon();

        toast({
          title: latestUnread.title,
          description: latestUnread.message,
          variant: getVariant(),
          duration: 5000,
        });
      }
    }
  }, [notifications]);

  return null; // This component doesn't render anything
}
