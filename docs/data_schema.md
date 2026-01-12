# Data Schema

## Tables
- **raw_content**
  - `id` (UUID PK)
  - `source_type` (enum: rss, web, api, email)
  - `source_name`
  - `url`
  - `published_at` (timestamptz)
  - `retrieved_at` (timestamptz)
  - `title`
  - `content_text`
  - `content_html`
  - `metadata` (JSONB; author, tags, conference date, etc.)

- **analysis_enriched**
  - `id` (UUID PK, FK -> raw_content.id)
  - `relevance_score` (0-100)
  - `urgency` (enum: breaking, routine)
  - `category` (enum: news, research, competitor, policy, opportunity)
  - `sentiment` (enum: positive, neutral, negative)
  - `share_of_voice_rank` (float)
  - `thought_leadership_pillar` (text)
  - `similarity_to_corpus` (float)
  - `sensitive_flag` (boolean)
  - `llm_trace` (JSONB; prompt version, model, citations)
  - `vector_id` (text; link into vector DB)
  - `created_at` (timestamptz)

- **actions_queue**
  - `id` (UUID PK)
  - `raw_content_id` (UUID FK)
  - `action_type` (enum: alert, weekly_brief, monthly_memo, quarterly_report)
  - `priority` (int)
  - `status` (enum: pending, drafted, approved, sent)
  - `assigned_editor`
  - `last_error`
  - `created_at`, `updated_at`

- **audit_log**
  - `id` (UUID PK)
  - `entity_type` (raw_content, analysis, action_output)
  - `entity_id`
  - `action` (created, updated, approved, sent)
  - `actor` (service account or human)
  - `diff` (JSONB)
  - `timestamp`

## Retention & Governance
- Retain raw content for 18 months for reference; rotate older records to cold storage.
- Store all AI prompts, responses, and human edits in `audit_log` for traceability.
- Enforce PII-safe storage and redact patient identifiers during collection.
