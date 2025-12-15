-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create germination_records table
CREATE TABLE IF NOT EXISTS germination_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seed_type VARCHAR(100) NOT NULL,
  planting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_germination_days INTEGER NOT NULL DEFAULT 7,
  current_stage VARCHAR(50) DEFAULT 'planted' CHECK (current_stage IN ('planted', 'sprouting', 'germinated', 'mature')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photo_records table
CREATE TABLE IF NOT EXISTS photo_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  germination_record_id UUID REFERENCES germination_records(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  day_number INTEGER NOT NULL,
  ai_analysis TEXT,
  ai_model_used VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_germination_records_user_id ON germination_records(user_id);
CREATE INDEX IF NOT EXISTS idx_germination_records_seed_type ON germination_records(seed_type);
CREATE INDEX IF NOT EXISTS idx_germination_records_stage ON germination_records(current_stage);
CREATE INDEX IF NOT EXISTS idx_photo_records_germination_id ON photo_records(germination_record_id);
CREATE INDEX IF NOT EXISTS idx_photo_records_day_number ON photo_records(day_number);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE germination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own germination records" ON germination_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own germination records" ON germination_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own germination records" ON germination_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own germination records" ON germination_records
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view photos of own records" ON photo_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM germination_records 
      WHERE germination_records.id = photo_records.germination_record_id 
      AND germination_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert photos to own records" ON photo_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM germination_records 
      WHERE germination_records.id = photo_records.germination_record_id 
      AND germination_records.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_germination_records_updated_at BEFORE UPDATE ON germination_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
