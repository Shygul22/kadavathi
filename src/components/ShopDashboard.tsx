import React, { useState } from 'react';
import { Plus, Edit, Eye, DollarSign, LogOut, ShoppingBag, Clock, Users } from 'lucide-react';
import { UserData } from '../App';

interface ShopDashboardProps {
  user: UserData;
  onLogout: () => void;
}

const menuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and fresh basil',
    price: 18.99,
    category: 'Pizza',
    available: true,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and pepperoni',
    price: 21.99,
    category: 'Pizza',
    available: true,
    image: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    price: 12.99,
    category: 'Salad',
    available: false,
    image: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const recentOrders = [
  { id: '#1234', customer: 'John Doe', items: 'Margherita Pizza x2', status: 'Preparing', total: '$37.98', time: '10 min ago' },
  { id: '#1235', customer: 'Jane Smith', items: 'Pepperoni Pizza, Caesar Salad', status: 'Ready', total: '$34.98', time: '15 min ago' },
  { id: '#1236', customer: 'Mike Johnson', items: 'Margherita Pizza', status: 'Completed', total: '$18.99', time: '25 min ago' },
];

const ShopDashboard: React.FC<ShopDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddItem, setShowAddItem] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'menu', label: 'Menu Management' },
    { id: 'orders', label: 'Orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-600">Restaurant Portal</h1>
              <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                Open
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className="text-orange-500" size={24} />
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">24</h3>
                <p className="text-gray-600 text-sm">Orders</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-green-500" size={24} />
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">$456</h3>
                <p className="text-gray-600 text-sm">Revenue</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-blue-500" size={24} />
                  <span className="text-sm text-gray-500">Avg</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">18</h3>
                <p className="text-gray-600 text-sm">Prep Time (min)</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Users className="text-purple-500" size={24} />
                  <span className="text-sm text-gray-500">Total</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">142</h3>
                <p className="text-gray-600 text-sm">Customers</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold text-gray-800">{order.id}</h4>
                            <p className="text-gray-600 text-sm">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-gray-800">{order.items}</p>
                            <p className="text-gray-500 text-sm">{order.time}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Completed'
                              ? 'bg-green-100 text-green-600'
                              : order.status === 'Ready'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="font-semibold text-gray-800">{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
              <button
                onClick={() => setShowAddItem(true)}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                <Plus size={20} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <span className="text-lg font-bold text-orange-600">${item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.available ? 'Available' : 'Out of Stock'}
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-orange-600 transition-colors">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Orders Management</h3>
            <p className="text-gray-600">Detailed order management features coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDashboard;