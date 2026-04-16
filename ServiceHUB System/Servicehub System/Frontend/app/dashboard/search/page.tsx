'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { apiClient } from '@/app/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function SearchPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  const categories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Cleaning',
    'Carpentry',
    'Appliance Repair',
    'Car Repair',
    'Painting',
    'Landscaping',
    'Other',
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (selectedCategory && searchCity) {
        result = await apiClient.getNearbyWorkers(selectedCategory, searchCity, token);
      } else if (selectedCategory) {
        result = await apiClient.getWorkersByCategory(selectedCategory, token);
      } else if (searchCity) {
        result = await apiClient.getWorkersByCity(searchCity, token);
      }

      setWorkers(result || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Service Providers</h2>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <Input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="e.g., New York"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.length > 0 ? (
            workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-24 relative">
                  {worker.profilePictureUrl && (
                    <img
                      src={worker.profilePictureUrl}
                      alt={worker.firstName}
                      className="w-16 h-16 rounded-full absolute bottom-0 left-4 translate-y-1/2 border-4 border-white"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-12 px-6 pb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    {worker.firstName} {worker.lastName}
                  </h3>

                  <p className="text-blue-600 text-sm font-medium mb-2">
                    {worker.serviceCategory}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {worker.bio || 'No bio provided'}
                  </p>

                  {/* Rating and Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-900 font-semibold ml-1">
                        {worker.averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">
                        ({worker.totalJobs} jobs)
                      </span>
                    </div>
                    {worker.verified && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Rate */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-xs">Hourly Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${worker.hourlyRate.toFixed(2)}/hr
                    </p>
                  </div>

                  {/* Skills */}
                  {worker.skills && (
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.split(',').slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/worker/${worker.userId}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {workers.length === 0 && selectedCategory
                  ? 'No service providers found. Try adjusting your search.'
                  : 'Use the search form above to find service providers.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
