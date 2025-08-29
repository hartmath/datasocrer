import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCartContext } from '../contexts/CartContext';
import { supabase } from '../lib/supabase';
import { Order, Dataset } from '../types';
import { formatPrice } from '../lib/stripe';
import { useDatasets } from '../hooks/useDatasets';
import { 
  User, 
  CreditCard, 
  Download, 
  TrendingUp, 
  ShoppingCart, 
  Calendar,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Heart
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { getCartCount, getCartTotal } = useCartContext();
  const { datasets } = useDatasets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !supabase) return;

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const totalDatasets = datasets.length;
  const totalProviders = new Set(datasets.map(d => d.provider_id)).size;
  const totalDownloads = datasets.reduce((sum, d) => sum + d.total_downloads, 0);

  const stats = [
    {
      title: 'Total Purchases',
      value: orders.length.toString(),
      change: '+12%',
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Cart Items',
      value: getCartCount().toString(),
      change: '+8%',
      icon: Download,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Cart Total',
      value: formatPrice(getCartTotal()),
      change: '+2.3%',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Monthly Spend',
      value: formatPrice(orders.reduce((sum, order) => sum + order.total_amount, 0)),
      change: '+15%',
      icon: CreditCard,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const marketplaceStats = [
    {
      title: 'Available Datasets',
      value: totalDatasets.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Verified Providers',
      value: totalProviders.toString(),
      icon: User,
      color: 'text-green-600'
    },
    {
      title: 'Total Downloads',
      value: totalDownloads.toLocaleString() + '+',
      icon: Download,
      color: 'text-purple-600'
    }
  ];
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {
              user?.user_metadata?.firstName && user?.user_metadata?.lastName 
                ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
                : user?.user_metadata?.first_name && user?.user_metadata?.last_name
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                : user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
            }!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your insurance lead activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Marketplace Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex p-3 rounded-lg bg-gray-50 mb-3`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Purchases */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Purchases</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No purchases yet</p>
                      <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium">
                        Browse Marketplace
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Order #{order.order_number}</h3>
                        <p className="text-sm text-gray-600">Order placed</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatPrice(order.total_amount)}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    ))
                  )}
                </div>
                <Link to="/orders" className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm block text-center">
                  View All Purchases
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/marketplace" className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium">Browse New Leads</span>
                  </div>
                </Link>
                <Link to="/orders" className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-medium">Order History</span>
                  </div>
                </Link>
                <Link to="/wishlist" className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-red-600 mr-3" />
                    <span className="font-medium">My Wishlist</span>
                  </div>
                </Link>
                <Link to="/downloads" className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium">Download Center</span>
                  </div>
                </Link>
                <Link to="/account/settings" className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="font-medium">Account Settings</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.user_metadata?.firstName && user?.user_metadata?.lastName 
                        ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
                        : user?.user_metadata?.first_name && user?.user_metadata?.last_name
                        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                        : user?.user_metadata?.full_name || 'User'
                      }
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Professional Plan</p>
                    <p className="text-sm text-gray-600">$299/month</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">Email & SMS enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;