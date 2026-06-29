-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source_page text NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  ip_country text,
  user_agent text
);

CREATE TABLE IF NOT EXISTS faq_cache (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  query_text text NOT NULL,
  query_normalized text NOT NULL,
  answer text NOT NULL,
  source text NOT NULL,
  hit_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_faq_cache_query ON faq_cache(query_normalized);

CREATE TABLE IF NOT EXISTS rbi_policy_rates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_rate decimal(5,2) NOT NULL,
  reverse_repo_rate decimal(5,2),
  crr decimal(5,2),
  slr decimal(5,2),
  bank_rate decimal(5,2),
  effective_date date NOT NULL,
  source_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bank_rates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name text NOT NULL,
  bank_short_name text NOT NULL,
  bank_type text NOT NULL,
  rate_type text NOT NULL,
  min_rate decimal(5,2) NOT NULL,
  max_rate decimal(5,2) NOT NULL,
  senior_citizen_extra decimal(4,2) DEFAULT 0.50,
  notes text,
  bank_url text,
  effective_date date NOT NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rates_last_updated (
  id integer PRIMARY KEY DEFAULT 1,
  updated_at timestamptz DEFAULT now(),
  updated_by text DEFAULT 'admin',
  notes text
);

-- Seed initial data
INSERT INTO rbi_policy_rates (repo_rate, reverse_repo_rate, crr, slr, bank_rate, effective_date)
VALUES (6.50, 3.35, 4.00, 18.00, 6.75, '2026-02-07')
ON CONFLICT DO NOTHING;

INSERT INTO rates_last_updated (id, updated_at, notes) VALUES (1, now(), 'Initial seed')
ON CONFLICT (id) DO NOTHING;

-- Home loan rates
INSERT INTO bank_rates (bank_name, bank_short_name, bank_type, rate_type, min_rate, max_rate, effective_date, bank_url) VALUES
('State Bank of India', 'SBI', 'public', 'home_loan', 8.50, 9.65, '2026-06-01', 'https://homeloans.sbi/'),
('HDFC Bank', 'HDFC', 'private', 'home_loan', 8.75, 9.65, '2026-06-01', 'https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan'),
('ICICI Bank', 'ICICI', 'private', 'home_loan', 8.75, 9.80, '2026-06-01', 'https://www.icicibank.com/personal-banking/loans/home-loan'),
('Axis Bank', 'Axis', 'private', 'home_loan', 8.75, 9.80, '2026-06-01', 'https://www.axisbank.com/retail/loans/home-loan'),
('Kotak Mahindra Bank', 'Kotak', 'private', 'home_loan', 8.75, 9.50, '2026-06-01', 'https://www.kotak.com/en/personal-banking/loans/home-loan.html'),
('Bank of Baroda', 'BOB', 'public', 'home_loan', 8.40, 10.60, '2026-06-01', 'https://www.bankofbaroda.in/personal-banking/loans/home-loans'),
('Punjab National Bank', 'PNB', 'public', 'home_loan', 8.40, 10.25, '2026-06-01', 'https://www.pnbindia.in/housing-loan.html'),
('Canara Bank', 'Canara', 'public', 'home_loan', 8.40, 11.25, '2026-06-01', 'https://canarabank.com/'),
('LIC Housing Finance', 'LIC HFL', 'nbfc', 'home_loan', 8.50, 10.50, '2026-06-01', 'https://www.lichousing.com/'),
('Bajaj Housing Finance', 'Bajaj HFL', 'nbfc', 'home_loan', 8.48, 15.00, '2026-06-01', 'https://www.bajajhousingfinance.in/'),
('Tata Capital', 'Tata', 'nbfc', 'home_loan', 8.75, 12.00, '2026-06-01', 'https://www.tatacapital.com/home-loan.html');

-- FD 1yr rates
INSERT INTO bank_rates (bank_name, bank_short_name, bank_type, rate_type, min_rate, max_rate, senior_citizen_extra, effective_date, bank_url) VALUES
('State Bank of India', 'SBI', 'public', 'fd_1yr', 6.80, 6.80, 0.50, '2026-06-01', 'https://sbi.co.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits'),
('HDFC Bank', 'HDFC', 'private', 'fd_1yr', 7.00, 7.00, 0.50, '2026-06-01', 'https://www.hdfcbank.com/personal/save/deposits/fixed-deposit-interest-rate'),
('ICICI Bank', 'ICICI', 'private', 'fd_1yr', 6.90, 6.90, 0.50, '2026-06-01', 'https://www.icicibank.com/personal-banking/deposits/fixed-deposit'),
('Axis Bank', 'Axis', 'private', 'fd_1yr', 7.10, 7.10, 0.50, '2026-06-01', 'https://www.axisbank.com/retail/deposits/fixed-deposits/fixed-deposit-interest-rate'),
('Kotak Mahindra Bank', 'Kotak', 'private', 'fd_1yr', 7.25, 7.25, 0.50, '2026-06-01', 'https://www.kotak.com/en/personal-banking/deposits/fixed-deposit/interest-rates.html'),
('Yes Bank', 'Yes Bank', 'private', 'fd_1yr', 7.75, 7.75, 0.75, '2026-06-01', 'https://www.yesbank.in/personal-banking/yes-deposits/fixed-deposit-account/interest-rates'),
('IDFC First Bank', 'IDFC', 'private', 'fd_1yr', 7.75, 7.75, 0.50, '2026-06-01', 'https://www.idfcfirstbank.com/personal-banking/deposits/fixed-deposit/interest-rate'),
('Bank of Baroda', 'BOB', 'public', 'fd_1yr', 6.85, 6.85, 0.50, '2026-06-01', 'https://www.bankofbaroda.in/interest-rates-and-service-charges/deposit-rates'),
('Canara Bank', 'Canara', 'public', 'fd_1yr', 6.85, 6.85, 0.50, '2026-06-01', 'https://canarabank.com/'),
('Punjab National Bank', 'PNB', 'public', 'fd_1yr', 6.80, 6.80, 0.50, '2026-06-01', 'https://www.pnbindia.in/deposit-rates.html'),
('AU Small Finance Bank', 'AU SFB', 'small_finance', 'fd_1yr', 7.75, 7.75, 0.50, '2026-06-01', 'https://www.aubank.in/deposits/fixed-deposit/interest-rates'),
('Jana Small Finance Bank', 'Jana SFB', 'small_finance', 'fd_1yr', 8.25, 8.25, 0.50, '2026-06-01', 'https://janabank.com/fixed-deposit/'),
('Ujjivan Small Finance Bank', 'Ujjivan SFB', 'small_finance', 'fd_1yr', 8.25, 8.25, 0.50, '2026-06-01', 'https://www.ujjivansfb.in/deposits/fixed-deposit'),
('Suryoday Small Finance Bank', 'Suryoday SFB', 'small_finance', 'fd_1yr', 8.60, 8.60, 0.50, '2026-06-01', 'https://www.suryodaybank.com/deposits/fixed-deposit');

-- Personal loan rates
INSERT INTO bank_rates (bank_name, bank_short_name, bank_type, rate_type, min_rate, max_rate, effective_date, bank_url) VALUES
('State Bank of India', 'SBI', 'public', 'personal_loan', 11.45, 14.60, '2026-06-01', 'https://sbi.co.in/web/personal-banking/loans/personal-loans/xpress-credit'),
('HDFC Bank', 'HDFC', 'private', 'personal_loan', 10.50, 24.00, '2026-06-01', 'https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan'),
('ICICI Bank', 'ICICI', 'private', 'personal_loan', 10.50, 19.00, '2026-06-01', 'https://www.icicibank.com/personal-banking/loans/personal-loan'),
('Axis Bank', 'Axis', 'private', 'personal_loan', 11.25, 22.00, '2026-06-01', 'https://www.axisbank.com/retail/loans/personal-loan'),
('Bajaj Finserv', 'Bajaj', 'nbfc', 'personal_loan', 13.00, 26.00, '2026-06-01', 'https://www.bajajfinserv.in/personal-loan'),
('Tata Capital', 'Tata', 'nbfc', 'personal_loan', 10.99, 35.00, '2026-06-01', 'https://www.tatacapital.com/personal-loan.html');
