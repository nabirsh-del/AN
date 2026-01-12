# Deployment Instructions

1. **Provision services**
   - PostgreSQL database (`badhwar_intel`) with `uuid-ossp` extension enabled.
   - Managed vector DB (Pinecone/Weaviate) with `badhwar-corpus` index.
   - Secrets store (Vault/Parameter Store) for LLM and vector keys.

2. **Initialize database**
   ```bash
   psql $POSTGRES_DSN -f db/schema.sql
   ```

3. **Python environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Configure settings**
   - Copy `config/default_settings.yaml` and update DSN, API keys, Slack webhook, and pilot dates.

5. **Run collectors and analysis**
   - Schedule `scripts/run_daily_monitor.py` hourly via cron or n8n.
   - Add web/conference scraping routes to a daily schedule.
   - Configure PubMed/ClinicalTrials.gov/Federal Register collectors similarly.

6. **Generate briefs**
   - Weekly: run `scripts/run_weekly_brief.py` each Monday 7am ET and route output to editor inbox.
   - Monthly/Quarterly: extend templates to pull 30/90 day windows and export to PDF for leadership.

7. **Alert delivery**
   - Email: use SES/SendGrid; render `AlertDraft` into a simple HTML card.
   - Slack: post alerts to channel with "AI Draft" label and approval CTA.

8. **Monitoring & safety**
   - Add health checks for collector freshness (>90 minutes triggers on-call notification).
   - Log every AI prompt/response and human edit into `audit_log` for traceability.
   - Require human approval before external distribution; block if `sensitive_flag` is true.
