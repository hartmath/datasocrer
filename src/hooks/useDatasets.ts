import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Dataset } from '../types';

// Fallback data in case Supabase is not available
const fallbackDatasets: Dataset[] = [
  {
    id: '1',
    title: 'Premium Health Insurance Leads - Q1 2024',
    slug: 'premium-health-leads-q1-2024',
    description: 'High-quality health insurance leads with complete contact information and qualification data',
    category_id: '1',
    provider_id: '1',
    price: 2.50,
    currency: 'USD',
    size_description: 'Large',
    record_count: 5000,
    update_frequency: 'Weekly',
    data_format: ['CSV', 'JSON'],
    tags: ['health', 'individual', 'family', 'qualified'],
    featured: true,
    active: true,
    rating: 4.8,
    total_reviews: 45,
    total_downloads: 1250,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '1',
      name: 'Health Insurance',
      slug: 'health',
      description: 'Health insurance leads',
      icon: 'Heart',
      color: '#ef4444',
      created_at: new Date().toISOString()
    },
    provider: {
      id: '1',
      name: 'LeadGen Pro',
      slug: 'leadgen-pro',
      description: 'Premium insurance lead generation',
      rating: 4.8,
      total_reviews: 245,
      verified: true,
      created_at: new Date().toISOString()
    }
  },
  {
    id: '2',
    title: 'Life Insurance Prospects - Verified',
    slug: 'life-insurance-prospects-verified',
    description: 'Pre-qualified life insurance prospects with income verification and coverage needs assessment',
    category_id: '2',
    provider_id: '2',
    price: 3.25,
    currency: 'USD',
    size_description: 'Medium',
    record_count: 2500,
    update_frequency: 'Monthly',
    data_format: ['CSV', 'Excel'],
    tags: ['life', 'term', 'whole-life', 'verified'],
    featured: true,
    active: true,
    rating: 4.7,
    total_reviews: 32,
    total_downloads: 890,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '2',
      name: 'Life Insurance',
      slug: 'life',
      description: 'Life insurance leads',
      icon: 'Shield',
      color: '#3b82f6',
      created_at: new Date().toISOString()
    },
    provider: {
      id: '2',
      name: 'InsureConnect',
      slug: 'insure-connect',
      description: 'Specialized insurance leads',
      rating: 4.7,
      total_reviews: 189,
      verified: true,
      created_at: new Date().toISOString()
    }
  },
  {
    id: '3',
    title: 'Auto Insurance Leads - Multi-State',
    slug: 'auto-insurance-leads-multi-state',
    description: 'Comprehensive auto insurance leads covering multiple states with vehicle information',
    category_id: '3',
    provider_id: '3',
    price: 1.75,
    currency: 'USD',
    size_description: 'Large',
    record_count: 7500,
    update_frequency: 'Daily',
    data_format: ['CSV', 'JSON', 'XML'],
    tags: ['auto', 'vehicle', 'multi-state', 'comprehensive'],
    featured: false,
    active: true,
    rating: 4.6,
    total_reviews: 67,
    total_downloads: 2100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: '3',
      name: 'Auto Insurance',
      slug: 'auto',
      description: 'Auto insurance leads',
      icon: 'Car',
      color: '#f59e0b',
      created_at: new Date().toISOString()
    },
    provider: {
      id: '3',
      name: 'AgentLeads Plus',
      slug: 'agent-leads-plus',
      description: 'Comprehensive lead solutions',
      rating: 4.6,
      total_reviews: 156,
      verified: true,
      created_at: new Date().toISOString()
    }
  }
];

export const useDatasets = (featured?: boolean, limit?: number) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      if (!supabase) {
        let data = [...fallbackDatasets];
        if (featured) {
          data = data.filter(d => d.featured);
        }
        if (limit) {
          data = data.slice(0, limit);
        }
        setDatasets(data);
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('datasets')
          .select('*')
          .eq('active', true);

        if (featured) {
          query = query.eq('featured', true);
        }

        query = query.order('featured', { ascending: false })
                    .order('rating', { ascending: false });

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setDatasets(data || []);
      } catch (err) {
        console.error('Error fetching datasets:', err);
        // Use fallback data on error
        let data = [...fallbackDatasets];
        if (featured) {
          data = data.filter(d => d.featured);
        }
        if (limit) {
          data = data.slice(0, limit);
        }
        setDatasets(data);
        setError(err instanceof Error ? err.message : 'Failed to fetch datasets');
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [featured, limit]);

  const fetchDatasets = async () => {
    // Implementation moved to useEffect
  };

  return { datasets, loading, error };
};