import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, LogOut, Navigation, Phone, Check } from 'lucide-react';
import { UserData } from '../App';

interface DeliveryDashboardProps {
  user: UserData;
  onLogout: () => void;
}

const deliveryOrders = [
  {
    id: '#1235',
    restaurant: 'Sushi Master',
    customer: 'Jane Smith',
    address: '456 Oak Ave, Apt 3B',
    distance: '2.1 km',
    earnings: '$8.50',
    status: 'ready',
    estimatedTime: '25 min'
  },
  {
    id: '#1238',
    restaurant: 'Pizza Palace',
    customer: 'Tom Brown',
    address: '789 Pine St, Unit 12',
    distance: '1.8 km',
    earnings: '$6.75',
    status: 'ready',
    estimatedTime: '20 min'
  },
  {
    id: '#1239',
    restaurant: 'Burger Haven',
    customer: 'Lisa Davis',
    address: '321 Elm Dr, House 5',
    distance: '3.2 km',
    earnings: '$9.25',
    status: 'ready',
    estimatedTime: '30 min'
  }
];

const activeDelivery = {
  id: '#1234',
  restaurant: 'Italian Delights',
  customer: 'John Doe',
  customerPhone: '+1 (555) 123-4567',
  address: '123 Main St, Apt 2A',
  status: 'picked_up',
  estimatedTime: '15 min',
  earnings: '$7.25'
};

const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ user, onLogout }) => {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-green-600">Delivery Partner</h1>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isOnline ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isOnline ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
        {/* Today's Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-green-500" size={24} />
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">8.5</h3>
            <p className="text-gray-600 text-sm">Hours Online</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Check className="text-blue-500" size={24} />
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">12</h3>
            <p className="text-gray-600 text-sm">Deliveries</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-yellow-500" size={24} />
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">$96.50</h3>
            <p className="text-gray-600 text-sm">Earnings</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Navigation className="text-purple-500" size={24} />
              <span className="text-sm text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">45.2</h3>
            <p className="text-gray-600 text-sm">km Traveled</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Delivery */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Active Delivery</h3>
            </div>
            <div className="p-6">
              {activeDelivery ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{activeDelivery.id}</h4>
                      <p className="text-gray-600">{activeDelivery.restaurant}</p>
                    </div>
                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                      Picked Up
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <MapPin size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-800">{activeDelivery.customer}</p>
                        <p className="text-gray-600 text-sm">{activeDelivery.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>{activeDelivery.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-green-600 font-medium">
                          <DollarSign size={16} />
                          <span>{activeDelivery.earnings}</span>
                        </div>
                      </div>
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                        <Phone size={16} />
                        <span className="text-sm">Call</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors">
                      Mark as Delivered
                    </button>
                    <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      <Navigation size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No active deliveries</p>
              )}
            </div>
          </div>

          {/* Available Orders */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Available Orders</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {deliveryOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{order.id}</h4>
                        <p className="text-gray-600 text-sm">{order.restaurant}</p>
                      </div>
                      <span className="text-green-600 font-medium">{order.earnings}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{order.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{order.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{order.address}</p>
                    
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors">
                      Accept Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;