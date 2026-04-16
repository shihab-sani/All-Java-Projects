'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { apiClient } from '@/app/lib/api';
import { Button } from '@/components/ui/button';
import DashboardNav from '@/components/dashboard/DashboardNav';
import Link from 'next/link';

interface Worker {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  bio?: string;
  serviceCategory: string;
  hourlyRate: number;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isAvailable: boolean;
  totalJobs: number;
  totalHoursWorked: number;
  averageRating: number;
  verified: boolean;
  skills?: string;
  yearsOfExperience?: number;
}

export default function WorkerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { user, token, logout } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    estimatedHours: '',
    scheduledDate: '',
    jobDescription: '',
  });

  const workerId = params.workerId as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchWorker = async () => {
      try {
        const data = await apiClient.getWorkerProfile(parseInt(workerId), token);
        setWorker(data);
      } catch (error) {
        console.error('Failed to load worker:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId, token, user, router]);

  const handleBooking = async () => {
    if (!user || !worker) return;

    try {
      await apiClient.createBooking(
        user.id,
        worker.userId,
        worker.serviceCategory,
        bookingData.jobDescription,
        worker.hourlyRate,
        parseFloat(bookingData.estimatedHours),
        bookingData.scheduledDate,
        token
      );

      setBookingModal(false);
      router.push('/dashboard/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={user} onLogout={logout} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav user={user} onLogout={logout} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Worker profile not found</p>
            <Link href="/dashboard/search">
              <Button className="bg-blue-600 hover:bg-blue-700">Back to Search</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} onLogout={logout} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 relative">
            {worker.profilePictureUrl && (
              <img
                src={worker.profilePictureUrl}
                alt={worker.firstName}
                className="w-32 h-32 rounded-full absolute bottom-0 left-6 translate-y-1/2 border-4 border-white object-cover"
              />
            )}
          </div>

          {/* Info */}
          <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {worker.firstName} {worker.lastName}
                </h1>
                <p className="text-blue-600 text-lg font-medium mt-1">
                  {worker.serviceCategory}
                </p>
              </div>

              <div className="text-right">
                {worker.verified && (
                  <span className="inline-block bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm mb-2">
                    ✓ Verified
                  </span>
                )}

                <div className="text-right">
                  <div className="text-yellow-500 text-2xl mb-1">★</div>
                  <p className="text-2xl font-bold text-gray-900">
                    {worker.averageRating.toFixed(1)}/5.0
                  </p>
                  <p className="text-gray-500 text-sm">
                    ({worker.totalJobs} jobs completed)
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex gap-6 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-medium text-gray-900">{worker.email}</p>
              </div>
              {worker.phoneNumber && (
                <div>
                  <p className="text-gray-600 text-sm">Phone</p>
                  <p className="font-medium text-gray-900">{worker.phoneNumber}</p>
                </div>
              )}
              {worker.city && (
                <div>
                  <p className="text-gray-600 text-sm">Location</p>
                  <p className="font-medium text-gray-900">{worker.city}</p>
                </div>
              )}
            </div>

            {/* Rate */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-1">Hourly Rate</p>
              <p className="text-4xl font-bold text-gray-900">
                ${worker.hourlyRate.toFixed(2)}/hour
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Bio Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {worker.bio || 'No bio provided'}
              </p>

              {/* Experience */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">Experience</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Years of Experience</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {worker.yearsOfExperience || '0'} years
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total Hours Worked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {worker.totalHoursWorked.toFixed(1)} hrs
                  </p>
                </div>
              </div>

              {/* Skills */}
              {worker.skills && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.split(',').map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Section */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Book?</h3>

              {worker.isAvailable ? (
                <>
                  <Button
                    onClick={() => setBookingModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3"
                  >
                    Book Now
                  </Button>
                  <Link href={`/dashboard/messages?worker=${worker.userId}`} className="block">
                    <Button variant="outline" className="w-full mb-4">
                      Send Message
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    This provider is currently unavailable.
                  </p>
                </div>
              )}

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">Usually responds within 1hr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-medium ${worker.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {worker.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {bookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Service</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    value={bookingData.jobDescription}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, jobDescription: e.target.value })
                    }
                    placeholder="Describe what you need help with"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={bookingData.estimatedHours}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, estimatedHours: e.target.value })
                    }
                    placeholder="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingData.scheduledDate}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, scheduledDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm mb-1">Estimated Cost</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(
                      worker.hourlyRate * (parseFloat(bookingData.estimatedHours) || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setBookingModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBooking}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
