'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voucherForm, setVoucherForm] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    maxUses: '',
  });

  useEffect(() => {
    if (user?.userType !== 'ADMIN') {
      router.push('/login');
    } else {
      loadDashboardData();
    }
  }, [user, router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // For now, using mock data
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', type: 'CUSTOMER', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'CUSTOMER', status: 'active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', type: 'WORKER', status: 'blocked' },
      ]);
      setWorkers([
        { id: 1, name: 'Alice Johnson', service: 'Plumbing', rating: 4.8, bookings: 42 },
        { id: 2, name: 'Charlie Brown', service: 'Electrical', rating: 4.5, bookings: 28 },
      ]);
      setBookings([
        { id: 1, customer: 'John Doe', worker: 'Alice Johnson', status: 'completed', amount: 150 },
        { id: 2, customer: 'Jane Smith', worker: 'Charlie Brown', status: 'pending', amount: 200 },
      ]);
      setVouchers([
        { id: 1, code: 'SAVE10', discount: 10, expiryDate: '2026-12-31', active: true },
        { id: 2, code: 'SUMMER20', discount: 20, expiryDate: '2026-08-31', active: true },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: number) => {
    try {
      // TODO: Call API to block user
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'blocked' } : u));
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      // TODO: Call API to unblock user
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Call API to create voucher
      const newVoucher = {
        id: vouchers.length + 1,
        ...voucherForm,
        discount: parseInt(voucherForm.discount),
        active: true,
      };
      setVouchers([...vouchers, newVoucher]);
      setVoucherForm({ code: '', discount: '', expiryDate: '', maxUses: '' });
    } catch (error) {
      console.error('Failed to create voucher:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.firstName}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-gray-600 text-sm">Total Users</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{users.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 text-sm">Active Workers</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{workers.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 text-sm">Total Bookings</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 text-sm">Active Vouchers</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{vouchers.filter(v => v.active).length}</div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="workers">Workers</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{user.name}</td>
                          <td className="py-3 px-4 text-gray-600">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              user.type === 'CUSTOMER'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 space-x-2">
                            {user.status === 'active' ? (
                              <Button
                                onClick={() => handleBlockUser(user.id)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                              >
                                Block
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleUnblockUser(user.id)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                Unblock
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Workers Tab */}
            <TabsContent value="workers" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Worker Management</h3>
                <div className="grid grid-cols-1 gap-4">
                  {workers.map(worker => (
                    <Card key={worker.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{worker.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">Service: {worker.service}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm text-gray-600">Rating: <span className="font-semibold">{worker.rating}</span></span>
                            <span className="text-sm text-gray-600">Bookings: <span className="font-semibold">{worker.bookings}</span></span>
                          </div>
                        </div>
                        <Button variant="outline" className="text-gray-600">
                          View Profile
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Worker</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{booking.customer}</td>
                          <td className="py-3 px-4 text-gray-600">{booking.worker}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900">${booking.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Vouchers Tab */}
            <TabsContent value="vouchers" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Manage Vouchers</h3>

                {/* Create Voucher Form */}
                <Card className="p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-4">Create New Voucher</h4>
                  <form onSubmit={handleCreateVoucher} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Voucher Code
                        </label>
                        <Input
                          name="code"
                          value={voucherForm.code}
                          onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value })}
                          placeholder="SAVE10"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount (%)
                        </label>
                        <Input
                          name="discount"
                          type="number"
                          value={voucherForm.discount}
                          onChange={(e) => setVoucherForm({ ...voucherForm, discount: e.target.value })}
                          placeholder="10"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <Input
                          name="expiryDate"
                          type="date"
                          value={voucherForm.expiryDate}
                          onChange={(e) => setVoucherForm({ ...voucherForm, expiryDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Uses (Optional)
                        </label>
                        <Input
                          name="maxUses"
                          type="number"
                          value={voucherForm.maxUses}
                          onChange={(e) => setVoucherForm({ ...voucherForm, maxUses: e.target.value })}
                          placeholder="100"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Create Voucher
                    </Button>
                  </form>
                </Card>

                {/* Vouchers List */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Active Vouchers</h4>
                  {vouchers.map(voucher => (
                    <Card key={voucher.id} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">{voucher.code}</div>
                        <div className="text-sm text-gray-600">
                          {voucher.discount}% off • Expires: {voucher.expiryDate}
                        </div>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        voucher.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {voucher.active ? 'Active' : 'Inactive'}
                      </span>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
