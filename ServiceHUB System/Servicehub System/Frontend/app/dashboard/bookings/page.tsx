'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { apiClient } from '@/app/lib/api';
import { Button } from '@/components/ui/button';
import DashboardNav from '@/components/dashboard/DashboardNav';
import Link from 'next/link';

interface Booking {
  id: number;
  customer: { id: number; firstName: string; lastName: string; email: string };
  worker: { id: number; firstName: string; lastName: string; email: string };
  serviceCategory: string;
  jobDescription: string;
  hourlyRate: number;
  estimatedHours: number;
  totalCost: number;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  actualHoursWorked?: number;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  customerRating?: number;
  customerReview?: string;
  workerRating?: number;
  workerReview?: string;
  createdAt: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        let data: Booking[] = [];
        if (user.userType === 'CUSTOMER') {
          data = await apiClient.getCustomerBookings(user.id, token);
        } else if (user.userType === 'WORKER') {
          data = await apiClient.getWorkerBookings(user.id, token);
        }
        setBookings(data || []);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, token, router]);

  if (!user) {
    return null;
  }

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'pending') return booking.status === 'PENDING';
    if (activeTab === 'active') return booking.status === 'IN_PROGRESS' || booking.status === 'ACCEPTED';
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} onLogout={logout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {user.userType === 'CUSTOMER' ? 'My Bookings' : 'Job Requests'}
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['all', 'pending', 'active', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {booking.serviceCategory}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {user.userType === 'CUSTOMER'
                        ? `${booking.worker.firstName} ${booking.worker.lastName}`
                        : `${booking.customer.firstName} ${booking.customer.lastName}`}
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {booking.jobDescription}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-xs">Hourly Rate</p>
                    <p className="font-bold text-gray-900">${booking.hourlyRate.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Estimated Hours</p>
                    <p className="font-bold text-gray-900">{booking.estimatedHours}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Total Cost</p>
                    <p className="font-bold text-gray-900">${booking.totalCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs">Payment Status</p>
                    <p className={`font-bold ${booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/bookings/${booking.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>

                  {booking.status === 'PENDING' && user.userType === 'WORKER' && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      Accept Job
                    </Button>
                  )}

                  {booking.status === 'PENDING' && user.userType === 'CUSTOMER' && (
                    <Button variant="destructive" className="flex-1">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No {activeTab !== 'all' ? activeTab : ''} bookings yet
            </p>
            {user.userType === 'CUSTOMER' && (
              <Link href="/dashboard/search">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Find a Service Provider
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
