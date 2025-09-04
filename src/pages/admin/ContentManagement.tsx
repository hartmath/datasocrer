import React, { useState, useRef } from 'react';
import { 
  Save, Upload, Eye, EyeOff, RefreshCw, Type, Image, Code, Search, X, 
  ImageIcon, Link2, Download, Plus, Settings, FileText, Globe, Home, 
  Users, ShoppingCart, BarChart3, Calendar, Mail, Phone, MapPin
} from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';

const ContentManagement = () => {
  const { content, updateContent, saveContent, loading, hasChanges } = useContent();
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<{[key: string]: string}>({});

  // Get unique sections
  const sections = ['All', ...Array.from(new Set(content.map(item => item.section)))];

  // Filter content based on section and search
  const filteredContent = content.filter(item => {
    const matchesSection = selectedSection === 'All' || item.section === selectedSection;
    const matchesSearch = searchTerm === '' || 
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSection && matchesSearch;
  });

  const handleSave = async () => {
    try {
      await saveContent();
      alert('Content saved successfully!');
    } catch (error) {
      alert('Error saving content. Please try again.');
    }
  };

  const handleImageUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }

      setUploadingImages(prev => new Set(prev).add(key));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateContent(key, result);
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      };
      reader.readAsDataURL(file);
    }
    
    // Reset input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleImageUrl = (key: string, url: string) => {
    if (url.trim()) {
      updateContent(key, url.trim());
    }
  };

  const removeImage = (key: string) => {
    updateContent(key, '');
  };

  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image. Please try again.');
    }
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-5 h-5 text-blue-500" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-500" />;
      case 'html':
        return <Code className="w-5 h-5 text-purple-500" />;
      default:
        return <Type className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSectionIcon = (section: string) => {
    if (section.includes('Home')) return <Home className="w-4 h-4" />;
    if (section.includes('Global')) return <Globe className="w-4 h-4" />;
    if (section.includes('Contact')) return <Mail className="w-4 h-4" />;
    if (section.includes('About')) return <Users className="w-4 h-4" />;
    if (section.includes('Marketplace')) return <ShoppingCart className="w-4 h-4" />;
    if (section.includes('Dashboard')) return <BarChart3 className="w-4 h-4" />;
    if (section.includes('Intro')) return <Calendar className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@datasorcerer.com' || user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access content management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* WordPress-style Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Content Editor</h1>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Manage your website content</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  previewMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {previewMode ? 'Preview' : 'Preview'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  hasChanges
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* WordPress-style Notice Bar */}
        {hasChanges && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Unsaved changes detected.</strong> Remember to save your changes before leaving this page.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* WordPress-style Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page/Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {sections.map(section => (
                  <option key={section} value={section}>
                    {section === 'All' ? 'All Content' : section}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Content
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by label or content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-6">
                <span>Total Items: <strong className="text-gray-900">{content.length}</strong></span>
                <span>Showing: <strong className="text-green-600">{filteredContent.length}</strong></span>
                {hasChanges && (
                  <span className="text-orange-600 font-medium">⚠️ Unsaved changes</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* WordPress-style Content Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredContent.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            
            return (
              <div key={item.id} className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'grid' ? 'h-fit' : ''
              }`}>
                {/* WordPress-style Card Header */}
                <div 
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    viewMode === 'list' ? 'border-b border-gray-100' : ''
                  }`}
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {item.label}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'text' ? 'bg-blue-100 text-blue-800' :
                          item.type === 'image' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        {getSectionIcon(item.section)}
                        <span className="line-clamp-1">{item.section}</span>
                      </div>

                      {item.type === 'text' && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          "{item.value.length > 80 ? item.value.substring(0, 80) + '...' : item.value}"
                        </p>
                      )}
                      
                      {item.type === 'image' && (
                        <p className="text-xs text-gray-600">
                          {item.value ? '✅ Image set' : '❌ No image'}
                        </p>
                      )}

                      {item.type === 'html' && (
                        <p className="text-xs text-gray-600">
                          HTML content ({item.value.length} characters)
                        </p>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs text-gray-400 mb-1">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        {isExpanded ? 'Collapse' : 'Edit'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* WordPress-style Content Editor */}
                {isExpanded && (
                  <div className="p-4 bg-gray-50">
                    {item.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content Text
                        </label>
                        {previewMode ? (
                          <div className="p-3 bg-white border border-gray-200 rounded-md min-h-[100px]">
                            <p className="text-gray-900">{item.value}</p>
                          </div>
                        ) : (
                          <textarea
                            value={item.value}
                            onChange={(e) => updateContent(item.key, e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical text-sm"
                            placeholder="Enter your content here..."
                          />
                        )}
                      </div>
                    )}

                    {item.type === 'image' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Image Management
                        </label>
                        
                        <div className="space-y-4">
                          {/* Current Image */}
                          {item.value && (
                            <div className="bg-white border border-gray-200 rounded-md p-4">
                              <div className="flex items-start space-x-4">
                                <div className="relative">
                                  <img 
                                    src={item.value} 
                                    alt={item.label}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNyAyN0w1MyA1M001MyAyN0wyNyA1MyIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                                    }}
                                  />
                                  {uploadingImages.has(item.key) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                                      <RefreshCw className="w-5 h-5 text-white animate-spin" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-900">Current Image</span>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => downloadImage(item.value, `${item.key.replace(/\./g, '-')}-image`)}
                                        className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                                        title="Download image"
                                      >
                                        <Download className="w-3 h-3 mr-1" />
                                        Download
                                      </button>
                                      <button
                                        onClick={() => removeImage(item.key)}
                                        className="text-red-600 hover:text-red-700 text-xs flex items-center"
                                        title="Remove image"
                                      >
                                        <X className="w-3 h-3 mr-1" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 break-all bg-gray-100 px-2 py-1 rounded">
                                    {item.value.startsWith('data:') ? 'Uploaded file' : item.value}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Upload Options */}
                          {!previewMode && (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                {/* File Upload */}
                                <div>
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(item.key, e)}
                                    className="hidden"
                                    id={`file-upload-${item.key}`}
                                  />
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImages.has(item.key)}
                                    className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 text-sm"
                                  >
                                    {uploadingImages.has(item.key) ? (
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Upload className="w-4 h-4 mr-2" />
                                    )}
                                    Upload
                                  </button>
                                </div>
                                
                                {/* Image URL */}
                                <div>
                                  <div className="flex">
                                    <input
                                      type="url"
                                      placeholder="Image URL"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          handleImageUrl(item.key, e.currentTarget.value);
                                          e.currentTarget.value = '';
                                        }
                                      }}
                                    />
                                    <button
                                      onClick={(e) => {
                                        const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                                        handleImageUrl(item.key, input.value);
                                        input.value = '';
                                      }}
                                      className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
                                    >
                                      <Link2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* No Image State */}
                          {!item.value && (
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">No image set</p>
                              <p className="text-gray-400 text-xs">Upload a file or add an image URL</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {item.type === 'html' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          HTML Content
                        </label>
                        {previewMode ? (
                          <div 
                            className="p-3 bg-white border border-gray-200 rounded-md min-h-[100px]"
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          />
                        ) : (
                          <textarea
                            value={item.value}
                            onChange={(e) => updateContent(item.key, e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-vertical"
                            placeholder="Enter HTML content..."
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No content items found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
