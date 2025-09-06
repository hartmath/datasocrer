import React, { useState, useRef } from 'react';
import { 
  Save, Upload, Eye, EyeOff, Type, Image, Code, Search, 
  Download, Plus, FileText, Home, 
  Users, Mail, Trash2, MoreVertical, SortAsc, Grid, List, ChevronDown,
  Folder, Layout, RefreshCw
} from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';

const ContentManagement = () => {
  const { content, updateContent, saveContent, loading, hasChanges, refreshContent } = useContent();
  const [selectedSection, setSelectedSection] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'label' | 'section' | 'updated'>('label');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'image' | 'html'>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    key: '',
    type: 'text' as 'text' | 'image' | 'html',
    value: '',
    label: '',
    section: 'Homepage'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique sections
  const sections = ['All', ...Array.from(new Set(content.map(item => item.section)))];

  // Filter and sort content
  const filteredContent = content
    .filter(item => {
      const matchesSection = selectedSection === 'All' || item.section === selectedSection;
      const matchesSearch = searchTerm === '' || 
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      
      return matchesSection && matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'label':
          comparison = a.label.localeCompare(b.label);
          break;
        case 'section':
          comparison = a.section.localeCompare(b.section);
          break;
        case 'updated':
          comparison = new Date(a.updatedAt || '').getTime() - 
                      new Date(b.updatedAt || '').getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSave = async () => {
    try {
      await saveContent();
      // Refresh content to ensure it's up to date
      await refreshContent();
      alert('Content saved successfully! Changes are now live on the website.');
    } catch (error) {
      alert('Error saving content. Please try again.');
    }
  };

  const handleImageUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateContent(key, result);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
    
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
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image. Please try again.');
    }
  };

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleItemSelection = (key: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };


  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'html': return <Code className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'html': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section.toLowerCase()) {
      case 'homepage': return <Home className="w-4 h-4" />;
      case 'about': return <Users className="w-4 h-4" />;
      case 'contact': return <Mail className="w-4 h-4" />;
      case 'footer': return <Layout className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  const handleAddNewItem = () => {
    if (!newItem.key || !newItem.label) {
      alert('Please fill in all required fields');
      return;
    }

    // Check if key already exists
    if (content.some(item => item.key === newItem.key)) {
      alert('A content item with this key already exists');
      return;
    }

    // This would need to be implemented in the ContentContext
    // For now, we'll just close the modal
    setShowAddModal(false);
    setNewItem({
      key: '',
      type: 'text',
      value: '',
      label: '',
      section: 'Homepage'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your website content like WordPress
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    previewMode 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {previewMode ? 'Edit Mode' : 'Preview Mode'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !hasChanges}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    hasChanges 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={refreshContent}
                  disabled={loading}
                  className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
                  title="Refresh content from database"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Sections</h3>
              <div className="space-y-1">
                {sections.map(section => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      selectedSection === section
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {section === 'All' ? (
                      <div className="flex items-center">
                        <Grid className="w-4 h-4 mr-2" />
                        All Content
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {getSectionIcon(section)}
                        <span className="ml-2">{section}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Content Types</h3>
              <div className="space-y-1">
                {[
                  { type: 'all', label: 'All Types', icon: <Grid className="w-4 h-4" /> },
                  { type: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
                  { type: 'image', label: 'Images', icon: <Image className="w-4 h-4" /> },
                  { type: 'html', label: 'HTML', icon: <Code className="w-4 h-4" /> }
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      filterType === type
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {icon}
                      <span className="ml-2">{label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{content.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Text Items</span>
                  <span className="font-medium">{content.filter(c => c.type === 'text').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Images</span>
                  <span className="font-medium">{content.filter(c => c.type === 'image').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">HTML Blocks</span>
                  <span className="font-medium">{content.filter(c => c.type === 'html').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Toolbar */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="label">Sort by Label</option>
                    <option value="section">Sort by Section</option>
                    <option value="updated">Sort by Updated</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <SortAsc className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {selectedItems.size > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedItems.size} selected
                    </span>
                    <button className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </button>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="bg-white rounded-lg border border-gray-200">
            {filteredContent.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first content item'}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <div key={item.key} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.key)}
                          onChange={() => toggleItemSelection(item.key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-md ${getTypeColor(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.label}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500">{item.key}</span>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center text-sm text-gray-500">
                                  {getSectionIcon(item.section)}
                                  <span className="ml-1">{item.section}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleExpanded(item.key)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform ${expandedItems.has(item.key) ? 'rotate-180' : ''}`} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {expandedItems.has(item.key) && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            {item.type === 'text' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Content
                                </label>
                                <textarea
                                  value={item.value}
                                  onChange={(e) => updateContent(item.key, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  rows={3}
                                />
                              </div>
                            )}

                            {item.type === 'image' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Image
                                </label>
                                {item.value ? (
                                  <div className="space-y-3">
                                    <img
                                      src={item.value}
                                      alt={item.label}
                                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNyAyN0w1MyA1M001MyAyN0wyNyA1MyIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                                      }}
                                    />
                                    <div className="flex space-x-2">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(item.key, e)}
                                        className="hidden"
                                        ref={fileInputRef}
                                      />
                                      <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                                      >
                                        <Upload className="w-4 h-4 mr-1" />
                                        Replace
                                      </button>
                                      <button
                                        onClick={() => downloadImage(item.value, `${item.key}.jpg`)}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                                      >
                                        <Download className="w-4 h-4 mr-1" />
                                        Download
                                      </button>
                                      <button
                                        onClick={() => removeImage(item.key)}
                                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                                      >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(item.key, e)}
                                      className="hidden"
                                      ref={fileInputRef}
                                    />
                                    <button
                                      onClick={() => fileInputRef.current?.click()}
                                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                                    >
                                      <Upload className="w-4 h-4 mr-2" />
                                      Upload Image
                                    </button>
                                  </div>
                                )}
                                <div className="mt-3">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Or enter image URL
                                  </label>
                                  <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    onChange={(e) => handleImageUrl(item.key, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </div>
                            )}

                            {item.type === 'html' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  HTML Content
                                </label>
                                <textarea
                                  value={item.value}
                                  onChange={(e) => updateContent(item.key, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                  rows={6}
                                />
                                {item.value && (
                                  <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Preview
                                    </label>
                                    <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                                      <div dangerouslySetInnerHTML={{ __html: item.value }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Content</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key (unique identifier)
                </label>
                <input
                  type="text"
                  value={newItem.key}
                  onChange={(e) => setNewItem({...newItem, key: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., hero_title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label (display name)
                </label>
                <input
                  type="text"
                  value={newItem.label}
                  onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Hero Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="image">Image</option>
                  <option value="html">HTML</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  value={newItem.section}
                  onChange={(e) => setNewItem({...newItem, section: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Homepage">Homepage</option>
                  <option value="About">About</option>
                  <option value="Contact">Contact</option>
                  <option value="Footer">Footer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newItem.value}
                  onChange={(e) => setNewItem({...newItem, value: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter your content here..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;