'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User } from '@/app/context/AuthContext';

interface DashboardNavProps {
  user: User | null;
  onLogout: () => void;
}

export default function DashboardNav({ user, onLogout }: DashboardNavProps) {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            ServiceHub
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>

            {user?.userType === 'CUSTOMER' && (
              <>
                <Link href="/dashboard/search" className="text-gray-600 hover:text-gray-900">
                  Find Services
                </Link>
                <Link href="/dashboard/bookings" className="text-gray-600 hover:text-gray-900">
                  My Bookings
                </Link>
                <Link href="/dashboard/messages" className="text-gray-600 hover:text-gray-900">
                  Messages
                </Link>
              </>
            )}

            {user?.userType === 'WORKER' && (
              <>
                <Link href="/dashboard/jobs" className="text-gray-600 hover:text-gray-900">
                  Job Requests
                </Link>
                <Link href="/dashboard/profile" className="text-gray-600 hover:text-gray-900">
                  My Profile
                </Link>
                <Link href="/dashboard/messages" className="text-gray-600 hover:text-gray-900">
                  Messages
                </Link>
              </>
            )}

            {user?.userType === 'ADMIN' && (
              <>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">
                  Users
                </Link>
                <Link href="/admin/vouchers" className="text-gray-600 hover:text-gray-900">
                  Vouchers
                </Link>
                <Link href="/admin/activity" className="text-gray-600 hover:text-gray-900">
                  Activity Log
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.userType.toLowerCase()}
              </p>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
