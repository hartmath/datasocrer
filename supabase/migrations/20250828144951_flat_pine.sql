/*
  # Add Download Tracking System

  1. New Tables
    - `downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `dataset_id` (uuid, foreign key to datasets)
      - `order_item_id` (uuid, foreign key to order_items)
      - `file_format` (text)
      - `file_size` (bigint)
      - `download_url` (text, temporary signed URL)
      - `expires_at` (timestamp)
      - `downloaded_at` (timestamp)
      - `ip_address` (text)
      - `user_agent` (text)

  2. Security
    - Enable RLS on `downloads` table
    - Add policy for users to access their own downloads
    - Add policy for admins to view all downloads

  3. Indexes
    - Index on user_id for fast user queries
    - Index on dataset_id for analytics
    - Index on downloaded_at for reporting
*/

CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  dataset_id uuid NOT NULL,
  order_item_id uuid,
  file_format text NOT NULL,
  file_size bigint,
  download_url text,
  expires_at timestamptz,
  downloaded_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own downloads"
  ON downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own downloads"
  ON downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all downloads"
  ON downloads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_dataset_id ON downloads(dataset_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at);
CREATE INDEX IF NOT EXISTS idx_downloads_expires_at ON downloads(expires_at);

-- Foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'downloads_dataset_id_fkey'
  ) THEN
    ALTER TABLE downloads 
    ADD CONSTRAINT downloads_dataset_id_fkey 
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'downloads_order_item_id_fkey'
  ) THEN
    ALTER TABLE downloads 
    ADD CONSTRAINT downloads_order_item_id_fkey 
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL;
  END IF;
END $$;