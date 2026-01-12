from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import List

logger = logging.getLogger(__name__)


@dataclass
class AlertDraft:
    headline: str
    summary: str
    recommended_action: str
    relevance_score: float
    urgency: str
    source: str
    url: str
    ai_generated: bool = True


class AlertEngine:
    def __init__(self, relevance_threshold: float, urgency_override: str = "breaking"):
        self.relevance_threshold = relevance_threshold
        self.urgency_override = urgency_override

    def should_alert(self, score: float, urgency: str) -> bool:
        return score >= self.relevance_threshold or urgency == self.urgency_override

    def build_alert(self, *, score: float, urgency: str, title: str, url: str, source: str) -> AlertDraft:
        logger.debug("Building alert for %s", title)
        return AlertDraft(
            headline=title[:90],
            summary=f"AI draft: {title}",
            recommended_action="Editor review & approve channel routing",
            relevance_score=score,
            urgency=urgency,
            source=source,
            url=url,
        )


def batch_filter(records: List[dict], engine: AlertEngine) -> List[AlertDraft]:
    alerts: List[AlertDraft] = []
    for record in records:
        if engine.should_alert(record["relevance_score"], record["urgency"]):
            alerts.append(
                engine.build_alert(
                    score=record["relevance_score"],
                    urgency=record["urgency"],
                    title=record["title"],
                    url=record["url"],
                    source=record.get("source_name", "unknown"),
                )
            )
    return alerts
