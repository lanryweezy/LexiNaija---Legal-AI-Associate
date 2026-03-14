-- SQL SCHEMA FOR LEXINAIJA

-- 1. Profiles (Chambers & Lawyers)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  firm_name TEXT,
  address TEXT,
  phone TEXT,
  solicitor_name TEXT,
  credits_total INTEGER DEFAULT 1000,
  credits_used INTEGER DEFAULT 0,
  sso_domain TEXT,
  is_enterprise BOOLEAN DEFAULT FALSE,
  firm_logo_url TEXT,
  firm_website TEXT,
  vat_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Individual', 'Corporate')),
  email TEXT,
  phone TEXT,
  address TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Cases (Matters)
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  suit_number TEXT,
  court TEXT,
  status TEXT CHECK (status IN ('Open', 'Pending Court', 'Closed', 'Drafting')),
  next_hearing TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  opposing_party TEXT,
  outcome TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Documents
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('Draft', 'Research', 'Summary')),
  status TEXT CHECK (status IN ('Draft', 'Under Review', 'Approved', 'Signed', 'Rejected', 'Archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4.b Document Versions
CREATE TABLE document_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Billable Items
CREATE TABLE billable_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT CHECK (type IN ('Professional Fee', 'Expense')),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tasks (Docket)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  status TEXT CHECK (status IN ('Pending', 'Completed'))
);

-- 7. Evidence Locker
CREATE TABLE evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  type TEXT CHECK (type IN ('Document', 'Image', 'Audio', 'Physical', 'Correspondence')),
  date_obtained TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_relied_upon BOOLEAN DEFAULT TRUE,
  custody_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE billable_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- Policies (Users only see their own data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own clients" ON clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cases" ON cases FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own documents" ON documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own evidence" ON evidence FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own versions" ON document_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM documents WHERE documents.id = document_id AND documents.user_id = auth.uid())
);
-- 10. Hearings (Full Cause List History)
CREATE TABLE hearings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  hearing_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT NOT NULL, -- e.g., 'Mention', 'Trial', 'Judgment', 'Adoption of Addresses'
  status TEXT CHECK (status IN ('Scheduled', 'Adjourned', 'Concluded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Knowledge Items (AI Context Sync)
CREATE TABLE knowledge_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Conflict Investigations (Ethical Audit)
CREATE TABLE conflict_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  is_clear BOOLEAN DEFAULT TRUE,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- 13. Service of Process (Bailiff Tracker)
CREATE TABLE service_of_process (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  party_to_be_served TEXT NOT NULL,
  status TEXT CHECK (status IN ('Pending Dispatch', 'With Bailiff', 'Served', 'Attempted', 'Substituted Service')),
  date_served TIMESTAMP WITH TIME ZONE,
  proof_of_service_url TEXT,
  notes TEXT
);

-- 14. Master Audit Log (Evidence Act Sec 84 Compliance)
-- Immutable trail of data entry/modifications
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- e.g., 'DOC_CREATED', 'CASE_MODIFIED'
  target_id UUID,
  target_table TEXT,
  prev_state JSONB,
  new_state JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  integrity_hash TEXT -- Hash of (prev_state + new_state + timestamp) for court validation
);

-- RLS for institutional tables
ALTER TABLE hearings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_of_process ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own hearings" ON hearings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own knowledge" ON knowledge_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conflict checks" ON conflict_checks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own service tracking" ON service_of_process FOR ALL USING (
  EXISTS (SELECT 1 FROM cases WHERE cases.id = case_id AND cases.user_id = auth.uid())
);
CREATE POLICY "Users can view own audit logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);

-- 15. Firm Precedents (Standardized Templates)
CREATE TABLE firm_precedents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- e.g., 'Litigation', 'Corporate', 'Property'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE firm_precedents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own precedents" ON firm_precedents FOR ALL USING (auth.uid() = user_id);
-- Note: AUDIT LOGS should ideally be INSERT ONLY for users via triggers/functions, preventing deletion of history.
