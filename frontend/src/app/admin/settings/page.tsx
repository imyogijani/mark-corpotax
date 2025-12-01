"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Settings,
  Loader2,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
} from "lucide-react";

interface SiteSettings {
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  businessHours: string;
  timezone: string;
}

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  // Site settings state
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "FinBest Finance",
    siteEmail: "info@finbestfinance.com",
    sitePhone: "+1 (555) 123-4567",
    siteAddress: "123 Financial District, New York, NY 10005",
    businessHours: "Monday - Friday: 9:00 AM - 5:00 PM",
    timezone: "America/New_York",
  });

  const handleSaveSettings = async () => {
    setSaving(true);
    // For now, just simulate saving - these could be stored in localStorage or backend
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("siteSettings", JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your site settings have been updated successfully.",
    });
    setSaving(false);
  };

  useEffect(() => {
    // Load settings from localStorage if available
    const saved = localStorage.getItem("siteSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved settings");
      }
    }
  }, []);

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Site Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your website configuration and business information
            </p>
          </div>
        </div>

        {/* Business Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Basic information about your financial services business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site Name
                </Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  placeholder="Your Business Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Email
                </Label>
                <Input
                  id="siteEmail"
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, siteEmail: e.target.value })
                  }
                  placeholder="contact@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sitePhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="sitePhone"
                  value={settings.sitePhone}
                  onChange={(e) =>
                    setSettings({ ...settings, sitePhone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                  placeholder="America/New_York"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteAddress" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address
              </Label>
              <Input
                id="siteAddress"
                value={settings.siteAddress}
                onChange={(e) =>
                  setSettings({ ...settings, siteAddress: e.target.value })
                }
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="businessHours"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Business Hours
              </Label>
              <Input
                id="businessHours"
                value={settings.businessHours}
                onChange={(e) =>
                  setSettings({ ...settings, businessHours: e.target.value })
                }
                placeholder="Monday - Friday: 9:00 AM - 5:00 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              System Status
            </CardTitle>
            <CardDescription>
              Overview of your system configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Database</span>
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Connected (Firebase)
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Appointments</span>
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Contacts</span>
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Blog</span>
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
