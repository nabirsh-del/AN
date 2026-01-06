CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS raw_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type TEXT NOT NULL,
    source_name TEXT,
    url TEXT,
    published_at TIMESTAMPTZ,
    retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title TEXT,
    content_text TEXT,
    content_html TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS analysis_enriched (
    id UUID PRIMARY KEY REFERENCES raw_content(id) ON DELETE CASCADE,
    relevance_score NUMERIC(5,2) NOT NULL,
    urgency TEXT NOT NULL,
    category TEXT NOT NULL,
    sentiment TEXT,
    share_of_voice_rank NUMERIC(10,4),
    thought_leadership_pillar TEXT,
    similarity_to_corpus NUMERIC(5,4),
    sensitive_flag BOOLEAN DEFAULT FALSE,
    llm_trace JSONB,
    vector_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actions_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_content_id UUID REFERENCES raw_content(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    priority INT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    assigned_editor TEXT,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    diff JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_raw_content_published_at ON raw_content(published_at);
CREATE INDEX IF NOT EXISTS idx_analysis_category ON analysis_enriched(category);
CREATE INDEX IF NOT EXISTS idx_actions_queue_status ON actions_queue(status);
