import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  Download,
  ArrowLeft,
  Star,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';
import { useDatasets } from '../../hooks/useDatasets';
import { useCategories } from '../../hooks/useCategories';
import { useProviders } from '../../hooks/useProviders';
import { formatPrice } from '../../lib/stripe';
import { useToast } from '../../components/Toast';
import { supabase } from '../../lib/supabase';

const DatasetManagement = () => {
  const { datasets, loading } = useDatasets();
  const { categories } = useCategories();
  const { providers } = useProviders();
  const navigate = useNavigate();
  const { success, info, error } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [newDataset, setNewDataset] = useState({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    category_id: '',
    provider_id: '',
    price: '',
    currency: 'USD',
    size_description: 'Medium',
    record_count: '',
    update_frequency: 'Monthly',
    data_format: ['CSV'],
    tags: '',
    featured: false,
    active: true
  });

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || dataset.category?.slug === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && dataset.active) ||
                         (filterStatus === 'inactive' && !dataset.active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (active) => {
    return active 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleAddDataset = () => {
    setShowAddModal(true);
  };

  const handleAddDatasetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      if (!supabase) {
        // Mock success for demo
        success('Dataset Added', `"${newDataset.title}" has been added successfully`);
        setShowAddModal(false);
        resetForm();
        setAddLoading(false);
        return;
      }

      // Generate slug from title
      const slug = newDataset.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const datasetData = {
        title: newDataset.title,
        slug: slug,
        description: newDataset.description,
        long_description: newDataset.long_description || newDataset.description,
        category_id: newDataset.category_id,
        provider_id: newDataset.provider_id,
        price: parseFloat(newDataset.price),
        currency: newDataset.currency,
        size_description: newDataset.size_description,
        record_count: parseInt(newDataset.record_count),
        update_frequency: newDataset.update_frequency,
        data_format: newDataset.data_format,
        tags: newDataset.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featured: newDataset.featured,
        active: newDataset.active
      };

      const { data, error: insertError } = await supabase
        .from('datasets')
        .insert([datasetData])
        .select();

      if (insertError) throw insertError;

      success('Dataset Added', `"${newDataset.title}" has been added successfully`);
      setShowAddModal(false);
      resetForm();
      // Refresh the page to show new dataset
      window.location.reload();
    } catch (err) {
      console.error('Error adding dataset:', err);
      error('Failed to Add Dataset', err.message || 'Please try again');
    } finally {
      setAddLoading(false);
    }
  };

  const resetForm = () => {
    setNewDataset({
      title: '',
      slug: '',
      description: '',
      long_description: '',
      category_id: '',
      provider_id: '',
      price: '',
      currency: 'USD',
      size_description: 'Medium',
      record_count: '',
      update_frequency: 'Monthly',
      data_format: ['CSV'],
      tags: '',
      featured: false,
      active: true
    });
  };

  const handleDataFormatChange = (format: string) => {
    const currentFormats = newDataset.data_format;
    if (currentFormats.includes(format)) {
      setNewDataset({
        ...newDataset,
        data_format: currentFormats.filter(f => f !== format)
      });
    } else {
      setNewDataset({
        ...newDataset,
        data_format: [...currentFormats, format]
      });
    }
  };

  const handleEditDataset = (datasetId: string, title: string) => {
    info('Edit Dataset', `Edit form for "${title}" would open here`);
    // In real implementation: navigate(`/admin/datasets/${datasetId}/edit`);
  };

  const handleDeleteDataset = (datasetId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      info('Delete Dataset', `"${title}" would be deleted`);
      // In real implementation: call delete API
    }
  };

  const handleExportData = () => {
    success('Export Started', 'Dataset export is being prepared...');
    // In real implementation: trigger export
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'datasets', label: 'All Datasets', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const statsCards = [
    {
      title: 'Total Datasets',
      value: datasets.length.toString(),
      change: '+5%',
      icon: Database,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Datasets',
      value: datasets.filter(d => d.active).length.toString(),
      change: '+8%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Downloads',
      value: datasets.reduce((sum, d) => sum + d.total_downloads, 0).toLocaleString(),
      change: '+12%',
      icon: Download,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Avg. Rating',
      value: datasets.length > 0 ? (datasets.reduce((sum, d) => sum + d.rating, 0) / datasets.length).toFixed(1) : '0.0',
      change: '+0.2',
      icon: Star,
      color: 'from-orange-500 to-red-500'
    }
  ];
  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading datasets...</p>
          </div>
        </div>

        {/* Add Dataset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Add New Dataset</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddDatasetSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDataset.title}
                      onChange={(e) => setNewDataset({...newDataset, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter dataset title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newDataset.category_id}
                      onChange={(e) => setNewDataset({...newDataset, category_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider *
                    </label>
                    <select
                      required
                      value={newDataset.provider_id}
                      onChange={(e) => setNewDataset({...newDataset, provider_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Provider</option>
                      {providers.map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={newDataset.price}
                      onChange={(e) => setNewDataset({...newDataset, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({...newDataset, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter dataset description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Long Description
                  </label>
                  <textarea
                    rows={4}
                    value={newDataset.long_description}
                    onChange={(e) => setNewDataset({...newDataset, long_description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter detailed description (optional)"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Record Count *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newDataset.record_count}
                      onChange={(e) => setNewDataset({...newDataset, record_count: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Description
                    </label>
                    <select
                      value={newDataset.size_description}
                      onChange={(e) => setNewDataset({...newDataset, size_description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Small">Small</option>
                      <option value="Medium">Medium</option>
                      <option value="Large">Large</option>
                      <option value="Extra Large">Extra Large</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Frequency
                    </label>
                    <select
                      value={newDataset.update_frequency}
                      onChange={(e) => setNewDataset({...newDataset, update_frequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Real-time">Real-time</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Formats
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['CSV', 'JSON', 'Excel', 'XML', 'API'].map(format => (
                      <button
                        key={format}
                        type="button"
                        onClick={() => handleDataFormatChange(format)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          newDataset.data_format.includes(format)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newDataset.tags}
                    onChange={(e) => setNewDataset({...newDataset, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="health, insurance, qualified, verified"
                  />
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newDataset.featured}
                      onChange={(e) => setNewDataset({...newDataset, featured: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Dataset</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newDataset.active}
                      onChange={(e) => setNewDataset({...newDataset, active: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center"
                  >
                    {addLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Dataset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dataset Management</h1>
              <p className="text-gray-600 mt-2">Manage datasets, pricing, and availability</p>
            </div>
            <button 
              onClick={handleAddDataset}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Dataset
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
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
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 text-center">
                    <Database className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Total Datasets</h4>
                    <p className="text-2xl font-bold text-blue-600">{datasets.length}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Active Datasets</h4>
                    <p className="text-2xl font-bold text-green-600">{datasets.filter(d => d.active).length}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 text-center">
                    <Download className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Total Downloads</h4>
                    <p className="text-2xl font-bold text-purple-600">{datasets.reduce((sum, d) => sum + d.total_downloads, 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <button 
                      onClick={handleAddDataset}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Add Dataset</span>
                    </button>
                    <button 
                      onClick={handleExportData}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      <Download className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Export Data</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('datasets')}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                    >
                      <Eye className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">View All</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <Star className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-gray-600">Analytics</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Datasets Tab */}
            {activeTab === 'datasets' && (
              <div>
                {/* Filters */}
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search datasets by title or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button 
                        onClick={handleExportData}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Datasets Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Datasets ({filteredDatasets.length})
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dataset
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Downloads
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDatasets.map((dataset) => (
                          <tr key={dataset.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                  <Database className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                    {dataset.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    by {dataset.provider?.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {dataset.category?.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {formatPrice(dataset.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Download className="w-3 h-3 mr-1" />
                                {dataset.total_downloads.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                {dataset.rating} ({dataset.total_reviews})
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dataset.active)}`}>
                                {dataset.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Link to={`/dataset/${dataset.slug}`} className="text-blue-600 hover:text-blue-700">
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button 
                                  onClick={() => handleEditDataset(dataset.id, dataset.title)}
                                  className="text-gray-600 hover:text-gray-700"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteDataset(dataset.id, dataset.title)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredDatasets.length === 0 && (
                    <div className="text-center py-12">
                      <Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No datasets found matching your criteria</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Dataset Analytics</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Download Trends</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Download analytics would be displayed here</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Revenue by Dataset</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Revenue analytics would be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Top Performing Datasets</h4>
                  <div className="space-y-3">
                    {datasets
                      .sort((a, b) => b.total_downloads - a.total_downloads)
                      .slice(0, 5)
                      .map((dataset, idx) => (
                        <div key={dataset.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-gray-500">#{idx + 1}</span>
                            <div>
                              <p className="font-medium text-gray-900">{dataset.title}</p>
                              <p className="text-sm text-gray-600">by {dataset.provider?.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{dataset.total_downloads.toLocaleString()} downloads</p>
                            <p className="text-sm text-gray-600">{formatPrice(dataset.price)} per lead</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Dataset Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Add New Dataset</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddDatasetSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dataset Title *
                    </label>
                    <input
                      type="text"
                      value={newDataset.title}
                      onChange={(e) => setNewDataset({...newDataset, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Health Insurance Leads"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newDataset.price}
                      onChange={(e) => setNewDataset({...newDataset, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="299.99"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newDataset.category_id}
                      onChange={(e) => setNewDataset({...newDataset, category_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider *
                    </label>
                    <select
                      value={newDataset.provider_id}
                      onChange={(e) => setNewDataset({...newDataset, provider_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Provider</option>
                      {providers.map(provider => (
                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Record Count *
                    </label>
                    <input
                      type="number"
                      value={newDataset.record_count}
                      onChange={(e) => setNewDataset({...newDataset, record_count: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="50000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Frequency
                    </label>
                    <select
                      value={newDataset.update_frequency}
                      onChange={(e) => setNewDataset({...newDataset, update_frequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({...newDataset, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of the dataset"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newDataset.tags}
                    onChange={(e) => setNewDataset({...newDataset, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="health, insurance, verified, qualified"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newDataset.featured}
                      onChange={(e) => setNewDataset({...newDataset, featured: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured Dataset</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={newDataset.active}
                      onChange={(e) => setNewDataset({...newDataset, active: e.target.checked})}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">Active</label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Dataset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetManagement;