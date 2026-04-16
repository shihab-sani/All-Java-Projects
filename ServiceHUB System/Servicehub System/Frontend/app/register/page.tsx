'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, RegisterData, User } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [userType, setUserType] = useState<'CUSTOMER' | 'WORKER' | 'ADMIN'>('CUSTOMER');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    // Worker specific
    serviceCategory: '',
    hourlyRate: '',
    bio: '',
    skills: '',
    yearsOfExperience: '',
    // Customer specific
    address: '',
    city: '',
    // Admin specific
    adminKey: '',
    department: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const registerData: RegisterData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        userType,
        ...(userType === 'WORKER' && {
          serviceCategory: formData.serviceCategory,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
          bio: formData.bio,
          skills: formData.skills,
          yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        }),
        ...(userType === 'CUSTOMER' && {
          address: formData.address,
          city: formData.city,
        }),
        ...(userType === 'ADMIN' && {
          department: formData.department,
          adminKey: formData.adminKey,
        }),
      };

      await register(registerData);
      router.push(userType === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join Service Marketplace as a customer or service provider</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            <button
              onClick={() => setUserType('CUSTOMER')}
              className={`p-4 border-2 rounded-lg transition ${
                userType === 'CUSTOMER'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">Customer</div>
              <div className="text-xs text-gray-600 mt-1">Looking for services</div>
            </button>

            <button
              onClick={() => setUserType('WORKER')}
              className={`p-4 border-2 rounded-lg transition ${
                userType === 'WORKER'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">Service Provider</div>
              <div className="text-xs text-gray-600 mt-1">Offering services</div>
            </button>

            <button
              onClick={() => setUserType('ADMIN')}
              className={`p-4 border-2 rounded-lg transition ${
                userType === 'ADMIN'
                  ? 'border-red-600 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">Admin</div>
              <div className="text-xs text-gray-600 mt-1">Platform management</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Optional)
              </label>
              <Input
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Worker Specific Fields */}
            {userType === 'WORKER' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Category
                  </label>
                  <select
                    name="serviceCategory"
                    value={formData.serviceCategory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC (AC/Heating)</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Car Repair">Car Repair</option>
                    <option value="Painting">Painting</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate ($)
                  </label>
                  <Input
                    name="hourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="50.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your experience and skills"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <Input
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="AC repair, maintenance, installation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <Input
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    placeholder="5"
                  />
                </div>
              </>
            )}

            {/* Customer Specific Fields */}
            {userType === 'CUSTOMER' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>
              </>
            )}

            {/* Admin Specific Fields */}
            {userType === 'ADMIN' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="User Management">User Management</option>
                    <option value="Moderation">Moderation</option>
                    <option value="Finance">Finance</option>
                    <option value="Support">Support</option>
                    <option value="System Admin">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Verification Key
                  </label>
                  <Input
                    name="adminKey"
                    type="password"
                    value={formData.adminKey}
                    onChange={handleInputChange}
                    placeholder="Enter admin verification key"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Request a key from the system administrator</p>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm text-center">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
