'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardNav from '@/components/dashboard/DashboardNav';

export default function MessagesPage() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push('/login');
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav user={user} onLogout={logout} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <Input placeholder="Search conversations..." />
              </div>

              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-transparent hover:border-blue-600 transition"
                  >
                    <p className="font-semibold text-gray-900 text-sm">Service Provider {idx}</p>
                    <p className="text-gray-600 text-xs mt-1 truncate">Last message preview...</p>
                    <p className="text-gray-400 text-xs mt-1">2 hours ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-96 lg:h-[600px]">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-lg font-bold text-gray-900">Service Provider Name</h2>
                <p className="text-gray-600 text-sm">Online • Last seen 5 minutes ago</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex justify-end mb-4">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">Hi, I need help with AC repair</p>
                  </div>
                </div>

                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">Sure! I can help. When do you need service?</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-500 text-sm">Real-time messaging coming soon with WebSocket integration</p>
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Send</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
