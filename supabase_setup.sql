-- =============================================
-- HELPERS NEAR ME — Supabase Database Setup
-- =============================================

-- 1. Workers Table banao
CREATE TABLE IF NOT EXISTS workers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    experience TEXT NOT NULL,
    rating DECIMAL(3,1) DEFAULT 0.0,
    status TEXT DEFAULT 'Available',
    skills TEXT[] DEFAULT '{}',
    image TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sample Workers Data daalo
INSERT INTO workers (name, category, experience, rating, status, skills, image) VALUES
(
    'Arjun Sharma',
    'Domestic Workers',
    '6 Years',
    4.9,
    'Available',
    ARRAY['Housekeeping', 'Cooking', 'Deep Cleaning'],
    'https://images.unsplash.com/photo-1540560340027-46b469837563?q=80&w=200&h=200&auto=format&fit=crop'
),
(
    'Saira Khan',
    'Healthcare Workers',
    '4 Years',
    4.8,
    'Available',
    ARRAY['Patient Care', 'Elderly Support', 'First Aid'],
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&h=200&auto=format&fit=crop'
),
(
    'Vikram Singh',
    'Permanent Drivers',
    '8 Years',
    5.0,
    'Available',
    ARRAY['City Navigation', 'Vehicle Maintenance', 'Safety Expert'],
    'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&h=200&auto=format&fit=crop'
),
(
    'Ahmed Raza',
    'Security Guards',
    '5 Years',
    4.7,
    'Available',
    ARRAY['CCTV Monitoring', 'Access Control', 'Night Patrol'],
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop'
),
(
    'Priya Mehta',
    'Tutors & Teachers',
    '3 Years',
    4.9,
    'Available',
    ARRAY['Mathematics', 'Science', 'English'],
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop'
);

-- 3. Row Level Security (RLS) Enable karo — Public read allow
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read workers"
    ON workers FOR SELECT
    USING (true);
