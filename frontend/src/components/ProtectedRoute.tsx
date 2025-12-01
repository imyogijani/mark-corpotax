'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin as checkIsAdmin } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

// Loading component to render consistently on both server and client initially
function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4">
      <div className="text-center">
        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-sm sm:text-base text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  // Start with null to indicate "checking" state - renders loading on both server and client
  const [authState, setAuthState] = useState<{
    checked: boolean;
    authenticated: boolean;
    isAdmin: boolean;
  }>({
    checked: false,
    authenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    // Only check auth on client side
    const authenticated = isAuthenticated();
    const admin = checkIsAdmin();
    
    setAuthState({
      checked: true,
      authenticated,
      isAdmin: admin,
    });

    if (!authenticated) {
      router.push('/login');
      return;
    }

    if (requireAdmin && !admin) {
      router.push('/dashboard');
      return;
    }
  }, [requireAdmin, router]);

  // Always show loading initially (matches server render)
  if (!authState.checked) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!authState.authenticated) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  if (requireAdmin && !authState.isAdmin) {
    return <LoadingSpinner message="Redirecting to dashboard..." />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
}

export function UserRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute requireAdmin={false}>{children}</ProtectedRoute>;
}
