import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface ContentItem {
  id: string;
  key: string;
  type: 'text' | 'image' | 'html';
  value: string;
  label: string;
  section: string;
  updatedAt: string;
}

interface ContentContextType {
  content: ContentItem[];
  updateContent: (key: string, value: string) => void;
  getContent: (key: string, defaultValue?: string) => string;
  loading: boolean;
  saveContent: () => Promise<void>;
  hasChanges: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Default content structure organized by pages/routes
const defaultContent: ContentItem[] = [
  // ============ HOME PAGE (/home) ============
  // Hero Section
  {
    id: '1',
    key: 'home.hero.title',
    type: 'text',
    value: 'Premium Data Marketplace',
    label: 'Main Hero Title',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  {
    id: '51',
    key: 'home.hero.background',
    type: 'image',
    value: '',
    label: 'Hero Background Image (optional)',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    key: 'home.hero.subtitle',
    type: 'text',
    value: 'for Business Intelligence',
    label: 'Hero Subtitle (appears below main title)',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    key: 'home.hero.description',
    type: 'text',
    value: 'Access premium datasets, leads, and business intelligence from verified providers. Trusted by thousands of professionals across finance, healthcare, real estate, and more.',
    label: 'Hero Description (paragraph below title)',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    key: 'home.hero.cta.primary',
    type: 'text',
    value: 'Browse Data Marketplace',
    label: 'Primary CTA Button Text (green button)',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    key: 'home.hero.cta.secondary',
    type: 'text',
    value: 'Request Custom Data',
    label: 'Secondary CTA Button Text (outline button)',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    key: 'home.hero.search.placeholder',
    type: 'text',
    value: 'Search leads, insurance data...',
    label: 'Search Bar Placeholder Text',
    section: 'Home Page - Hero Section',
    updatedAt: new Date().toISOString()
  },
  
  // Home Page Stats
  {
    id: '7',
    key: 'home.stats.users.count',
    type: 'text',
    value: '10,000+',
    label: 'Active Users Count',
    section: 'Home Page - Statistics',
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    key: 'home.stats.users.label',
    type: 'text',
    value: 'Active Users',
    label: 'Active Users Label',
    section: 'Home Page - Statistics',
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    key: 'home.stats.datasets.count',
    type: 'text',
    value: '500+',
    label: 'Premium Datasets Count',
    section: 'Home Page - Statistics',
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    key: 'home.stats.datasets.label',
    type: 'text',
    value: 'Premium Datasets',
    label: 'Premium Datasets Label',
    section: 'Home Page - Statistics',
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    key: 'home.stats.success.count',
    type: 'text',
    value: '99.5%',
    label: 'Success Rate Count',
    section: 'Home Page - Statistics',
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    key: 'home.stats.success.label',
    type: 'text',
    value: 'Success Rate',
    label: 'Success Rate Label',
    section: 'Home Page - Statistics',
    updatedAt: new Date().toISOString()
  },
  
  // ============ GLOBAL BRANDING (All Pages) ============
  {
    id: '13',
    key: 'brand.name',
    type: 'text',
    value: 'DataCSV',
    label: 'Site Brand Name (appears in header)',
    section: 'Global - Branding',
    updatedAt: new Date().toISOString()
  },
  {
    id: '14',
    key: 'brand.tagline',
    type: 'text',
    value: 'Premium Data Marketplace',
    label: 'Brand Tagline (appears under logo)',
    section: 'Global - Branding',
    updatedAt: new Date().toISOString()
  },
  {
    id: '15',
    key: 'brand.logo',
    type: 'image',
    value: '/E97CB547-02C1-460A-88F1-B2999CB9B271.png',
    label: 'Main Site Logo (appears in header and footer)',
    section: 'Global - Branding',
    updatedAt: new Date().toISOString()
  },
  {
    id: '49',
    key: 'brand.favicon',
    type: 'image',
    value: '/favicon.ico',
    label: 'Favicon (browser tab icon)',
    section: 'Global - Branding',
    updatedAt: new Date().toISOString()
  },
  {
    id: '50',
    key: 'brand.og.image',
    type: 'image',
    value: '',
    label: 'Social Media Share Image (Open Graph)',
    section: 'Global - Branding',
    updatedAt: new Date().toISOString()
  },
  
  // ============ INTRO ANIMATION (First Visit) ============
  {
    id: '16',
    key: 'intro.title',
    type: 'text',
    value: 'DataCSV',
    label: 'Intro Animation Title (large text)',
    section: 'Intro Animation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '17',
    key: 'intro.subtitle',
    type: 'text',
    value: 'Conjuring Premium Data Intelligence',
    label: 'Intro Animation Subtitle',
    section: 'Intro Animation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '18',
    key: 'intro.tagline',
    type: 'text',
    value: 'Transforming Raw Data Into Business Intelligence',
    label: 'Intro Animation Tagline',
    section: 'Intro Animation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '19',
    key: 'intro.features',
    type: 'text',
    value: 'PREMIUM • VERIFIED • INTELLIGENCE',
    label: 'Intro Animation Features Text',
    section: 'Intro Animation',
    updatedAt: new Date().toISOString()
  },
  
  // ============ MARKETPLACE PAGE (/marketplace) ============
  {
    id: '20',
    key: 'marketplace.title',
    type: 'text',
    value: 'Data Marketplace',
    label: 'Marketplace Page Title',
    section: 'Marketplace Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '21',
    key: 'marketplace.description',
    type: 'text',
    value: 'Discover premium datasets, leads, and business intelligence from verified providers',
    label: 'Marketplace Page Description',
    section: 'Marketplace Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '22',
    key: 'marketplace.categories.title',
    type: 'text',
    value: 'Browse Categories',
    label: 'Categories Sidebar Title',
    section: 'Marketplace Page',
    updatedAt: new Date().toISOString()
  },
  
  // ============ PRICING PAGE (/pricing) ============
  {
    id: '23',
    key: 'pricing.hero.title',
    type: 'text',
    value: 'Transparent Pricing',
    label: 'Pricing Page Hero Title',
    section: 'Pricing Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '24',
    key: 'pricing.hero.description',
    type: 'text',
    value: 'Choose the perfect plan for your data intelligence business. No hidden fees, no surprises.',
    label: 'Pricing Page Hero Description',
    section: 'Pricing Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '25',
    key: 'pricing.plans.title',
    type: 'text',
    value: 'Choose Your Plan',
    label: 'Pricing Plans Section Title',
    section: 'Pricing Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '26',
    key: 'pricing.plans.description',
    type: 'text',
    value: 'Flexible pricing options designed to scale with your data intelligence business',
    label: 'Pricing Plans Section Description',
    section: 'Pricing Page',
    updatedAt: new Date().toISOString()
  },
  
  // ============ ABOUT PAGE (/about) ============
  {
    id: '27',
    key: 'about.hero.title',
    type: 'text',
    value: 'About DataCSV',
    label: 'About Page Title',
    section: 'About Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '28',
    key: 'about.hero.description',
    type: 'text',
    value: 'We are the leading platform for premium data and business intelligence solutions.',
    label: 'About Page Description',
    section: 'About Page',
    updatedAt: new Date().toISOString()
  },
  
  // ============ CONTACT PAGE (/contact) ============
  {
    id: '29',
    key: 'contact.hero.title',
    type: 'text',
    value: 'Contact Us',
    label: 'Contact Page Title',
    section: 'Contact Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '30',
    key: 'contact.hero.description',
    type: 'text',
    value: 'Get in touch with our team for custom data solutions and support.',
    label: 'Contact Page Description',
    section: 'Contact Page',
    updatedAt: new Date().toISOString()
  },
  
  // ============ SUPPORT PAGE (/support) ============
  {
    id: '31',
    key: 'support.hero.title',
    type: 'text',
    value: 'Support Center',
    label: 'Support Page Title',
    section: 'Support Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '32',
    key: 'support.hero.description',
    type: 'text',
    value: 'Find answers to common questions and get help with your account.',
    label: 'Support Page Description',
    section: 'Support Page',
    updatedAt: new Date().toISOString()
  },
  
  // ============ RESOURCES PAGE (/resources) ============
  {
    id: '33',
    key: 'resources.hero.title',
    type: 'text',
    value: 'Resources & Guides',
    label: 'Resources Page Title',
    section: 'Resources Page',
    updatedAt: new Date().toISOString()
  },
  {
    id: '34',
    key: 'resources.hero.description',
    type: 'text',
    value: 'Learn how to maximize your data intelligence with our comprehensive guides.',
    label: 'Resources Page Description',
    section: 'Resources Page',
    updatedAt: new Date().toISOString()
  },
  
  // ============ FOOTER (All Pages) ============
  {
    id: '35',
    key: 'footer.description',
    type: 'text',
    value: 'Premium data marketplace connecting businesses with verified data providers across multiple industries.',
    label: 'Footer Company Description',
    section: 'Global - Footer',
    updatedAt: new Date().toISOString()
  },
  {
    id: '36',
    key: 'footer.copyright',
    type: 'text',
    value: 'DataCSV',
    label: 'Footer Copyright Text',
    section: 'Global - Footer',
    updatedAt: new Date().toISOString()
  },
  {
    id: '37',
    key: 'footer.phone',
    type: 'text',
    value: '+1 (555) 123-4567',
    label: 'Footer Phone Number',
    section: 'Global - Footer',
    updatedAt: new Date().toISOString()
  },
  {
    id: '38',
    key: 'footer.email',
    type: 'text',
    value: 'support@datacsv.com',
    label: 'Footer Email Address',
    section: 'Global - Footer',
    updatedAt: new Date().toISOString()
  },
  {
    id: '39',
    key: 'footer.address',
    type: 'text',
    value: '123 Data Street, Tech City, TC 12345',
    label: 'Footer Address',
    section: 'Global - Footer',
    updatedAt: new Date().toISOString()
  },
  
  // ============ NAVIGATION (All Pages) ============
  {
    id: '40',
    key: 'nav.marketplace',
    type: 'text',
    value: 'Browse Data',
    label: 'Navigation: Marketplace Link Text',
    section: 'Global - Navigation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '41',
    key: 'nav.lead-generation',
    type: 'text',
    value: 'Lead Generation',
    label: 'Navigation: Lead Generation Link Text',
    section: 'Global - Navigation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '42',
    key: 'nav.pricing',
    type: 'text',
    value: 'Pricing',
    label: 'Navigation: Pricing Link Text',
    section: 'Global - Navigation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '43',
    key: 'nav.resources',
    type: 'text',
    value: 'Resources',
    label: 'Navigation: Resources Link Text',
    section: 'Global - Navigation',
    updatedAt: new Date().toISOString()
  },
  {
    id: '44',
    key: 'nav.support',
    type: 'text',
    value: 'Support',
    label: 'Navigation: Support Link Text',
    section: 'Global - Navigation',
    updatedAt: new Date().toISOString()
  },
  
  // ============ AUTH MODAL (All Pages) ============
  {
    id: '45',
    key: 'auth.signin.title',
    type: 'text',
    value: 'Welcome Back',
    label: 'Sign In Modal Title',
    section: 'Global - Authentication',
    updatedAt: new Date().toISOString()
  },
  {
    id: '46',
    key: 'auth.signin.description',
    type: 'text',
    value: 'Sign in to access premium insurance leads',
    label: 'Sign In Modal Description',
    section: 'Global - Authentication',
    updatedAt: new Date().toISOString()
  },
  {
    id: '47',
    key: 'auth.signup.title',
    type: 'text',
    value: 'Create Account',
    label: 'Sign Up Modal Title',
    section: 'Global - Authentication',
    updatedAt: new Date().toISOString()
  },
  {
    id: '48',
    key: 'auth.signup.description',
    type: 'text',
    value: 'Join thousands of successful insurance agents',
    label: 'Sign Up Modal Description',
    section: 'Global - Authentication',
    updatedAt: new Date().toISOString()
  }
];

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<ContentItem[]>(defaultContent);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load content from database on mount
  useEffect(() => {
    loadContentFromDatabase();
  }, []);

  const loadContentFromDatabase = async () => {
    if (!supabase) {
      // Fallback to localStorage if no database connection
      const savedContent = localStorage.getItem('datacsv_content');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          setContent(parsedContent);
        } catch (error) {
          console.error('Error loading content from localStorage:', error);
        }
      }
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .order('section', { ascending: true });

      if (error) {
        console.error('Error loading content from database:', error);
        // Fallback to localStorage
        const savedContent = localStorage.getItem('datacsv_content');
        if (savedContent) {
          const parsedContent = JSON.parse(savedContent);
          setContent(parsedContent);
        }
        return;
      }

      if (data && data.length > 0) {
        // Transform database format to content format
        const dbContent = data.map(item => ({
          id: item.id,
          key: item.key,
          type: item.type as 'text' | 'image' | 'html',
          value: item.value,
          label: item.label,
          section: item.section,
          updatedAt: item.updated_at
        }));
        setContent(dbContent);
      } else {
        // If no content in database, seed with default content
        await seedDefaultContent();
      }
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback to localStorage
      const savedContent = localStorage.getItem('datacsv_content');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          setContent(parsedContent);
        } catch (parseError) {
          console.error('Error parsing localStorage content:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const seedDefaultContent = async () => {
    if (!supabase) return;

    try {
      const contentToInsert = defaultContent.map(item => ({
        key: item.key,
        type: item.type,
        value: item.value,
        label: item.label,
        section: item.section
      }));

      const { error } = await supabase
        .from('content_items')
        .insert(contentToInsert);

      if (error) {
        console.error('Error seeding default content:', error);
        return;
      }

      // Reload content after seeding
      await loadContentFromDatabase();
    } catch (error) {
      console.error('Error seeding content:', error);
    }
  };

  const updateContent = (key: string, value: string) => {
    setContent(prevContent => 
      prevContent.map(item => 
        item.key === key 
          ? { ...item, value, updatedAt: new Date().toISOString() }
          : item
      )
    );
    setHasChanges(true);
  };

  const getContent = (key: string, defaultValue = '') => {
    const item = content.find(item => item.key === key);
    return item ? item.value : defaultValue;
  };

  const saveContent = async () => {
    setLoading(true);
    try {
      // Always save to localStorage as backup
      localStorage.setItem('datacsv_content', JSON.stringify(content));
      
      if (!supabase) {
        setHasChanges(false);
        return;
      }

      // Save to database
      for (const item of content) {
        const { error } = await supabase
          .from('content_items')
          .upsert({
            key: item.key,
            type: item.type,
            value: item.value,
            label: item.label,
            section: item.section,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          });

        if (error) {
          console.error('Error saving content item:', error);
          throw error;
        }
      }
      
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentContext.Provider value={{
      content,
      updateContent,
      getContent,
      loading,
      saveContent,
      hasChanges
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
