from __future__ import annotations

import logging
from datetime import datetime
from time import struct_time
from typing import Iterable, List, Optional

import feedparser

from .base import Collector, ContentRecord

logger = logging.getLogger(__name__)


class RSSCollector(Collector):
    def __init__(self, name: str, feeds: List[str]):
        self.name = name
        self.feeds = feeds

    def fetch(self) -> Iterable[ContentRecord]:
        for feed_url in self.feeds:
            parsed = feedparser.parse(feed_url)
            if parsed.bozo:
                logger.warning("Failed to parse feed %s: %s", feed_url, parsed.bozo_exception)
                continue

            for entry in parsed.entries:
                yield ContentRecord(
                    source_type="rss",
                    source_name=self.name,
                    url=entry.get("link", ""),
                    title=entry.get("title", ""),
                    content_text=entry.get("summary", ""),
                    published_at=self._parse_date(entry.get("published_parsed")),
                    metadata={"feed_url": feed_url},
                )

    @staticmethod
    def _parse_date(value: Optional[struct_time]) -> datetime:
        if value:
            return datetime(*value[:6])
        return datetime.utcnow()
