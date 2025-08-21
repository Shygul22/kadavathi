import React, { useState } from 'react';
import { User, ShoppingBag, Truck, Shield } from 'lucide-react';
import { UserData, UserRole } from '../App';

interface LoginFormProps {
  onLogin: (userData: UserData) => void;
}

const roles: { role: UserRole; icon: React.ReactNode; title: string; color: string }[] = [
  { role: 'customer', icon: <User size={24} />, title: 'Customer', color: 'bg-blue-500' },
  { role: 'shop', icon: <ShoppingBag size={24} />, title: 'Shop Owner', color: 'bg-orange-500' },
  { role: 'delivery', icon: <Truck size={24} />, title: 'Delivery Partner', color: 'bg-green-500' },
  { role: 'admin', icon: <Shield size={24} />, title: 'Admin', color: 'bg-purple-500' },
];

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: selectedRole,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FoodFlow</h1>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {roles.map(({ role, icon, title, color }) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  selectedRole === role
                    ? `${color} text-white border-transparent shadow-lg scale-105`
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                {icon}
                <span className="text-sm font-medium">{title}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;