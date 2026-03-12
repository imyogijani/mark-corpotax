"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import {
  Bell,
  BellRing,
  Check,
  X,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface NotificationBellProps {
  variant?: "dropdown" | "sheet";
}

export function NotificationBell({ variant = "sheet" }: NotificationBellProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotificationBgColor = (
    type: Notification["type"],
    read: boolean
  ) => {
    if (read) return "bg-gray-50";

    switch (type) {
      case "success":
        return "bg-blue-50 border-l-4 border-blue-500";
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-500";
      case "error":
        return "bg-red-50 border-l-4 border-red-500";
      default:
        return "bg-blue-50 border-l-4 border-blue-500";
    }
  };

  const NotificationItem = ({
    notification,
    inSheet = false,
  }: {
    notification: Notification;
    inSheet?: boolean;
  }) => (
    <div
      className={`p-4 transition-colors duration-200 ${getNotificationBgColor(
        notification.type,
        notification.read
      )} ${inSheet ? "border-b border-gray-100" : ""}`}
    >
      <div className="flex items-start gap-3">
        {getNotificationIcon(notification.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4
              className={`text-sm font-medium ${notification.read ? "text-gray-600" : "text-gray-900"
                }`}
            >
              {notification.title}
            </h4>
            <div className="flex items-center gap-1">
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => removeNotification(notification.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <p
            className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"
              } mb-2`}
          >
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </span>
            <div className="flex items-center gap-2">
              {notification.actionUrl && (
                <Link href={notification.actionUrl}>
                  <Button variant="outline" size="sm" className="h-6 text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {notification.actionLabel || "View"}
                  </Button>
                </Link>
              )}
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === "dropdown") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 max-h-96 overflow-y-auto"
          align="end"
        >
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <div key={notification.id}>
                <NotificationItem notification={notification} />
              </div>
            ))
          )}
          {notifications.length > 5 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/notifications" className="w-full text-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} unread</Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {notifications.length > 0 && (
            <div className="flex gap-2 mb-4">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-200px)]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-sm">
                  You&apos;re all caught up! Check back later for new updates.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    inSheet
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
