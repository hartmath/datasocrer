import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Provider } from '../types';

// Fallback data in case Supabase is not available
const fallbackProviders: Provider[] = [
  {
    id: '1',
    name: 'LeadGen Pro',
    slug: 'leadgen-pro',
    description: 'Premium insurance lead generation with 15+ years of experience in the industry',
    rating: 4.8,
    total_reviews: 245,
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'InsureConnect',
    slug: 'insure-connect',
    description: 'Specialized in high-quality health and life insurance leads with real-time delivery',
    rating: 4.7,
    total_reviews: 189,
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'AgentLeads Plus',
    slug: 'agent-leads-plus',
    description: 'Comprehensive lead solutions for independent insurance agents nationwide',
    rating: 4.6,
    total_reviews: 156,
    verified: true,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'ProspectFlow',
    slug: 'prospect-flow',
    description: 'Advanced lead qualification and delivery platform for insurance professionals',
    rating: 4.9,
    total_reviews: 298,
    verified: true,
    created_at: new Date().toISOString()
  }
];

export const useProviders = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!supabase) {
        setProviders(fallbackProviders);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('providers')
          .select(`
            id,
            name,
            slug,
            description,
            logo_url,
            website,
            rating,
            total_reviews,
            verified,
            created_at
          `)
          .eq('verified', true)
          .order('rating', { ascending: false })
          .limit(6);

        if (error) throw error;
        setProviders(data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
        // Use fallback data on error
        setProviders(fallbackProviders);
        setError(err instanceof Error ? err.message : 'Failed to fetch providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, loading, error };
};