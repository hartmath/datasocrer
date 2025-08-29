import React, { useState, useRef } from 'react';
import { Save, Upload, Eye, EyeOff, RefreshCw, Type, Image, Code, Search, X, ImageIcon, Link2, Download } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';

const ContentManagement = () => {
  const { content, updateContent, saveContent, loading, hasChanges } = useContent();
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
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
        return <Type className="w-4 h-4 text-blue-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'html':
        return <Code className="w-4 h-4 text-purple-500" />;
      default:
        return <Type className="w-4 h-4 text-gray-500" />;
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
              <p className="text-gray-600">Edit front-end text and images across your site</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !hasChanges}
                className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  hasChanges
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
              </button>
            </div>
          </div>

          {hasChanges && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ You have unsaved changes. Remember to save your changes before leaving this page.
              </p>
            </div>
          )}
        </div>

        {/* Page Guide */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📝 How to Edit Your Website Content</h3>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• <strong>Content is organized by pages/routes</strong> - Find exactly what you want to edit</p>
            <p>• <strong>Each label explains where it appears</strong> - No guessing about what you're editing</p>
            <p>• <strong>Changes appear immediately</strong> - Edit and see results in real-time</p>
            <p>• <strong>Don't forget to save!</strong> - Click "Save Changes" when you're done</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          {/* Section Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🗂️ Filter by Page/Section 
              <span className="text-gray-500 font-normal">(Choose which part of your site to edit)</span>
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {sections.map(section => (
                <option key={section} value={section}>
                  {section === 'All' ? '🌐 All Content' : 
                   section.includes('Home Page') ? '🏠 ' + section :
                   section.includes('Global') ? '🌍 ' + section :
                   section.includes('Page') ? '📄 ' + section :
                   section.includes('Intro') ? '🎬 ' + section :
                   '📝 ' + section}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Content 
              <span className="text-gray-500 font-normal">(Find specific text or labels)</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by label, key, or content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📊 Content Summary
            </label>
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-semibold">{content.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Showing:</span>
                <span className="font-semibold text-green-600">{filteredContent.length}</span>
              </div>
              {hasChanges && (
                <div className="mt-2 text-orange-600 font-medium">
                  ⚠️ Unsaved changes
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Items */}
        <div className="space-y-4">
          {filteredContent.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      {getTypeIcon(item.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{item.label}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.type === 'text' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'image' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{item.section}</p>
                        {item.type === 'text' && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            Current: "{item.value.length > 50 ? item.value.substring(0, 50) + '...' : item.value}"
                          </p>
                        )}
                        {item.type === 'image' && (
                          <p className="text-xs text-gray-500">
                            Image: {item.value ? '✅ Set' : '❌ Not set'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          Updated: {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Click to {isExpanded ? 'collapse' : 'edit'}
                        </div>
                      </div>
                      <div className={`transform transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Editor */}
                {isExpanded && (
                  <div className="p-4">
                    {item.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        {previewMode ? (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]">
                            <p className="text-gray-900">{item.value}</p>
                          </div>
                        ) : (
                          <textarea
                            value={item.value}
                            onChange={(e) => updateContent(item.key, e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
                            placeholder="Enter text content..."
                          />
                        )}
                      </div>
                    )}

                    {item.type === 'image' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          🖼️ Image Management
                          <span className="block text-xs text-gray-500 font-normal mt-1">
                            Upload files or use image URLs. Supports JPG, PNG, GIF (max 5MB)
                          </span>
                        </label>
                        
                        <div className="space-y-4">
                          {/* Current Image Preview */}
                          {item.value && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start space-x-4">
                                <div className="relative">
                                  <img 
                                    src={item.value} 
                                    alt={item.label}
                                    className="w-24 h-24 object-cover rounded-lg border border-gray-300 shadow-sm"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAzMkw2NCA2NE02NCAzMkwzMiA2NCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                                    }}
                                  />
                                  {uploadingImages.has(item.key) && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                      <RefreshCw className="w-6 h-6 text-white animate-spin" />
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
                                  <p className="text-xs text-gray-500 break-all bg-white px-2 py-1 rounded border">
                                    {item.value.startsWith('data:') ? 'Uploaded file (Base64)' : item.value}
                                  </p>
                                  {item.value.startsWith('data:') && (
                                    <div className="mt-1 text-xs text-gray-400">
                                      Size: ~{Math.round(item.value.length * 0.75 / 1024)}KB
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Upload Options */}
                          {!previewMode && (
                            <div className="space-y-3">
                              <div className="grid md:grid-cols-2 gap-3">
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
                                    className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 border-2 border-dashed border-green-300 hover:border-green-500"
                                  >
                                    {uploadingImages.has(item.key) ? (
                                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Upload className="w-4 h-4 mr-2" />
                                    )}
                                    {uploadingImages.has(item.key) ? 'Uploading...' : 'Upload File'}
                                  </button>
                                </div>
                                
                                {/* Image URL Input */}
                                <div>
                                  <div className="flex">
                                    <input
                                      type="url"
                                      placeholder="https://example.com/image.jpg"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                                      className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                                    >
                                      <Link2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">Or paste an image URL and press Enter</p>
                                </div>
                              </div>
                              
                              {/* Image Requirements */}
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Image Requirements</h4>
                                <ul className="text-xs text-blue-800 space-y-1">
                                  <li>• <strong>Formats:</strong> JPG, PNG, GIF, WebP, SVG</li>
                                  <li>• <strong>Size:</strong> Maximum 5MB per file</li>
                                  <li>• <strong>Dimensions:</strong> Recommended 1200x600px for best quality</li>
                                  <li>• <strong>Usage:</strong> Files are stored as Base64 or URL links</li>
                                </ul>
                              </div>
                            </div>
                          )}
                          
                          {/* No Image State */}
                          {!item.value && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <p className="text-gray-500 text-sm">No image set</p>
                              <p className="text-gray-400 text-xs">Upload a file or add an image URL above</p>
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
                            className="p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[100px]"
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          />
                        ) : (
                          <textarea
                            value={item.value}
                            onChange={(e) => updateContent(item.key, e.target.value)}
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm resize-vertical"
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
            <p className="text-gray-500">No content items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
