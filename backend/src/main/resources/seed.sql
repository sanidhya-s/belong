-- Seed data for Belong App

-- Society
INSERT INTO societies (name, address, city, state, pincode, created_at)
VALUES ('Sunshine Residency', '123 MG Road', 'Bangalore', 'Karnataka', '560001', NOW())
ON CONFLICT DO NOTHING;

-- Units (Flats)
INSERT INTO units (number, block, floor, society_id)
SELECT u.number, u.block, u.floor, s.id
FROM (VALUES
  ('A-101', 'A', '1'), ('A-102', 'A', '1'), ('A-201', 'A', '2'),
  ('B-101', 'B', '1'), ('B-102', 'B', '1'), ('B-201', 'B', '2')
) AS u(number, block, floor), societies s
WHERE s.name = 'Sunshine Residency'
ON CONFLICT DO NOTHING;

-- Amenities
INSERT INTO amenities (name, description, icon_name, open_time, close_time, max_capacity, available, society_id)
SELECT a.name, a.description, a.icon_name, a.open_time, a.close_time, a.max_capacity, true, s.id
FROM (VALUES
  ('Swimming Pool',   'Olympic size pool with lifeguard',    'water',            '06:00', '21:00', 20),
  ('Gym',            'Fully equipped modern gym',            'fitness',          '05:00', '23:00', 15),
  ('Clubhouse',      'Multi-purpose community hall',         'home',             '08:00', '22:00', 100),
  ('Badminton Court','Two professional courts',              'tennisball',       '06:00', '22:00', 8),
  ('Yoga Studio',    'Peaceful yoga and meditation space',   'body',             '06:00', '20:00', 20),
  ('Rooftop Lounge', 'Open-air rooftop with city views',    'sunny',            '07:00', '23:00', 30)
) AS a(name, description, icon_name, open_time, close_time, max_capacity),
societies s WHERE s.name = 'Sunshine Residency'
ON CONFLICT DO NOTHING;

-- Security contacts
INSERT INTO security_contacts (name, phone, designation, shift, type, society_id)
SELECT sc.name, sc.phone, sc.designation, sc.shift, sc.type, s.id
FROM (VALUES
  ('Ramesh Kumar',  '9876543210', 'Head Security Guard', 'Day',   'GUARD'),
  ('Suresh Singh',  '9876543211', 'Security Guard',       'Night', 'GUARD'),
  ('Fire Station',  '101',        'Emergency',            NULL,    'EMERGENCY'),
  ('Police Control','100',        'Emergency',            NULL,    'EMERGENCY'),
  ('Ambulance',     '108',        'Emergency',            NULL,    'EMERGENCY'),
  ('Society Office','9876543299', 'Helpdesk',             'Day',   'HELPDESK')
) AS sc(name, phone, designation, shift, type),
societies s WHERE s.name = 'Sunshine Residency'
ON CONFLICT DO NOTHING;

-- Moderator user for testing OTP + member management
INSERT INTO users (phone, name, email, role, society_id, active, created_at)
SELECT '9999999999', 'Society Moderator', 'moderator@belong.app', 'MODERATOR', s.id, true, NOW()
FROM societies s
WHERE s.name = 'Sunshine Residency'
ON CONFLICT (phone) DO NOTHING;
