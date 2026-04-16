'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [loginType, setLoginType] = useState<'CUSTOMER_WORKER' | 'ADMIN'>('CUSTOMER_WORKER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (loginType === 'ADMIN') {
        // Admin login with verification key
        if (!adminKey) {
          setError('Admin verification key is required');
          return;
        }
        await login(email, password, adminKey);
        router.push('/admin/dashboard');
      } else {
        await login(email, password);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials or access denied');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Marketplace</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        {/* Login Type Selection */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setLoginType('CUSTOMER_WORKER')}
            className={`flex-1 py-2 px-3 rounded-lg transition text-sm font-medium ${
              loginType === 'CUSTOMER_WORKER'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Customer / Worker
          </button>

          <button
            onClick={() => setLoginType('ADMIN')}
            className={`flex-1 py-2 px-3 rounded-lg transition text-sm font-medium ${
              loginType === 'ADMIN'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {loginType === 'ADMIN' && (
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Verification Key
              </label>
              <Input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Contact system administrator for access</p>
            </div>
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
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          {loginType === 'CUSTOMER_WORKER' && (
            <>
              <p className="text-gray-600 text-sm text-center mb-4">
                Don&apos;t have an account?
              </p>
              <Link href="/register" className="block w-full">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </>
          )}
          {loginType === 'ADMIN' && (
            <p className="text-gray-600 text-xs text-center">
              Admin accounts are created by system administrators only.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
