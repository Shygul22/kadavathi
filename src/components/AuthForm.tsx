import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User, ShoppingBag, Truck, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const roles = [
  { value: 'customer', label: 'Customer', icon: User, color: 'bg-blue-500', description: 'Order food from restaurants' },
  { value: 'restaurant_owner', label: 'Restaurant Owner', icon: ShoppingBag, color: 'bg-orange-500', description: 'Manage your restaurant' },
  { value: 'delivery_partner', label: 'Delivery Partner', icon: Truck, color: 'bg-green-500', description: 'Deliver orders to customers' },
];

const signInSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const signUpSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  full_name: yup.string().required('Full name is required'),
  role: yup.string().oneOf(['customer', 'restaurant_owner', 'delivery_partner']).required('Role is required'),
  phone: yup.string().optional(),
});

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    resolver: yupResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      role: 'customer'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(data.email, data.password, {
          full_name: data.full_name,
          role: data.role,
          phone: data.phone
        });
        toast.success('Account created successfully! Please check your email to verify your account.');
      } else {
        await signIn(data.email, data.password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FoodFlow</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isSignUp && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose your role
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map(({ value, label, icon: Icon, color, description }) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        value={value}
                        {...register('role')}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedRole === value
                          ? `${color} text-white border-transparent shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <Icon size={20} />
                          <div>
                            <div className="font-medium">{label}</div>
                            <div className={`text-xs ${selectedRole === value ? 'text-white/80' : 'text-gray-500'}`}>
                              {description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register('full_name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  {...register('phone')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password')}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          {isSignUp && (
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                {...register('confirmPassword')}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="text-orange-600 font-medium mb-1">⚠️ Demo accounts need to be created first</div>
            <div>Create accounts with these credentials:</div>
            <div>• customer@demo.com / password123 (Customer)</div>
            <div>• restaurant@demo.com / password123 (Restaurant)</div>
            <div>• delivery@demo.com / password123 (Delivery Partner)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;