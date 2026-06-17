-- ============================================================
-- Seed: Insert all routes (Gambang + Pekan)
-- Run in: Supabase Dashboard > SQL Editor > New query
-- All routes are active by default and two-way (A ↔ B)
-- ============================================================

INSERT INTO public.routes (campus, point_a, point_b, price) VALUES

-- ── GAMBANG: UMP Gambang ──────────────────────────────────
('Gambang', 'UMP Gambang', 'Anywhere inside UMP',                        5.00),
('Gambang', 'UMP Gambang', 'Court Prima (KK4)',                           5.00),
('Gambang', 'UMP Gambang', '7E / Petron / Baroqah Laundry',              6.00),
('Gambang', 'UMP Gambang', 'Bus Stop UMP',                                6.00),
('Gambang', 'UMP Gambang', 'Pasar Malam / Caltex / TMG / Tasik Paya Besar', 7.00),
('Gambang', 'UMP Gambang', 'Taman Prima',                                 7.00),
('Gambang', 'UMP Gambang', 'Marrybrown',                                  7.00),
('Gambang', 'UMP Gambang', 'Suraya',                                      8.00),
('Gambang', 'UMP Gambang', 'Gambang Jaya',                                8.00),
('Gambang', 'UMP Gambang', 'Mr. DIY',                                     9.00),
('Gambang', 'UMP Gambang', 'Gambang Damai',                              15.00),
('Gambang', 'UMP Gambang', 'Jaya Gading',                                15.00),
('Gambang', 'UMP Gambang', 'Taman Tas',                                  18.00),
('Gambang', 'UMP Gambang', 'Airport (Sultan Ahmad Shah)',                 18.00),
('Gambang', 'UMP Gambang', 'McDonald''s Sg. Isap',                       24.00),
('Gambang', 'UMP Gambang', 'Air Terjun Pandan',                          27.00),
('Gambang', 'UMP Gambang', 'TSK',                                        28.00),
('Gambang', 'UMP Gambang', 'ECM / KCM',                                  32.00),
('Gambang', 'UMP Gambang', 'Pantai Kempadang',                           34.00),
('Gambang', 'UMP Gambang', 'IM (IIUM Kuantan)',                          35.00),
('Gambang', 'UMP Gambang', 'Teluk Cempedak',                             35.00),
('Gambang', 'UMP Gambang', 'Pantai Sepat',                               42.00),
('Gambang', 'UMP Gambang', 'Pantai Balok',                               45.00),
('Gambang', 'UMP Gambang', 'Pekan',                                      60.00),

-- ── GAMBANG: CFS IIUM Gambang ────────────────────────────
('Gambang', 'CFS IIUM Gambang', 'Bus Stop UMP',                          11.00),
('Gambang', 'CFS IIUM Gambang', 'Taman Tas',                             22.00),
('Gambang', 'CFS IIUM Gambang', 'TSK',                                   34.00),
('Gambang', 'CFS IIUM Gambang', 'IIUM Kuantan',                          37.00),
('Gambang', 'CFS IIUM Gambang', 'ECM / KCM',                             37.00),
('Gambang', 'CFS IIUM Gambang', 'Teluk Cempedak',                        39.00),

-- ── PEKAN: DHUAM ─────────────────────────────────────────
('Pekan',   'DHUAM', 'UMP Pekan / Fakulti',                              10.00),
('Pekan',   'DHUAM', 'Bandar Pekan',                                     12.00),

-- ── PEKAN: UMP Pekan / Fakulti ───────────────────────────
('Pekan',   'UMP Pekan / Fakulti', 'Anywhere inside UMP',                 5.00),
('Pekan',   'UMP Pekan / Fakulti', 'DHUAM',                              10.00),
('Pekan',   'UMP Pekan / Fakulti', 'Terminal Bas Pekan',                 15.00),
('Pekan',   'UMP Pekan / Fakulti', 'McDonald''s',                         7.00),
('Pekan',   'UMP Pekan / Fakulti', 'Bowling Pekan',                       7.00),
('Pekan',   'UMP Pekan / Fakulti', 'Taman Beruas Jaya',                   7.00),
('Pekan',   'UMP Pekan / Fakulti', 'Pantai Lagenda',                      8.00),
('Pekan',   'UMP Pekan / Fakulti', 'TMG Mart Peramu',                    12.00),
('Pekan',   'UMP Pekan / Fakulti', 'MR DIY / ECO Peramu',                13.00),
('Pekan',   'UMP Pekan / Fakulti', 'Pantai Selamat',                     10.00),
('Pekan',   'UMP Pekan / Fakulti', 'Kawasan Mentiga',                    10.00),
('Pekan',   'UMP Pekan / Fakulti', 'Airport (Sultan Ahmad Shah)',         40.00),
('Pekan',   'UMP Pekan / Fakulti', 'TSK',                                45.00),
('Pekan',   'UMP Pekan / Fakulti', 'Kuantan',                            50.00),
('Pekan',   'UMP Pekan / Fakulti', 'UMP Gambang',                        55.00),

-- ── PEKAN: Taman Beruas ──────────────────────────────────
('Pekan',   'Taman Beruas', 'Bandar Pekan',                              18.00);
