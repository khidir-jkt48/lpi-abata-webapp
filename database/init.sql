-- Initialize LPI Abata Database
CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    link TEXT,
    banner TEXT,
    icon TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO menu (nama, link, banner, icon) VALUES
('Book a Driver', 'https://script.google.com/a/macros/abata.sch.id/s/AKfycbwd0Zrt7UBoy8qpiBNoDscCZ9YCKnbuzusx5FPCyyLcfNk44DJA9CV1LeGHyEPLmS50tg/exec', 'https://imgur.com/gvv6T20.png', ''),
('Book a Room', 'https://script.google.com/macros/s/AKfycbwx0qq4oqO8QSxDxWAJ0HMPIq6US4ZVRFuniCXNIo8hy1QsBawzIl5euyxXSPVE-Ckg8g/exec', 'https://i.imgur.com/SiZi6hm.png', '')
ON CONFLICT (id) DO NOTHING;

-- Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_menu_updated_at 
    BEFORE UPDATE ON menu 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify data
SELECT 'Database initialized successfully' as status;
SELECT COUNT(*) as total_menu FROM menu;
