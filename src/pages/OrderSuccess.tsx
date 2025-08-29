import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Download, Receipt, ArrowRight, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, getUserDownloads, formatPrice } from '../lib/payments';
import LoadingSpinner from '../components/LoadingSpinner';

interface OrderDetails {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount_cents: number;
  created_at: string;
  order_items: Array<{
    id: string;
    price_cents: number;
    quantity: number;
    datasets: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
}

interface DownloadItem {
  id: string;
  file_format: string;
  file_size: number;
  download_url: string;
  expires_at: string;
  datasets: {
    id: string;
    title: string;
    slug: string;
    description: string;
  };
}

const OrderSuccess: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || !orderId) {
      return;
    }

    loadOrderDetails();
  }, [user, authLoading, orderId]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user orders and find the specific order
      const orders = await getUserOrders(user!.id);
      const foundOrder = orders.find(o => o.id === orderId);
      
      if (!foundOrder) {
        setError('Order not found');
        return;
      }

      setOrder(foundOrder);

      // Load downloads for this user
      const userDownloads = await getUserDownloads(user!.id);
      setDownloads(userDownloads);

    } catch (err: any) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl: string, filename: string) => {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // For demo purposes, open in new tab if direct download fails
      window.open(downloadUrl, '_blank');
    }
  };

  // Show loading while checking auth
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if not authenticated or no order ID
  if (!user || !orderId) {
    return <Navigate to="/" replace />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Order Not Found</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Marketplace
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const orderDate = new Date(order.created_at);
  const orderDownloads = downloads.filter(d => 
    order.order_items.some(item => item.datasets.id === d.datasets.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.status}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Receipt className="w-4 h-4 mr-2" />
                  Order Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Order Number:</span> {order.order_number}</p>
                  <p><span className="text-gray-500">Total:</span> {formatPrice(order.total_amount_cents)}</p>
                  <p><span className="text-gray-500">Payment Status:</span> 
                    <span className="ml-1 font-medium text-green-600">{order.payment_status}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Order Date
                </h3>
                <div className="text-sm">
                  <p>{orderDate.toLocaleDateString()}</p>
                  <p className="text-gray-500">{orderDate.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Items Purchased</h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.datasets.title}</h4>
                      <p className="text-sm text-gray-500">Digital Download</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price_cents)}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Downloads Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Your Downloads
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Download links are valid for 30 days from purchase date
            </p>
          </div>
          
          <div className="p-6">
            {orderDownloads.length > 0 ? (
              <div className="space-y-4">
                {orderDownloads.map((download) => {
                  const expiresAt = new Date(download.expires_at);
                  const isExpired = expiresAt < new Date();
                  
                  return (
                    <div key={download.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{download.datasets.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{download.datasets.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Format: {download.file_format.toUpperCase()}</span>
                          {download.file_size && (
                            <span>Size: {(download.file_size / 1024 / 1024).toFixed(1)} MB</span>
                          )}
                          <span>Expires: {expiresAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {isExpired ? (
                          <span className="text-red-600 text-sm font-medium">Expired</span>
                        ) : (
                          <button
                            onClick={() => handleDownload(
                              download.download_url,
                              `${download.datasets.title}.${download.file_format}`
                            )}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Download className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Your downloads are being prepared and will be available shortly.</p>
                <p className="text-sm mt-2">Please check your email for download links.</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            What's Next?
          </h3>
          <div className="space-y-2 text-green-800">
            <p>• A confirmation email has been sent to your inbox</p>
            <p>• Download your files using the buttons above</p>
            <p>• Access your purchase history in your account dashboard</p>
            <p>• Contact support if you have any questions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/account/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Receipt className="w-4 h-4 mr-2" />
            View All Orders
          </Link>
          
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Need help? Contact our{' '}
            <Link to="/support" className="text-green-600 hover:text-green-700 font-medium">
              support team
            </Link>
            {' '}or check your{' '}
            <Link to="/account" className="text-green-600 hover:text-green-700 font-medium">
              account dashboard
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

