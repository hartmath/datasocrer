import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Database, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/stripe';
import { useToast } from '../../components/Toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, info } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDatasets: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    activeProviders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [topDatasets, setTopDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    if (!supabase) {
      // Mock data for demo
      setStats({
        totalUsers: 1247,
        totalDatasets: 156,
        totalOrders: 3892,
        totalRevenue: 284750,
        pendingOrders: 23,
        activeProviders: 12
      });
      setRecentOrders([
        {
          id: '1',
          order_number: 'ORD-2024-001',
          user_email: 'john@example.com',
          total_amount: 125.50,
          status: 'completed',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          order_number: 'ORD-2024-002',
          user_email: 'sarah@example.com',
          total_amount: 89.99,
          status: 'pending',
          created_at: new Date().toISOString()
        }
      ]);
      setRecentUsers([
        {
          id: '1',
          email: 'newuser@example.com',
          user_metadata: { firstName: 'John', lastName: 'Doe' },
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString()
        }
      ]);
      setTopDatasets([
        {
          id: '1',
          title: 'Health Insurance Leads Q1',
          total_downloads: 1250,
          revenue: 15600
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      // Fetch real data from Supabase
      const [usersRes, datasetsRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*').limit(5),
        supabase.from('datasets').select('*').limit(5),
        supabase.from('orders').select('*').limit(5)
      ]);

      // Calculate stats
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalDatasets: datasetsRes.data?.length || 0,
        totalOrders: ordersRes.data?.length || 0,
        totalRevenue: ordersRes.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0,
        pendingOrders: ordersRes.data?.filter(o => o.status === 'pending').length || 0,
        activeProviders: 12
      });

      setRecentOrders(ordersRes.data || []);
      setRecentUsers(usersRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    info('Export Started', 'Preparing data export. This may take a few minutes.');
    // In real implementation, this would trigger a data export
  };

  const handleViewReports = () => {
    info('Reports Loading', 'Advanced analytics reports are being prepared.');
    // In real implementation, this would navigate to reports page
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    info('Edit User', 'User edit functionality would open here');
    // In real implementation, this would open edit modal or navigate to edit page
  };
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'datasets', label: 'Datasets', icon: Database },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Datasets',
      value: stats.totalDatasets.toLocaleString(),
      change: '+8%',
      icon: Database,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+23%',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Revenue',
      value: formatPrice(stats.totalRevenue),
      change: '+15%',
      icon: DollarSign,
      color: 'from-orange-500 to-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your Data Sorcerer marketplace</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                      <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{order.order_number}</p>
                            <p className="text-sm text-gray-600">{order.user_email}</p>
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
                      ))}
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                      <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{user.email}</p>
                            <p className="text-sm text-gray-600">
                              Joined {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-700">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <Link to="/admin/datasets" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Plus className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Add Dataset</span>
                    </Link>
                    <Link to="/admin/users" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                      <Users className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Manage Users</span>
                    </Link>
                    <Link to="/admin/content" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                      <Settings className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Edit Content</span>
                    </Link>
                    <button onClick={handleExportData} className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                      <Download className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Export Data</span>
                    </button>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 mt-4">
                    <button onClick={handleViewReports} className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
                      <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">View Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => info('Filter Options', 'User filtering options would appear here')}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                    <button 
                      onClick={handleExportData}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                    <Link 
                      to="/admin/users"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Full User Management
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {((user.user_metadata?.firstName || user.email) || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.user_metadata?.firstName && user.user_metadata?.lastName 
                                ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
                                : 'No name provided'
                              }
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(user.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user.id)}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user.id)}
                            className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link 
                    to="/admin/users"
                    className="block w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    View All Users →
                  </Link>
                </div>
              </div>
            )}

            {/* Datasets Tab */}
            {activeTab === 'datasets' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dataset Management</h3>
                  <div className="flex items-center space-x-4">
                    <Link 
                      to="/admin/datasets"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Dataset
                    </Link>
                    <Link 
                      to="/admin/datasets"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Full Dataset Management
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {topDatasets.slice(0, 5).map((dataset) => (
                    <div key={dataset.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{dataset.title}</p>
                            <p className="text-sm text-gray-600">by {dataset.provider?.name}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <span>{formatPrice(dataset.price)}</span>
                              <span>{dataset.total_downloads} downloads</span>
                              <span className={`px-2 py-1 rounded-full ${dataset.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {dataset.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/dataset/${dataset.slug}`}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => info('Edit Dataset', `Edit functionality for ${dataset.title} would open here`)}
                            className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link 
                    to="/admin/datasets"
                    className="block w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    View All Datasets →
                  </Link>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                  <div className="flex items-center space-x-4">
                    <select 
                      onChange={(e) => info('Filter Applied', `Filtering orders by: ${e.target.value}`)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>All Orders</option>
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <button 
                      onClick={handleExportData}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.order_number}</p>
                          <p className="text-sm text-gray-600">{order.user_email}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatPrice(order.total_amount)}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                          <div className="flex items-center space-x-2 mt-2">
                            <button 
                              onClick={() => info('Order Details', `Viewing details for order ${order.order_number}`)}
                              className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => info('Edit Order', `Edit functionality for order ${order.order_number} would open here`)}
                              className="text-gray-600 hover:text-gray-700 p-1 rounded hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => info('All Orders', 'Full order management interface would load here')}
                    className="block w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    View All Orders →
                  </button>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics & Reports</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Revenue Analytics</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Revenue charts would be displayed here</p>
                        <button 
                          onClick={handleViewReports}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Generate Report
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">User Growth</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">User growth charts would be displayed here</p>
                        <button 
                          onClick={() => info('User Analytics', 'User growth analytics would load here')}
                          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          View Analytics
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Revenue Report</h4>
                    <p className="text-gray-600 text-sm mb-4">Monthly revenue breakdown</p>
                    <button 
                      onClick={() => info('Revenue Report', 'Generating monthly revenue report...')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">User Activity</h4>
                    <p className="text-gray-600 text-sm mb-4">User engagement metrics</p>
                    <button 
                      onClick={() => info('User Activity', 'Loading user activity analytics...')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      View Report
                    </button>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                    <Database className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Dataset Performance</h4>
                    <p className="text-gray-600 text-sm mb-4">Top performing datasets</p>
                    <button 
                      onClick={() => setActiveTab('datasets')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      View Datasets
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;