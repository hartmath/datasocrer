import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCartContext } from '../contexts/CartContext';
import { useContent } from '../contexts/ContentContext';
import { supabase } from '../lib/supabase';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import CartDrawer from './CartDrawer';

interface HeaderProps {
  // No props needed
}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { getCartCount } = useCartContext();
  const { getContent } = useContent();

  const isActive = (path: string) => location.pathname === path;

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.email === 'admin@datacsv.com' || 
                  (user?.user_metadata as any)?.role === 'admin';

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={getContent('brand.logo', '/E97CB547-02C1-460A-88F1-B2999CB9B271.png')} 
                alt={`${getContent('brand.name', 'DataCSV')} Logo`} 
                className="h-10 w-10 mr-3"
              />
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  {getContent('brand.name', 'DataCSV')}
                </span>
                <div className="text-xs text-gray-500 -mt-1">{getContent('brand.tagline', 'Premium Data Marketplace')}</div>
              </div>
            </Link>
            
            {/* Supabase Connection Status */}
            {!supabase && (
              <div className="ml-4 hidden lg:flex items-center">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center cursor-pointer" 
                     onClick={() => window.open('https://supabase.com/dashboard', '_blank')}>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Database not connected - Click to setup
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/marketplace" 
              className={`font-medium transition-colors ${isActive('/marketplace') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Browse Data
            </Link>
            
            <Link 
              to="/lead-generation" 
              className={`font-medium transition-colors ${isActive('/lead-generation') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Lead Generation
            </Link>
            
            <Link 
              to="/pricing" 
              className={`font-medium transition-colors ${isActive('/pricing') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Pricing
            </Link>
            
            {user && (
              <Link 
                to="/lead-import" 
                className={`font-medium transition-colors ${isActive('/lead-import') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                Lead Import
              </Link>
            )}
            
            <Link 
              to="/resources" 
              className={`font-medium transition-colors ${isActive('/resources') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Resources
            </Link>
            
            <Link 
              to="/support" 
              className={`font-medium transition-colors ${isActive('/support') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
            >
              Support
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`font-medium transition-colors ${isActive('/admin') ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {!loading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="hidden md:flex items-center space-x-3">
                    <button 
                      onClick={() => openAuthModal('signin')}
                      className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md font-medium transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => openAuthModal('signup')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-300 shadow-lg shadow-green-500/25"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </>
            )}
            
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search datasets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <Link 
                to="/marketplace" 
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Data
              </Link>
              <Link 
                to="/lead-generation" 
                className="text-gray-700 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Lead Generation
              </Link>
              <Link 
                to="/pricing" 
                className={`font-medium ${isActive('/pricing') ? 'text-green-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              {user && (
                <Link 
                  to="/lead-import" 
                  className={`font-medium ${isActive('/lead-import') ? 'text-green-600' : 'text-gray-700'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Lead Import
                </Link>
              )}
              <Link 
                to="/resources" 
                className={`font-medium ${isActive('/resources') ? 'text-green-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/support" 
                className={`font-medium ${isActive('/support') ? 'text-green-600' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              
              {!loading && !user && (
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      openAuthModal('signin');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-700 hover:text-green-600 font-medium"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      openAuthModal('signup');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-300 text-left shadow-lg shadow-green-500/25"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </header>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};

export default Header;