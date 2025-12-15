-- Insert demo user
INSERT INTO users (id, email, name, role) VALUES 
  ('demo-user-123', 'demo@microgreens.com', 'Demo User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample germination records
INSERT INTO germination_records (id, user_id, seed_type, planting_date, expected_germination_days, current_stage, notes) VALUES
  ('demo-record-1', 'demo-user-123', 'Broccoli', NOW() - INTERVAL '3 days', 7, 'sprouting', 'Demo broccoli microgreens showing good early growth'),
  ('demo-record-2', 'demo-user-123', 'Radish', NOW() - INTERVAL '5 days', 5, 'germinated', 'Fast-growing radish with characteristic pink stems'),
  ('demo-record-3', 'demo-user-123', 'Pea Shoots', NOW() - INTERVAL '10 days', 14, 'mature', 'Pea shoots ready for harvest with excellent height'),
  ('demo-record-4', 'demo-user-123', 'Sunflower', NOW() - INTERVAL '6 days', 8, 'sprouting', 'Sunflower microgreens with strong stems developing'),
  ('demo-record-5', 'demo-user-123', 'Arugula', NOW() - INTERVAL '4 days', 6, 'germinated', 'Arugula showing typical serrated leaf development')
ON CONFLICT (id) DO NOTHING;

-- Insert sample photo records
INSERT INTO photo_records (id, germination_record_id, photo_url, day_number, ai_analysis, ai_model_used) VALUES
  ('demo-photo-1', 'demo-record-1', '/placeholder.svg?height=300&width=400&text=Broccoli+Day+3', 3, 
   'Healthy broccoli microgreens showing excellent germination rate of approximately 85%. Green cotyledons are well-developed with uniform growth pattern. Recommend maintaining current moisture levels and introducing 12 hours of indirect light daily. Expected harvest in 4-5 days when true leaves begin to emerge.', 
   'openai:gpt-4o'),
  ('demo-photo-2', 'demo-record-2', '/placeholder.svg?height=300&width=400&text=Radish+Day+5', 5,
   'Outstanding radish microgreen development with characteristic purple-pink stems clearly visible. Germination rate exceeds 90% with dense, uniform growth. The vibrant coloration indicates excellent nutritional content. Ready for harvest now - peak flavor and texture achieved. Recommend harvesting within 1-2 days for optimal quality.',
   'anthropic:claude-3-5-sonnet-20241022'),
  ('demo-photo-3', 'demo-record-3', '/placeholder.svg?height=300&width=400&text=Pea+Shoots+Day+10', 10,
   'Mature pea shoots displaying excellent height and leaf development. Strong, thick stems with bright green coloration indicate optimal growing conditions. Tendrils are beginning to form, signaling peak harvest time. Quality score: 9/10. Harvest immediately for best flavor and texture. Excellent example of successful pea shoot cultivation.',
   'google:gemini-1.5-pro'),
  ('demo-photo-4', 'demo-record-4', '/placeholder.svg?height=300&width=400&text=Sunflower+Day+6', 6,
   'Sunflower microgreens showing robust growth with thick, sturdy stems. Cotyledons are large and well-formed with good green coloration. Growth rate is on schedule for day 6. Recommend increasing light exposure to 14 hours daily to enhance flavor development. Monitor for first true leaves in 2-3 days.',
   'openai:gpt-4o'),
  ('demo-photo-5', 'demo-record-5', '/placeholder.svg?height=300&width=400&text=Arugula+Day+4', 4,
   'Arugula microgreens displaying characteristic serrated leaf edges and peppery appearance. Germination rate approximately 88% with good density. The slightly purple tinge on stems is normal and indicates healthy development. Ready for harvest in 1-2 days when leaves reach 1-2 inches in height.',
   'anthropic:claude-3-5-sonnet-20241022')
ON CONFLICT (id) DO NOTHING;

-- Create view for analytics
CREATE OR REPLACE VIEW germination_analytics AS
SELECT 
  seed_type,
  COUNT(*) as total_records,
  COUNT(CASE WHEN current_stage IN ('germinated', 'mature') THEN 1 END) as successful_records,
  ROUND(
    COUNT(CASE WHEN current_stage IN ('germinated', 'mature') THEN 1 END)::numeric / 
    COUNT(*)::numeric * 100, 2
  ) as success_rate,
  AVG(expected_germination_days) as avg_expected_days,
  COUNT(CASE WHEN current_stage = 'planted' THEN 1 END) as planted_count,
  COUNT(CASE WHEN current_stage = 'sprouting' THEN 1 END) as sprouting_count,
  COUNT(CASE WHEN current_stage = 'germinated' THEN 1 END) as germinated_count,
  COUNT(CASE WHEN current_stage = 'mature' THEN 1 END) as mature_count
FROM germination_records
GROUP BY seed_type
ORDER BY success_rate DESC;

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE(
  total_records BIGINT,
  active_records BIGINT,
  success_rate NUMERIC,
  favorite_seed TEXT,
  total_photos BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(gr.id) as total_records,
    COUNT(CASE WHEN gr.current_stage != 'mature' THEN 1 END) as active_records,
    ROUND(
      COUNT(CASE WHEN gr.current_stage IN ('germinated', 'mature') THEN 1 END)::numeric / 
      NULLIF(COUNT(gr.id), 0)::numeric * 100, 2
    ) as success_rate,
    (
      SELECT seed_type 
      FROM germination_records 
      WHERE user_id = user_uuid 
      GROUP BY seed_type 
      ORDER BY COUNT(*) DESC 
      LIMIT 1
    ) as favorite_seed,
    COUNT(pr.id) as total_photos
  FROM germination_records gr
  LEFT JOIN photo_records pr ON gr.id = pr.germination_record_id
  WHERE gr.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;
