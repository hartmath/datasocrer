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
                  user?.email === 'admin@datasorcerer.com' ||  // Add your email here
                  user?.email === 'hartmath@gmail.com' ||  // Add your email here
                  (user?.user_metadata as any)?.role === 'admin';

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section - Logo & Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <img 
                    src={getContent('brand.logo', '/E97CB547-02C1-460A-88F1-B2999CB9B271.png')} 
                    alt={`${getContent('brand.name', 'DataCSV')} Logo`} 
                    className="h-8 w-8 mr-3 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm group-hover:bg-green-400/30 transition-all duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent leading-tight">
                    {getContent('brand.name', 'DataCSV')}
                  </h1>
                  <p className="text-xs text-gray-600 font-medium -mt-0.5">
                    {getContent('brand.tagline', 'Premium Data Marketplace')}
                  </p>
                </div>
              </Link>
              
              {/* Database Connection Status */}
              {!supabase && (
                <div className="ml-4 hidden lg:flex items-center">
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-md text-xs font-medium flex items-center cursor-pointer hover:bg-amber-100 transition-colors" 
                       onClick={() => window.open('https://supabase.com/dashboard', '_blank')}>
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                    Database Setup Required
                  </div>
                </div>
              )}
            </div>

            {/* Center Section - Main Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link 
                to="/marketplace" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/marketplace') 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                Browse Data
              </Link>
              
              <Link 
                to="/lead-generation" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/lead-generation') 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                Lead Generation
              </Link>
              
              <Link 
                to="/pricing" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/pricing') 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                Pricing
              </Link>
              
              {user && (
                <Link 
                  to="/lead-import" 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/lead-import') 
                      ? 'text-green-700 bg-green-50 border border-green-200' 
                      : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                  }`}
                >
                  Lead Import
                </Link>
              )}
              
              <Link 
                to="/resources" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/resources') 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                Resources
              </Link>
              
              <Link 
                to="/support" 
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive('/support') 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-gray-700 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                Support
              </Link>
              
              {isAdmin && (
                <Link 
                  to="/admin" 
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive('/admin') 
                      ? 'text-purple-700 bg-purple-50 border border-purple-200' 
                      : 'text-gray-700 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Section - Search, Auth, Cart */}
            <div className="flex items-center space-x-3">
              
              {/* Search Bar */}
              <div className="hidden xl:flex items-center">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search datasets, leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Authentication & User Menu */}
              {!loading && (
                <>
                  {user ? (
                    <UserMenu />
                  ) : (
                    <div className="hidden md:flex items-center space-x-2">
                      <button 
                        onClick={() => openAuthModal('signin')}
                        className="text-gray-700 hover:text-green-700 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 hover:bg-gray-50"
                      >
                        Sign In
                      </button>
                      <button 
                        onClick={() => openAuthModal('signup')}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 shadow-md shadow-green-500/25 hover:shadow-lg hover:shadow-green-500/30"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {/* Cart Button */}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-200 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-md transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="space-y-3">
                
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search datasets, leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                {/* Mobile Navigation Links */}
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to="/marketplace" 
                    className="text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Data
                  </Link>
                  <Link 
                    to="/lead-generation" 
                    className="text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lead Generation
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  {user && (
                    <Link 
                      to="/lead-import" 
                      className="text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Lead Import
                    </Link>
                  )}
                  <Link 
                    to="/resources" 
                    className="text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Resources
                  </Link>
                  <Link 
                    to="/support" 
                    className="text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support
                  </Link>
                </div>
                
                {/* Mobile Auth Buttons */}
                {!loading && !user && (
                  <div className="space-y-2 pt-2">
                    <button 
                      onClick={() => {
                        openAuthModal('signin');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-gray-700 hover:text-green-700 hover:bg-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        openAuthModal('signup');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md shadow-green-500/25 text-center"
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