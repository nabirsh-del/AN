#!/usr/bin/env python3
"""Daily monitoring job to collect, score, and queue content."""
from pathlib import Path

from aisurgeon_monitor.actions.action_layer import AlertEngine, batch_filter
from aisurgeon_monitor.analyzers.scoring import RelevanceScorer
from aisurgeon_monitor.collectors.rss_collector import RSSCollector
from aisurgeon_monitor.config import load_settings

import numpy as np


def main() -> None:
    settings = load_settings(Path("config/default_settings.yaml"))

    feeds = RSSCollector(
        name="trade-publications",
        feeds=[
            "https://www.medscape.com/cardiology/rss.xml",
            "https://www.modernhealthcare.com/section/rss",
        ],
    )

    # Placeholder: load embeddings from vector DB
    corpus_vectors = np.eye(3)
    pillar_labels = ["Valve Leadership", "Innovation", "Outcomes"]
    scorer = RelevanceScorer(corpus_vectors, pillar_labels)

    records = []
    for item in feeds.fetch():
        # In production, generate embeddings + metadata via LLM/classifier
        metadata = {"category": "news", "sentiment": "neutral"}
        content_vector = np.ones(3)
        scored = scorer.score(content_vector, metadata)
        records.append(
            {
                "title": item.title,
                "url": item.url,
                "source_name": item.source_name,
                "relevance_score": scored.relevance_score,
                "urgency": scored.urgency,
            }
        )

    alert_engine = AlertEngine(settings.alerting.relevance_threshold, settings.alerting.urgency_override)
    alerts = batch_filter(records, alert_engine)

    for alert in alerts:
        print(f"ALERT DRAFT: {alert.headline} | {alert.urgency} | {alert.relevance_score}")


if __name__ == "__main__":
    main()
