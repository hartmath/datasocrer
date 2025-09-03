import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ContentProvider } from './contexts/ContentContext';
import { ToastContainer, useToast } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import LogoIntro from './components/LogoIntro';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import LeadGeneration from './pages/LeadGeneration';
import LeadTypes from './pages/LeadTypes';
import BrowseData from './pages/BrowseData';
import ForBusiness from './pages/ForBusiness';
import Dashboard from './pages/Dashboard';
import DatasetDetail from './pages/DatasetDetail';
import DatasetDetails from './pages/DatasetDetails';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import DownloadCenter from './pages/DownloadCenter';
import AccountSettings from './pages/AccountSettings';
import Support from './pages/Support';
import Resources from './pages/Resources';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DatasetManagement from './pages/admin/DatasetManagement';
import ContentManagement from './pages/admin/ContentManagement';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import LeadImportDashboard from './pages/LeadImportDashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminRoute from './components/AdminRoute';

function App() {
  const { toasts, removeToast } = useToast();
  const [showIntro, setShowIntro] = useState(true);

  // Check if intro has been shown before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('datacsv_intro_seen');
    // For development/testing, you can force show intro by commenting out this line
    // if (hasSeenIntro) {
    //   setShowIntro(false);
    // }
    
    // Uncomment the line below to force show intro every time
    setShowIntro(true);
  }, []);

  const handleIntroComplete = () => {
    localStorage.setItem('datacsv_intro_seen', 'true');
    setShowIntro(false);
  };

  // Function to manually reset intro (for testing)
  const resetIntro = () => {
    localStorage.removeItem('datacsv_intro_seen');
    setShowIntro(true);
  };

  // Add reset button to window for easy access during development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).resetIntro = resetIntro;
      console.log('🔧 Development mode: Use window.resetIntro() to reset the intro');
    }
  }, []);

  if (showIntro) {
    return <LogoIntro onComplete={handleIntroComplete} />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ContentProvider>
          <Router>
            <div className="min-h-screen bg-white">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/browse-data" element={<BrowseData />} />
                <Route path="/dataset/:slug" element={<DatasetDetail />} />
                <Route path="/datasets/:id" element={<DatasetDetails />} />
                <Route path="/lead-generation" element={<LeadGeneration />} />
                <Route path="/lead-types" element={<LeadTypes />} />
                <Route path="/for-business" element={<ForBusiness />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/downloads" element={<DownloadCenter />} />
                <Route path="/account/settings" element={<AccountSettings />} />
                <Route path="/support" element={<Support />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/datasets" element={<AdminRoute><DatasetManagement /></AdminRoute>} />
                                  <Route path="/admin/content" element={<AdminRoute><ContentManagement /></AdminRoute>} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/lead-import" element={<LeadImportDashboard />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
              </Routes>
              <Footer />
              <ToastContainer toasts={toasts} onClose={removeToast} />
            </div>
          </Router>
          </ContentProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;