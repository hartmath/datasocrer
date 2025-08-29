import { supabase } from './supabase';

export const seedDatabase = async () => {
  if (!supabase) {
    console.error('Database connection not available');
    return;
  }

  try {
    console.log('🌱 Seeding database...');

    // 1. Seed Categories
    const categories = [
      {
        name: 'Insurance Data',
        slug: 'insurance',
        description: 'Health, Life, Auto, and Property Insurance Leads',
        icon: '🛡️',
        sort_order: 1
      },
      {
        name: 'B2B Prospects',
        slug: 'b2b',
        description: 'Business-to-Business Contact Lists and Leads',
        icon: '🏢',
        sort_order: 2
      },
      {
        name: 'Consumer Data',
        slug: 'consumer',
        description: 'Consumer Demographics and Behavior Data',
        icon: '👥',
        sort_order: 3
      },
      {
        name: 'Real Estate',
        slug: 'real-estate',
        description: 'Property Data and Real Estate Leads',
        icon: '🏠',
        sort_order: 4
      },
      {
        name: 'Financial Services',
        slug: 'financial',
        description: 'Investment and Financial Service Leads',
        icon: '💰',
        sort_order: 5
      },
      {
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'Medical and Healthcare Industry Data',
        icon: '⚕️',
        sort_order: 6
      }
    ];

    console.log('📁 Seeding categories...');
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();

    if (categoryError) {
      console.error('Error seeding categories:', categoryError);
    } else {
      console.log(`✅ Seeded ${categoryData?.length || 0} categories`);
    }

    // 2. Seed Providers
    const providers = [
      {
        name: 'DataCSV Premium',
        slug: 'datacsv-premium',
        description: 'Premium verified data provider offering high-quality, compliant datasets',
        website: 'https://datacsv.com',
        logo_url: '/E97CB547-02C1-460A-88F1-B2999CB9B271.png',
        contact_email: 'support@datacsv.com',
        verified: true,
        rating: 4.8,
        total_datasets: 25,
        total_downloads: 15420
      },
      {
        name: 'DataPro Analytics',
        slug: 'datapro-analytics',
        description: 'Professional analytics and insights from real-world data sources',
        website: 'https://datapro.com',
        verified: true,
        rating: 4.6,
        total_datasets: 18,
        total_downloads: 8930
      },
      {
        name: 'Insight Partners',
        slug: 'insight-partners',
        description: 'Strategic data partnerships for enterprise-level intelligence',
        website: 'https://insightpartners.com',
        verified: true,
        rating: 4.7,
        total_datasets: 12,
        total_downloads: 6750
      }
    ];

    console.log('🏢 Seeding providers...');
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .upsert(providers, { onConflict: 'slug' })
      .select();

    if (providerError) {
      console.error('Error seeding providers:', providerError);
    } else {
      console.log(`✅ Seeded ${providerData?.length || 0} providers`);
    }

    // 3. Seed Datasets
    if (categoryData && providerData && categoryData.length > 0 && providerData.length > 0) {
      const datasets = [
        {
          title: 'Premium Auto Insurance Leads - USA',
          slug: 'premium-auto-insurance-leads-usa',
          description: 'High-quality auto insurance leads from verified sources across the United States. Includes contact information, demographics, and purchase intent data.',
          category_id: categoryData.find(c => c.slug === 'insurance')?.id,
          provider_id: providerData.find(p => p.slug === 'datacsv-premium')?.id,
          price_cents: 2500, // $25.00
          file_format: 'csv',
          file_size: 2048000, // 2MB
          preview_url: '/sample-preview.csv',
          sample_data: {
            columns: ['first_name', 'last_name', 'email', 'phone', 'state', 'age_range', 'vehicle_type'],
            sample_rows: [
              ['John', 'Smith', 'john.smith@email.com', '555-0123', 'CA', '35-44', 'SUV'],
              ['Mary', 'Johnson', 'mary.j@email.com', '555-0456', 'TX', '25-34', 'Sedan']
            ]
          },
          metadata: {
            records: 1000,
            last_updated: '2024-01-15',
            compliance: 'TCPA Compliant',
            exclusions: 'DNC Scrubbed'
          },
          tags: ['insurance', 'auto', 'usa', 'leads', 'verified'],
          featured: true,
          active: true,
          total_downloads: 423,
          rating: 4.7
        },
        {
          title: 'Healthcare Providers Directory - Complete',
          slug: 'healthcare-providers-directory-complete',
          description: 'Comprehensive directory of healthcare providers including physicians, specialists, and medical facilities with contact and practice information.',
          category_id: categoryData.find(c => c.slug === 'healthcare')?.id,
          provider_id: providerData.find(p => p.slug === 'datapro-analytics')?.id,
          price_cents: 4500, // $45.00
          file_format: 'xlsx',
          file_size: 5120000, // 5MB
          sample_data: {
            columns: ['provider_name', 'specialty', 'address', 'phone', 'email', 'npi_number'],
            sample_rows: [
              ['Dr. Sarah Wilson', 'Cardiology', '123 Medical Blvd, NYC', '555-0789', 'swilson@clinic.com', '1234567890'],
              ['City General Hospital', 'Emergency Medicine', '456 Health St, LA', '555-0987', 'contact@citygeneral.com', '0987654321']
            ]
          },
          metadata: {
            records: 50000,
            coverage: 'USA',
            verified: true,
            last_updated: '2024-01-10'
          },
          tags: ['healthcare', 'providers', 'medical', 'directory', 'npi'],
          featured: true,
          active: true,
          total_downloads: 256,
          rating: 4.8
        },
        {
          title: 'B2B Technology Companies Database',
          slug: 'b2b-technology-companies-database',
          description: 'Extensive database of technology companies with decision-maker contacts, company size, technology stack, and industry focus.',
          category_id: categoryData.find(c => c.slug === 'b2b')?.id,
          provider_id: providerData.find(p => p.slug === 'insight-partners')?.id,
          price_cents: 7500, // $75.00
          file_format: 'csv',
          file_size: 8192000, // 8MB
          sample_data: {
            columns: ['company_name', 'industry', 'employee_count', 'revenue_range', 'contact_name', 'title', 'email'],
            sample_rows: [
              ['TechCorp Solutions', 'Software', '50-100', '$10M-$50M', 'Mike Chen', 'CTO', 'mchen@techcorp.com'],
              ['DataFlow Inc', 'Analytics', '100-500', '$50M-$100M', 'Lisa Brown', 'VP Sales', 'lbrown@dataflow.com']
            ]
          },
          metadata: {
            records: 25000,
            industries: ['Software', 'Hardware', 'Analytics', 'AI/ML', 'Cybersecurity'],
            coverage: 'Global',
            last_updated: '2024-01-12'
          },
          tags: ['b2b', 'technology', 'contacts', 'decision-makers', 'enterprise'],
          featured: false,
          active: true,
          total_downloads: 178,
          rating: 4.5
        },
        {
          title: 'Real Estate Investment Opportunities',
          slug: 'real-estate-investment-opportunities',
          description: 'Curated list of real estate investment opportunities including property details, market analysis, and ROI projections.',
          category_id: categoryData.find(c => c.slug === 'real-estate')?.id,
          provider_id: providerData.find(p => p.slug === 'datacsv-premium')?.id,
          price_cents: 12500, // $125.00
          file_format: 'xlsx',
          file_size: 15360000, // 15MB
          sample_data: {
            columns: ['property_address', 'property_type', 'asking_price', 'estimated_value', 'roi_projection', 'market_trend'],
            sample_rows: [
              ['123 Main St, Austin TX', 'Single Family', '$450,000', '$520,000', '12.5%', 'Rising'],
              ['789 Oak Ave, Denver CO', 'Multi Family', '$1,200,000', '$1,350,000', '8.7%', 'Stable']
            ]
          },
          metadata: {
            records: 5000,
            markets: ['Austin', 'Denver', 'Nashville', 'Phoenix', 'Raleigh'],
            analysis_date: '2024-01-08',
            data_sources: ['MLS', 'Public Records', 'Market Analysis']
          },
          tags: ['real-estate', 'investment', 'roi', 'properties', 'market-analysis'],
          featured: true,
          active: true,
          total_downloads: 89,
          rating: 4.9
        },
        {
          title: 'Consumer Spending Patterns Q4 2023',
          slug: 'consumer-spending-patterns-q4-2023',
          description: 'Detailed analysis of consumer spending patterns including demographics, purchase behaviors, and trend insights for Q4 2023.',
          category_id: categoryData.find(c => c.slug === 'consumer')?.id,
          provider_id: providerData.find(p => p.slug === 'datapro-analytics')?.id,
          price_cents: 3500, // $35.00
          file_format: 'csv',
          file_size: 3072000, // 3MB
          sample_data: {
            columns: ['age_group', 'income_bracket', 'category', 'avg_spending', 'frequency', 'channel'],
            sample_rows: [
              ['25-34', '$50K-$75K', 'Electronics', '$1,250', 'Monthly', 'Online'],
              ['35-44', '$75K-$100K', 'Home & Garden', '$850', 'Quarterly', 'In-Store']
            ]
          },
          metadata: {
            records: 100000,
            period: 'Q4 2023',
            demographics: 'US Adults 18-65',
            categories: 15,
            methodology: 'Survey + Transaction Data'
          },
          tags: ['consumer', 'spending', 'demographics', 'trends', 'quarterly'],
          featured: false,
          active: true,
          total_downloads: 234,
          rating: 4.4
        },
        {
          title: 'Financial Services Prospects - High Net Worth',
          slug: 'financial-services-prospects-high-net-worth',
          description: 'Qualified prospects for financial services including wealth management, investment advisory, and insurance services for high net worth individuals.',
          category_id: categoryData.find(c => c.slug === 'financial')?.id,
          provider_id: providerData.find(p => p.slug === 'insight-partners')?.id,
          price_cents: 15000, // $150.00
          file_format: 'csv',
          file_size: 4096000, // 4MB
          sample_data: {
            columns: ['first_name', 'last_name', 'email', 'phone', 'net_worth_range', 'investment_interests', 'risk_profile'],
            sample_rows: [
              ['Robert', 'Johnson', 'rjohnson@email.com', '555-0147', '$1M-$5M', 'Real Estate, Stocks', 'Moderate'],
              ['Patricia', 'Williams', 'pwilliams@email.com', '555-0258', '$5M-$10M', 'Private Equity, Bonds', 'Conservative']
            ]
          },
          metadata: {
            records: 2500,
            net_worth_min: '$1,000,000',
            verification: 'Income Verified',
            compliance: 'FINRA Compliant',
            exclusions: 'DNC Scrubbed'
          },
          tags: ['financial', 'high-net-worth', 'wealth-management', 'investment', 'qualified'],
          featured: true,
          active: true,
          total_downloads: 67,
          rating: 4.8
        }
      ];

      console.log('📊 Seeding datasets...');
      const { data: datasetData, error: datasetError } = await supabase
        .from('datasets')
        .upsert(datasets, { onConflict: 'slug' })
        .select();

      if (datasetError) {
        console.error('Error seeding datasets:', datasetError);
      } else {
        console.log(`✅ Seeded ${datasetData?.length || 0} datasets`);
      }
    }

    console.log('🎉 Database seeding completed!');
    return true;

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
};

// Function to check if database is already seeded
export const isDatabaseSeeded = async (): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking if database is seeded:', error);
      return false;
    }

    return (data && data.length > 0);
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
};

// Auto-seed function that checks and seeds if needed
export const autoSeedIfNeeded = async (): Promise<void> => {
  try {
    const isSeeded = await isDatabaseSeeded();
    if (!isSeeded) {
      console.log('Database not seeded, seeding now...');
      await seedDatabase();
    } else {
      console.log('Database already seeded, skipping...');
    }
  } catch (error) {
    console.error('Error in auto-seed:', error);
  }
};

