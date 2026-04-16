'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">ServiceHub</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Find Trusted Service Providers Near You
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you need plumbing repairs, electrical work, AC maintenance, or house cleaning, connect with verified professionals in your area. Book services by the hour and pay safely.
            </p>
            <div className="flex gap-4">
              <Link href="/register?type=customer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                  Book a Service
                </Button>
              </Link>
              <Link href="/register?type=worker">
                <Button variant="outline" className="text-lg px-8 py-6">
                  Become a Provider
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-8 aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🔧</div>
              <p className="text-gray-600">Browse and book services with ease</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Services</h3>
              <p className="text-gray-600">
                Search for service providers by category, location, and hourly rate. See ratings and reviews from other customers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-lg">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect & Chat</h3>
              <p className="text-gray-600">
                Message directly with service providers. Discuss your needs and agree on terms before booking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pay Securely</h3>
              <p className="text-gray-600">
                Pay safely through our platform. Hourly billing ensures you only pay for time actually spent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Popular Services</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: '🔧', name: 'Plumbing' },
              { icon: '⚡', name: 'Electrical' },
              { icon: '❄️', name: 'HVAC' },
              { icon: '🧹', name: 'Cleaning' },
              { icon: '🪵', name: 'Carpentry' },
              { icon: '🧊', name: 'Appliances' },
              { icon: '🚗', name: 'Car Repair' },
              { icon: '🎨', name: 'Painting' },
              { icon: '🌱', name: 'Landscaping' },
              { icon: '✨', name: 'More Services' },
            ].map((service) => (
              <div
                key={service.name}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg hover:border-blue-300 transition cursor-pointer"
              >
                <div className="text-4xl mb-2">{service.icon}</div>
                <p className="text-gray-900 font-medium">{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Next Service Provider?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of customers getting quality service from verified professionals.
          </p>
          <Link href="/register">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">ServiceHub</h3>
              <p className="text-sm">Connect customers with trusted service providers.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Customers</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Browse Services</a></li>
                <li><a href="#" className="hover:text-white">How It Works</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Providers</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Earn Money</a></li>
                <li><a href="#" className="hover:text-white">Join</a></li>
                <li><a href="#" className="hover:text-white">Help</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 ServiceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
