-- Create germination_progress table for tracking daily progress
CREATE TABLE IF NOT EXISTS germination_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  germination_record_id UUID NOT NULL REFERENCES germination_records(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number > 0 AND day_number <= 30),
  actual_germination_rate DECIMAL(5,2) NOT NULL CHECK (actual_germination_rate >= 0 AND actual_germination_rate <= 100),
  predicted_germination_rate DECIMAL(5,2) DEFAULT 0 CHECK (predicted_germination_rate >= 0 AND predicted_germination_rate <= 100),
  growth_stage TEXT NOT NULL DEFAULT 'planted' CHECK (growth_stage IN ('planted', 'initial_sprouting', 'active_germination', 'established_seedling', 'mature_seedling')),
  temperature DECIMAL(4,1) DEFAULT 22.0 CHECK (temperature >= 0 AND temperature <= 50),
  humidity DECIMAL(5,2) DEFAULT 70.0 CHECK (humidity >= 0 AND humidity <= 100),
  notes TEXT DEFAULT '',
  prediction_accuracy DECIMAL(5,2) DEFAULT 0 CHECK (prediction_accuracy >= 0 AND prediction_accuracy <= 100),
  status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'ahead', 'behind', 'failed')),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent duplicate day entries per record
ALTER TABLE germination_progress 
ADD CONSTRAINT unique_day_per_record 
UNIQUE (germination_record_id, day_number);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_germination_progress_record_id ON germination_progress(germination_record_id);
CREATE INDEX IF NOT EXISTS idx_germination_progress_day_number ON germination_progress(day_number);
CREATE INDEX IF NOT EXISTS idx_germination_progress_recorded_at ON germination_progress(recorded_at);
CREATE INDEX IF NOT EXISTS idx_germination_progress_status ON germination_progress(status);

-- Enable Row Level Security
ALTER TABLE germination_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own germination progress" ON germination_progress
  FOR SELECT USING (
    germination_record_id IN (
      SELECT id FROM germination_records WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own germination progress" ON germination_progress
  FOR INSERT WITH CHECK (
    germination_record_id IN (
      SELECT id FROM germination_records WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own germination progress" ON germination_progress
  FOR UPDATE USING (
    germination_record_id IN (
      SELECT id FROM germination_records WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own germination progress" ON germination_progress
  FOR DELETE USING (
    germination_record_id IN (
      SELECT id FROM germination_records WHERE user_id = auth.uid()
    )
  );

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_germination_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_germination_progress_updated_at
  BEFORE UPDATE ON germination_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_germination_progress_updated_at();

-- Add comments for documentation
COMMENT ON TABLE germination_progress IS 'Daily progress tracking for germination records with prediction validation';
COMMENT ON COLUMN germination_progress.day_number IS 'Day number since planting (1-30)';
COMMENT ON COLUMN germination_progress.actual_germination_rate IS 'Actual observed germination rate percentage';
COMMENT ON COLUMN germination_progress.predicted_germination_rate IS 'ML model predicted rate for this day';
COMMENT ON COLUMN germination_progress.prediction_accuracy IS 'Accuracy of prediction vs actual (0-100%)';
COMMENT ON COLUMN germination_progress.status IS 'Progress status: on_track, ahead, behind, or failed';
