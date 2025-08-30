import React, { useState, useEffect } from 'react';
import { Plus, Settings, TrendingUp, DollarSign, Users, AlertCircle, CheckCircle, Clock, Facebook, Linkedin, Twitter, Globe, Zap, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserBalance } from '../lib/leadImport';
import { formatPrice } from '../lib/payments';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

interface LeadImportConfig {
  id: string;
  campaign_source: string;
  campaign_name: string;
  campaign_id: string;
  active: boolean;
  pricing: {
    cost_per_lead_cents: number;
  };
  created_at: string;
}

interface ImportedLead {
  id: string;
  source_platform: string;
  lead_data: any;
  quality_score: number;
  cost_cents: number;
  imported_at: string;
  status: string;
}

interface UserBalance {
  balance_cents: number;
  auto_recharge_enabled: boolean;
  recharge_threshold_cents: number;
  recharge_amount_cents: number;
}

const LeadImportDashboard: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [configs, setConfigs] = useState<LeadImportConfig[]>([]);
  const [recentLeads, setRecentLeads] = useState<ImportedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalSpent: 0,
    avgQuality: 0,
    activeConfigs: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);

      // Load user balance
      const userBalance = await getUserBalance(user.id);
      setBalance(userBalance);

      // Load import configurations
      const { data: configData, error: configError } = await supabase
        .from('lead_import_configs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (configError) {
        console.error('Error loading configs:', configError);
      } else {
        setConfigs(configData || []);
      }

      // Load recent leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('imported_leads')
        .select('*')
        .eq('user_id', user.id)
        .order('imported_at', { ascending: false })
        .limit(10);

      if (leadsError) {
        console.error('Error loading leads:', leadsError);
      } else {
        setRecentLeads(leadsData || []);
      }

      // Calculate stats
      if (leadsData) {
        const totalSpent = leadsData.reduce((sum: number, lead: any) => sum + lead.cost_cents, 0);
        const avgQuality = leadsData.length > 0 
          ? leadsData.reduce((sum: number, lead: any) => sum + lead.quality_score, 0) / leadsData.length 
          : 0;

        setStats({
          totalLeads: leadsData.length,
          totalSpent,
          avgQuality,
          activeConfigs: (configData || []).filter((c: any) => c.active).length
        });
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = async (amount: number) => {
    // In a real implementation, this would redirect to Stripe checkout
    console.log(`Recharge $${amount}`);
    alert(`Redirecting to payment for $${amount} recharge...`);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'linkedin': return <Linkedin className="w-5 h-5 text-blue-700" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'google': return <Globe className="w-5 h-5 text-red-500" />;
      default: return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lead Import <span className="bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-gray-600">Manage automated lead imports from advertising platforms</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
              <div className="text-3xl font-bold">
                {balance ? formatPrice(balance.balance_cents) : '$0.00'}
              </div>
              <p className="text-green-100 text-sm mt-1">
                Available for lead imports
              </p>
            </div>
            <div className="text-right space-y-2">
              <button
                onClick={() => handleRecharge(100)}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Add Funds
              </button>
              {balance?.auto_recharge_enabled && (
                <div className="text-green-100 text-xs">
                  <Zap className="w-3 h-3 inline mr-1" />
                  Auto-recharge enabled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Quality</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgQuality.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Configs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeConfigs}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Import Configurations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Import Configurations</h3>
                  <button
                    onClick={() => setShowSetupModal(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Import
                  </button>
                </div>
              </div>

              <div className="p-6">
                {configs.length === 0 ? (
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Import Configurations</h4>
                    <p className="text-gray-500 mb-4">Set up your first automated lead import from advertising platforms.</p>
                    <button
                      onClick={() => setShowSetupModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Get Started
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {configs.map((config) => (
                      <div key={config.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getPlatformIcon(config.campaign_source)}
                            <div>
                              <h4 className="font-medium text-gray-900">{config.campaign_name}</h4>
                              <p className="text-sm text-gray-500">
                                {formatPrice(config.pricing.cost_per_lead_cents)} per lead
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              config.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {config.active ? 'Active' : 'Inactive'}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Leads */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
              </div>

              <div className="p-6">
                {recentLeads.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No leads imported yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentLeads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getPlatformIcon(lead.source_platform)}
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {lead.lead_data.first_name} {lead.lead_data.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{lead.lead_data.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {getStatusIcon(lead.status)}
                            <span className="text-xs text-gray-500">{lead.quality_score}%</span>
                          </div>
                          <p className="text-xs font-medium text-gray-900">
                            {formatPrice(lead.cost_cents)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleRecharge(100)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add $100 to Balance
                </button>
                <button
                  onClick={loadDashboardData}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Settings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Modal */}
        {showSetupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Platform</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSetupModal(false);
                    // Open Facebook setup instructions
                    alert('Facebook Lead Ads Setup:\n\n1. Go to Facebook Business Manager\n2. Navigate to Lead Ads\n3. Set up webhook URL: https://your-domain.com/api/webhooks/facebook\n4. Add your access token in settings\n\nFor detailed setup instructions, visit our documentation or contact support.');
                  }}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Facebook Lead Ads</p>
                    <p className="text-sm text-gray-500">Import leads from Facebook campaigns</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setShowSetupModal(false);
                    alert('Google Ads Integration:\n\nThis feature is currently in development. \n\nExpected release: Q2 2024\n\nTo get notified when available:\n• Contact our support team\n• Check our documentation for updates\n• Subscribe to our newsletter\n\nIn the meantime, you can manually import Google Ads leads using our CSV upload feature.');
                  }}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Globe className="w-6 h-6 text-red-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Google Ads</p>
                    <p className="text-sm text-gray-500">In development - Click for details</p>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    setShowSetupModal(false);
                    alert('LinkedIn Ads Integration:\n\nThis feature is currently in development.\n\nExpected release: Q3 2024\n\nTo get notified when available:\n• Contact our support team\n• Check our documentation for updates\n• Subscribe to our newsletter\n\nIn the meantime, you can manually import LinkedIn leads using our CSV upload feature.');
                  }}
                  className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Linkedin className="w-6 h-6 text-blue-700 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">LinkedIn Ads</p>
                    <p className="text-sm text-gray-500">In development - Click for details</p>
                  </div>
                </button>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadImportDashboard;

