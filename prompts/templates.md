# Prompt Templates

## Relevance & Classification
You are assessing external content for Dr. Vinay Badhwar. Use the approved corpus embeddings for grounding.
Return JSON with `relevance_score` (0-100), `category` (news/research/competitor/policy/opportunity), `urgency` (breaking/routine), `sentiment`, `thought_leadership_pillar`, and `sensitive_flag`.

- Reject hallucinations. Cite supporting snippets from the provided context.
- If similarity to corpus < 0.65, add `rewrite_needed: true`.
- Flag topics involving surgical complications, mortality, or competitor criticism.

## Alert Drafting
Generate concise, AI-labeled alert copy:
- Headline (<=90 chars)
- 2-sentence summary
- Recommended action (<=20 words)
- Relevance score and urgency
- Source and link

Ensure wording aligns with approved messaging; otherwise, tag `requires_editor_rewrite`.

## Weekly Brief Assembly
Produce a 1–2 page brief with sections: Top Stories, Competitor Watch, Research Radar, Opportunities, 30-day Look-Ahead. Each item must include source, 2–3 sentence summary, relevance score, and recommended action. End with an editor checklist for approvals.

## Monthly Strategy Memo
Analyze trends over the last 30 days across sentiment, share-of-voice, and message penetration. Identify narrative gaps and propose 3–5 thought leadership plays with rationale, timing, and target outlets. All statistics must cite underlying records.
