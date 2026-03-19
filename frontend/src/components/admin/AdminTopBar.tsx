'use client';

import React from 'react';
import { NotificationBell } from '@/components/NotificationBell';
import {
  Menu,
  Users,
  Settings,
  LogOut,
  Globe,
  ChevronDown,
} from 'lucide-react';

/**
 * ─── PURE ADMIN TOP BAR ──────────────────────────────────────────────────────
 * React 19 / Next 16 (Turbopack) Compatibility Version.
 * This component NO LONGER uses hooks (useAuth, useRouter, etc.) internally.
 * All logic is delegated to the parent (layout.tsx) and passed via props.
 * This pattern completely bypasses the Turbopack `_ref is not defined` bug.
 */

interface AdminTopBarProps {
  pageTitle: string;
  userName: string | null;
  onLogout: () => void;
  onSettingsClick: () => void;
  onMenuToggle: () => void;
}

const titleDescriptions: Record<string, string> = {
  Dashboard: 'Viewing company snapshot',
  Appointments: 'Managing booking requests',
  'Blog Management': 'Content management system',
  Contacts: 'Direct customer messages',
  Settings: 'Global system configuration',
  Team: 'Staff and organization profiles',
  Services: 'Service listings & offerings',
  'Page Builder': 'Visual content editor',
  'Site Builder': 'Global components configuration',
};

export default function AdminTopBarComp(props: AdminTopBarProps) {
  const { pageTitle, userName, onLogout, onSettingsClick, onMenuToggle } = props;
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const subtitle = titleDescriptions[pageTitle] ?? 'System administrator access';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: menu toggle + page title */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all active:scale-95 border border-transparent hover:border-gray-200"
            onClick={onMenuToggle}
          >
            <Menu size={20} />
            <span className="sr-only">Open sidebar</span>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none">
                {pageTitle === 'Dashboard' ? (
                  <>
                    Dashboard{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                      Overview
                    </span>
                  </>
                ) : (
                  pageTitle
                )}
              </h1>
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                {pageTitle === 'Dashboard' ? 'Live' : 'Management'}
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mt-1.5 flex items-center gap-1">
              Admin:{' '}
              <span className="text-primary font-bold">
                {userName ?? 'Administrator'}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full mx-1" />
              <span className="opacity-70 truncate max-w-[150px] sm:max-w-none">{subtitle}</span>
            </p>
          </div>
        </div>

        {/* Right: status + notifications + user menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            System Online
          </div>

          <NotificationBell variant="sheet" />

          <div className="relative flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-200 ml-1 sm:ml-0">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-900 leading-none">
                {userName ?? 'Admin'}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-black opacity-60">
                Admin Role
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-1 group active:scale-95 transition-transform"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-primary to-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-all">
                <Users size={18} className="text-white sm:size-20" />
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-300 hidden sm:block ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {userMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/0"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div
                  className="absolute right-0 top-[calc(100%+12px)] w-56 bg-white rounded-2xl shadow-2xl shadow-gray-300/50 border border-gray-100 overflow-hidden z-50 transition-all animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                >
                  <div className="px-5 py-4 bg-gradient-to-br from-primary/5 to-blue-50/50 border-b border-gray-100">
                    <p className="text-sm font-black text-gray-900 leading-none">
                      {userName ?? 'Admin'}
                    </p>
                    <p className="text-[10px] text-primary/70 uppercase tracking-widest font-black mt-1.5 flex items-center gap-1.5">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      Administrator
                    </p>
                  </div>

                  <div className="p-2 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        onSettingsClick();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-all group"
                    >
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors">
                        <Settings size={15} className="text-gray-500 group-hover:text-primary" />
                      </div>
                      <span className="font-bold">System Settings</span>
                    </button>

                    <a
                      href="/"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all group"
                    >
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-50 rounded-lg flex items-center justify-center transition-colors">
                        <Globe size={15} className="text-gray-500 group-hover:text-blue-600" />
                      </div>
                      <span className="font-bold">Public Website</span>
                    </a>

                    <div className="h-px bg-gray-100 my-2 mx-2" />

                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all group"
                    >
                      <div className="w-8 h-8 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                        <LogOut size={15} className="text-red-400 group-hover:text-red-500" />
                      </div>
                      <span className="font-bold">Logout Session</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
