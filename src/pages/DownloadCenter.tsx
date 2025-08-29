import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Calendar, 
  Eye, 
  Search,
  Filter,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Archive,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/stripe';
import { useToast } from '../components/Toast';
import { SkeletonList } from '../components/SkeletonLoader';

interface PurchasedDataset {
  id: string;
  order_id: string;
  dataset_id: string;
  download_count: number;
  last_downloaded: string | null;
  created_at: string;
  dataset: {
    id: string;
    title: string;
    description: string;
    provider: { name: string };
    category: { name: string };
    data_format: string[];
    record_count: number;
    size_description: string;
  };
  order: {
    order_number: string;
    total_amount: number;
    created_at: string;
  };
}

const DownloadCenter = () => {
  const [purchases, setPurchases] = useState<PurchasedDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormat, setFilterFormat] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    fetchPurchases();
  }, [user]);

  const fetchPurchases = async () => {
    if (!user || !supabase) {
      // Mock data for demo
      setPurchases([
        {
          id: '1',
          order_id: 'order-1',
          dataset_id: 'dataset-1',
          download_count: 3,
          last_downloaded: '2024-01-20T10:30:00Z',
          created_at: '2024-01-15T09:00:00Z',
          dataset: {
            id: 'dataset-1',
            title: 'Premium Health Insurance Leads - Q1 2024',
            description: 'High-quality health insurance leads with complete contact information',
            provider: { name: 'LeadGen Pro' },
            category: { name: 'Health Insurance' },
            data_format: ['CSV', 'Excel', 'JSON'],
            record_count: 5000,
            size_description: 'Large'
          },
          order: {
            order_number: 'ORD-2024-001',
            total_amount: 125.50,
            created_at: '2024-01-15T09:00:00Z'
          }
        },
        {
          id: '2',
          order_id: 'order-2',
          dataset_id: 'dataset-2',
          download_count: 1,
          last_downloaded: '2024-01-18T14:22:00Z',
          created_at: '2024-01-10T11:15:00Z',
          dataset: {
            id: 'dataset-2',
            title: 'Life Insurance Prospects - Verified',
            description: 'Pre-qualified life insurance prospects with income verification',
            provider: { name: 'InsureConnect' },
            category: { name: 'Life Insurance' },
            data_format: ['CSV', 'Excel'],
            record_count: 2500,
            size_description: 'Medium'
          },
          order: {
            order_number: 'ORD-2024-002',
            total_amount: 89.99,
            created_at: '2024-01-10T11:15:00Z'
          }
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          dataset:datasets(*),
          order:orders(*)
        `)
        .eq('order.user_id', user.id)
        .eq('order.status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (purchase: PurchasedDataset, format: string) => {
    setDownloadingId(purchase.id);
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would:
      // 1. Generate/fetch the file from secure storage
      // 2. Create a temporary download link
      // 3. Track the download in analytics
      // 4. Update download count
      
      success('Download Started', `${purchase.dataset.title} (${format}) is downloading`);
      
      // Update download count locally
      setPurchases(prev => prev.map(p => 
        p.id === purchase.id 
          ? { ...p, download_count: p.download_count + 1, last_downloaded: new Date().toISOString() }
          : p
      ));
      
    } catch (err) {
      error('Download Failed', 'Please try again or contact support');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.dataset.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFormat = filterFormat === 'all' || 
                         purchase.dataset.data_format.some(format => 
                           format.toLowerCase() === filterFormat.toLowerCase()
                         );
    
    return matchesSearch && matchesFormat;
  });

  const totalDownloads = purchases.reduce((sum, p) => sum + p.download_count, 0);
  const totalValue = purchases.reduce((sum, p) => sum + p.order.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Download Center</h1>
            <p className="text-gray-600 mt-2">Access your purchased insurance leads and datasets</p>
          </div>
          <SkeletonList count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Download Center</h1>
          <p className="text-gray-600 mt-2">Access your purchased insurance leads and datasets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
              </div>
              <Archive className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{totalDownloads}</p>
              </div>
              <Download className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your purchased datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select 
                value={filterFormat}
                onChange={(e) => setFilterFormat(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Formats</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>
          </div>
        </div>

        {/* Downloads List */}
        {filteredPurchases.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No downloads available</h3>
            <p className="text-gray-600 mb-6">Purchase some datasets to access them here.</p>
            <Link to="/marketplace" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPurchases.map((purchase) => (
              <div key={purchase.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {purchase.dataset.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-2">
                        by {purchase.dataset.provider.name}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {purchase.dataset.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Purchased {new Date(purchase.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Downloaded {purchase.download_count} times
                        </span>
                        {purchase.last_downloaded && (
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Last: {new Date(purchase.last_downloaded).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {purchase.dataset.category.name}
                      </span>
                    </div>
                  </div>

                  {/* Dataset Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{purchase.dataset.record_count.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{purchase.dataset.size_description}</div>
                      <div className="text-sm text-gray-600">Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{purchase.dataset.data_format.length}</div>
                      <div className="text-sm text-gray-600">Formats</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{formatPrice(purchase.order.total_amount)}</div>
                      <div className="text-sm text-gray-600">Paid</div>
                    </div>
                  </div>

                  {/* Download Options */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Download Options</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {purchase.dataset.data_format.map((format) => (
                        <button
                          key={format}
                          onClick={() => handleDownload(purchase, format)}
                          disabled={downloadingId === purchase.id}
                          className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {downloadingId === purchase.id ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          <span className="font-medium">{format}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <Link 
                        to={`/dataset/${purchase.dataset.id}`}
                        className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                      <Link 
                        to={`/orders/${purchase.order_id}`}
                        className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Order #{purchase.order.order_number}
                      </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Ready for Download
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help with Downloads?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Download Issues</h4>
              <p className="text-gray-600 text-sm mb-3">
                If you're experiencing download problems, try refreshing the page or contact our support team.
              </p>
              <Link to="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Contact Support →
              </Link>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Data Usage Guidelines</h4>
              <p className="text-gray-600 text-sm mb-3">
                Please review our data usage guidelines and compliance requirements before using the leads.
              </p>
              <Link to="/legal/data-usage" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View Guidelines →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadCenter;