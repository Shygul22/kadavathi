import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import LoadingSpinner from './components/LoadingSpinner';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import DeliveryDashboard from './components/DeliveryDashboard';
import ShopDashboard from './components/ShopDashboard';

function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <>
        <AuthForm />
        <Toaster position="top-right" />
      </>
    );
  }

  const renderDashboard = () => {
    switch (profile.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'delivery_partner':
        return <DeliveryDashboard />;
      case 'restaurant_owner':
        return <ShopDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">{renderDashboard()}</div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;