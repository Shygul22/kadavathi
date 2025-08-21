import React, { useState } from 'react';
import { Users, ShoppingBag, Truck, TrendingUp, LogOut, BarChart3, Settings } from 'lucide-react';
import { UserData } from '../App';

interface AdminDashboardProps {
  user: UserData;
  onLogout: () => void;
}

const stats = [
  { title: 'Total Orders', value: '1,247', change: '+12%', icon: ShoppingBag, color: 'bg-blue-500' },
  { title: 'Active Users', value: '8,392', change: '+8%', icon: Users, color: 'bg-green-500' },
  { title: 'Delivery Partners', value: '156', change: '+3%', icon: Truck, color: 'bg-yellow-500' },
  { title: 'Revenue', value: '$23,456', change: '+18%', icon: TrendingUp, color: 'bg-purple-500' },
];

const recentOrders = [
  { id: '#1234', customer: 'John Doe', restaurant: 'Italian Delights', status: 'Delivered', amount: '$28.50' },
  { id: '#1235', customer: 'Jane Smith', restaurant: 'Sushi Master', status: 'In Transit', amount: '$45.20' },
  { id: '#1236', customer: 'Mike Johnson', restaurant: 'Burger Haven', status: 'Preparing', amount: '$19.99' },
  { id: '#1237', customer: 'Sarah Wilson', restaurant: 'Spice Garden', status: 'Delivered', amount: '$32.75' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen">
          <nav className="mt-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                  activeTab === id
                    ? 'bg-purple-50 text-purple-600 border-r-2 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(({ title, value, change, icon: Icon, color }) => (
                  <div key={title} className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${color}`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <span className="text-sm text-green-600 font-medium">{change}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
                    <p className="text-gray-600 text-sm">{title}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 text-sm">
                          <th className="pb-4">Order ID</th>
                          <th className="pb-4">Customer</th>
                          <th className="pb-4">Restaurant</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-4">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-100">
                            <td className="py-4 font-medium text-gray-800">{order.id}</td>
                            <td className="py-4 text-gray-600">{order.customer}</td>
                            <td className="py-4 text-gray-600">{order.restaurant}</td>
                            <td className="py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'Delivered'
                                    ? 'bg-green-100 text-green-600'
                                    : order.status === 'In Transit'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-yellow-100 text-yellow-600'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 font-medium text-gray-800">{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Section
              </h3>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;