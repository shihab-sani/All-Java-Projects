'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isLoading, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/login');
    }
  }, [mounted, user, isLoading, router]);

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.userType === 'CUSTOMER' && (
          <CustomerDashboard userId={user.id} token={token} />
        )}
        {user.userType === 'WORKER' && (
          <WorkerDashboard userId={user.id} token={token} />
        )}
        {user.userType === 'ADMIN' && (
          <AdminDashboard token={token} />
        )}
      </div>
    </div>
  );
}

interface CustomerDashboardProps {
  userId: number;
  token: string | null;
}

function CustomerDashboard({ userId, token }: CustomerDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-blue-100">Find and book trusted service providers near you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Active Bookings', value: '0', icon: '📅' },
          { label: 'Completed Services', value: '0', icon: '✅' },
          { label: 'Total Spent', value: '$0', icon: '💰' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/search" className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Find Service Providers</h2>
            <p className="text-gray-600 mb-4">Search and browse verified service providers in your area</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Browse Services</Button>
          </div>
        </Link>

        <Link href="/dashboard/bookings">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 mb-2">My Bookings</h2>
            <p className="text-gray-600 mb-4">View your active and past bookings</p>
            <Button variant="outline" className="w-full">View Bookings</Button>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity yet</p>
        </div>
      </div>
    </div>
  );
}

interface WorkerDashboardProps {
  userId: number;
  token: string | null;
}

function WorkerDashboard({ userId, token }: WorkerDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Service Provider Dashboard</h1>
        <p className="text-green-100">Manage your services and booking requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Active Jobs', value: '0', icon: '💼' },
          { label: 'Completed Jobs', value: '0', icon: '✅' },
          { label: 'Total Earned', value: '$0', icon: '💵' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/dashboard/jobs">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Job Requests</h2>
            <p className="text-gray-600 mb-4">View and manage booking requests from customers</p>
            <Button className="bg-green-600 hover:bg-green-700">View Requests</Button>
          </div>
        </Link>

        <Link href="/dashboard/profile">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Edit Profile</h2>
            <p className="text-gray-600 mb-4">Update your services, rates, and availability</p>
            <Button variant="outline" className="w-full">Edit Profile</Button>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm mb-1">Response Rate</p>
            <p className="text-2xl font-bold text-gray-900">0%</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Rating</p>
            <p className="text-2xl font-bold text-gray-900">0/5</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ token }: { token: string | null }) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-purple-100">Monitor platform activity and manage users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: '0', icon: '👥' },
          { label: 'Active Bookings', value: '0', icon: '📅' },
          { label: 'Revenue', value: '$0', icon: '💰' },
          { label: 'Reports', value: '0', icon: '⚠️' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link href="/admin/users">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Users</h2>
            <p className="text-gray-600 mb-4">View, block, and manage user accounts</p>
            <Button className="bg-purple-600 hover:bg-purple-700">Manage Users</Button>
          </div>
        </Link>

        <Link href="/admin/vouchers">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Manage Vouchers</h2>
            <p className="text-gray-600 mb-4">Create and manage discount vouchers</p>
            <Button variant="outline" className="w-full">Manage Vouchers</Button>
          </div>
        </Link>
      </div>
    </div>
  );
}
