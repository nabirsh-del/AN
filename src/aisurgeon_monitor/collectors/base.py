from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Iterable

import requests

logger = logging.getLogger(__name__)


@dataclass
class ContentRecord:
    source_type: str
    source_name: str
    url: str
    title: str
    content_text: str
    published_at: datetime
    metadata: Dict


class Collector:
    def fetch(self) -> Iterable[ContentRecord]:
        raise NotImplementedError

    def _get(self, url: str) -> str:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        return response.text
