import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../types';

// Fallback data in case Supabase is not available
const fallbackCategories: Category[] = [
  {
    id: '1',
    name: 'Health Insurance',
    slug: 'health',
    description: 'Comprehensive health insurance leads including individual, family, and group plans',
    icon: 'Heart',
    color: '#ef4444',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Life Insurance',
    slug: 'life',
    description: 'Life insurance prospects seeking term, whole, and universal life coverage',
    icon: 'Shield',
    color: '#3b82f6',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Auto Insurance',
    slug: 'auto',
    description: 'Vehicle insurance leads for personal and commercial auto coverage',
    icon: 'Car',
    color: '#f59e0b',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Property Insurance',
    slug: 'property',
    description: 'Home, renters, and commercial property insurance prospects',
    icon: 'Home',
    color: '#10b981',
    created_at: new Date().toISOString()
  }
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!supabase) {
          console.warn('Supabase not connected, using fallback categories');
          setCategories(fallbackCategories);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        setCategories(fallbackCategories);
        setCategories(data || fallbackCategories);
      } catch (err) {
        console.error('Error fetching categories, using fallback:', err);
        // Use fallback data on error
        setCategories(fallbackCategories);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};