from __future__ import annotations

import logging
from datetime import datetime
from typing import Iterable, List

from bs4 import BeautifulSoup

from .base import Collector, ContentRecord

logger = logging.getLogger(__name__)


class WebPageCollector(Collector):
    def __init__(self, name: str, urls: List[str]):
        self.name = name
        self.urls = urls

    def fetch(self) -> Iterable[ContentRecord]:
        for url in self.urls:
            try:
                html = self._get(url)
                soup = BeautifulSoup(html, "html.parser")
                title = soup.title.string if soup.title else ""
                text = soup.get_text(" ", strip=True)
                yield ContentRecord(
                    source_type="web",
                    source_name=self.name,
                    url=url,
                    title=title,
                    content_text=text,
                    published_at=datetime.utcnow(),
                    metadata={"scraped_at": datetime.utcnow().isoformat()},
                )
            except Exception as exc:
                logger.exception("Failed to scrape %s: %s", url, exc)
