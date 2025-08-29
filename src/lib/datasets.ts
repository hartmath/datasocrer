import { supabase } from './supabase';
import { formatPrice } from './payments';

export interface Dataset {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  provider_id: string;
  price_cents: number;
  file_url?: string;
  file_size?: number;
  file_format?: string;
  preview_url?: string;
  sample_data?: any;
  metadata?: any;
  tags?: string[];
  featured: boolean;
  active: boolean;
  total_downloads: number;
  rating: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  provider?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logo_url?: string;
  contact_email?: string;
  verified: boolean;
  rating: number;
  total_datasets: number;
  total_downloads: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDatasetInput {
  title: string;
  description: string;
  category_id: string;
  provider_id: string;
  price_cents: number;
  file_url?: string;
  file_size?: number;
  file_format?: string;
  preview_url?: string;
  sample_data?: any;
  metadata?: any;
  tags?: string[];
  featured?: boolean;
  active?: boolean;
}

export interface UpdateDatasetInput extends Partial<CreateDatasetInput> {
  id: string;
}

/**
 * Get all datasets with filtering, sorting, and pagination
 */
export const getDatasets = async (options?: {
  category?: string;
  provider?: string;
  featured?: boolean;
  search?: string;
  sortBy?: 'created_at' | 'title' | 'price_cents' | 'rating' | 'total_downloads';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}): Promise<{ data: Dataset[]; count: number }> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    let query = supabase
      .from('datasets')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        providers (
          id,
          name,
          slug
        )
      `, { count: 'exact' })
      .eq('active', true);

    // Apply filters
    if (options?.category) {
      query = query.eq('categories.slug', options.category);
    }

    if (options?.provider) {
      query = query.eq('providers.slug', options.provider);
    }

    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    // Apply sorting
    const sortBy = options?.sortBy || 'created_at';
    const sortOrder = options?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options?.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch datasets: ${error.message}`);
    }

    return {
      data: (data || []).map(item => ({
        ...item,
        category: item.categories,
        provider: item.providers
      })),
      count: count || 0
    };

  } catch (error) {
    console.error('Error fetching datasets:', error);
    throw error;
  }
};

/**
 * Get a single dataset by ID or slug
 */
export const getDataset = async (identifier: string): Promise<Dataset | null> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('datasets')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        providers (
          id,
          name,
          slug,
          verified,
          rating
        )
      `)
      .or(`id.eq.${identifier},slug.eq.${identifier}`)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch dataset: ${error.message}`);
    }

    return data ? {
      ...data,
      category: data.categories,
      provider: data.providers
    } : null;

  } catch (error) {
    console.error('Error fetching dataset:', error);
    throw error;
  }
};

/**
 * Create a new dataset
 */
export const createDataset = async (input: CreateDatasetInput): Promise<Dataset> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    // Generate slug from title
    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('datasets')
      .insert({
        ...input,
        slug,
        featured: input.featured || false,
        active: input.active !== undefined ? input.active : true,
        total_downloads: 0,
        rating: 0
      })
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        providers (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create dataset: ${error.message}`);
    }

    return {
      ...data,
      category: data.categories,
      provider: data.providers
    };

  } catch (error) {
    console.error('Error creating dataset:', error);
    throw error;
  }
};

/**
 * Update an existing dataset
 */
export const updateDataset = async (input: UpdateDatasetInput): Promise<Dataset> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { id, ...updateData } = input;

    // Update slug if title changed
    if (updateData.title) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabase
      .from('datasets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        providers (
          id,
          name,
          slug
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to update dataset: ${error.message}`);
    }

    return {
      ...data,
      category: data.categories,
      provider: data.providers
    };

  } catch (error) {
    console.error('Error updating dataset:', error);
    throw error;
  }
};

/**
 * Delete a dataset
 */
export const deleteDataset = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { error } = await supabase
      .from('datasets')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete dataset: ${error.message}`);
    }

  } catch (error) {
    console.error('Error deleting dataset:', error);
    throw error;
  }
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];

  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Get all providers
 */
export const getProviders = async (): Promise<Provider[]> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch providers: ${error.message}`);
    }

    return data || [];

  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
};

/**
 * Upload file to storage
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase.storage
      .from('datasets')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('datasets')
      .getPublicUrl(data.path);

    return urlData.publicUrl;

  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete file from storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { error } = await supabase.storage
      .from('datasets')
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }

  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Search datasets with advanced filters
 */
export const searchDatasets = async (options: {
  query?: string;
  categories?: string[];
  providers?: string[];
  priceRange?: { min: number; max: number };
  rating?: number;
  featured?: boolean;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'newest' | 'rating' | 'popular';
  limit?: number;
  offset?: number;
}): Promise<{ data: Dataset[]; count: number }> => {
  const sortConfig = {
    relevance: { column: 'title', order: 'asc' },
    price_low: { column: 'price_cents', order: 'asc' },
    price_high: { column: 'price_cents', order: 'desc' },
    newest: { column: 'created_at', order: 'desc' },
    rating: { column: 'rating', order: 'desc' },
    popular: { column: 'total_downloads', order: 'desc' }
  };

  const sort = sortConfig[options.sortBy || 'relevance'];

  return getDatasets({
    search: options.query,
    category: options.categories?.[0], // For now, handle single category
    provider: options.providers?.[0], // For now, handle single provider
    featured: options.featured,
    sortBy: sort.column as any,
    sortOrder: sort.order as any,
    limit: options.limit,
    offset: options.offset
  });
};
