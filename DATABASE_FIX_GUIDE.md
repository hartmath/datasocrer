# 🛠️ Database Fix Guide - Missing Tables & Data Issues

## 🚨 **CRITICAL ISSUES IDENTIFIED**

Based on the console errors, your Supabase database is missing several required tables and has data consistency issues:

### ❌ **Missing Tables:**
1. **`content_items`** - 404 error (Content management)
2. **`wishlist_items`** - 400 error (User wishlists)  
3. **`user_balances`** - 404 error (Lead import system)

### ❌ **Data Issues:**
1. **Pricing inconsistency** - Prices stored as dollars (3.25) instead of cents (325)
2. **Cart calculation errors** - Showing $11.50 instead of 1150 cents

## 🔧 **STEP-BY-STEP FIX PROCESS**

### **Step 1: Run Database Migrations**

You need to run the existing migration files in your Supabase database:

#### **Option A: Supabase Dashboard (Recommended)**
1. Go to your Supabase project: `https://supabase.com/dashboard/project/hfpppxddtztxzeyagwhr`
2. Navigate to **Database** → **SQL Editor**
3. Run these migration files in order:

**First:** Copy and paste the content from:
```
supabase/migrations/20250115000000_complete_datacsv_setup.sql
```

**Second:** Copy and paste the content from:
```
supabase/migrations/20250115000001_lead_import_system.sql
```

#### **Option B: Supabase CLI (If installed)**
```bash
supabase db reset
# or
supabase db push
```

### **Step 2: Fix Missing Tables & Data**

After running the main migrations, execute the fix script:

**In Supabase SQL Editor, run:**
```sql
-- Copy the entire content of missing_tables_fix.sql
```

This will:
- ✅ Create the missing `wishlist_items` table
- ✅ Add default `content_items` data
- ✅ Create `user_balances` for existing users
- ✅ Fix pricing data (convert dollars to cents)
- ✅ Add sample datasets with correct pricing

### **Step 3: Verify Tables Exist**

In Supabase SQL Editor, check that all tables exist:

```sql
-- Check all required tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'profiles',
  'content_items', 
  'categories',
  'providers',
  'datasets',
  'cart_items',
  'orders',
  'order_items',
  'wishlist_items',
  'user_balances',
  'balance_transactions',
  'reviews'
);
```

**Expected Result:** All 12 tables should be listed.

### **Step 4: Verify Data Consistency**

Check that pricing is stored correctly in cents:

```sql
-- Check dataset pricing (should be in cents, e.g., 325 for $3.25)
SELECT title, price_cents, original_price_cents 
FROM datasets 
WHERE active = true 
LIMIT 5;

-- Check content items exist
SELECT key, value, section 
FROM content_items 
LIMIT 5;

-- Check user balances
SELECT user_id, balance_cents 
FROM user_balances 
LIMIT 3;
```

## 🔍 **TROUBLESHOOTING**

### **If migrations fail:**

1. **Check existing data conflicts:**
   ```sql
   -- Check if tables already exist but are empty
   SELECT COUNT(*) FROM datasets;
   SELECT COUNT(*) FROM categories;
   ```

2. **Manual table creation (if needed):**
   The `missing_tables_fix.sql` includes all necessary `CREATE TABLE IF NOT EXISTS` statements.

3. **Reset and start fresh:**
   If needed, you can delete all data and re-run migrations:
   ```sql
   -- CAUTION: This deletes all data
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   -- Then re-run all migrations
   ```

### **If pricing is still wrong:**

Update individual datasets manually:
```sql
UPDATE datasets 
SET price_cents = 325 
WHERE title = 'Life Insurance Prospects - Verified';

UPDATE datasets 
SET price_cents = 250 
WHERE title = 'Premium Health Insurance Leads - Q1 2024';
```

## ✅ **VERIFICATION CHECKLIST**

After running all fixes, verify these work in your app:

- [ ] **Content Management** - Admin can edit site content
- [ ] **Wishlist** - Users can add/remove items from wishlist
- [ ] **User Balances** - Lead import dashboard shows balance
- [ ] **Cart Totals** - Cart shows correct pricing (e.g., $3.25, not $11.50)
- [ ] **Checkout** - Payment amounts are correct
- [ ] **No 404/400 errors** in browser console

## 🚀 **EXPECTED RESULTS**

After completing these steps:

1. **No more console errors** ✅
2. **Cart totals display correctly** ✅  
3. **All features work** (wishlist, content management, balances) ✅
4. **Checkout flow functional** with correct pricing ✅

## 📞 **NEXT STEPS**

1. **Run the migrations** as described above
2. **Test the application** thoroughly
3. **Let me know** if any errors persist

**The database will be fully functional after these fixes! 🎉**
