from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Dict, List, Tuple

import numpy as np

logger = logging.getLogger(__name__)


@dataclass
class ScoredRecord:
    relevance_score: float
    urgency: str
    category: str
    sentiment: str
    thought_leadership_pillar: str
    similarity_to_corpus: float
    sensitive_flag: bool


class RelevanceScorer:
    def __init__(self, corpus_vectors: np.ndarray, labels: List[str]):
        self.corpus_vectors = corpus_vectors
        self.labels = labels

    def score(self, content_vector: np.ndarray, metadata: Dict) -> ScoredRecord:
        similarity, pillar = self._similarity(content_vector)
        category = metadata.get("category", "news")
        urgency = self._determine_urgency(metadata)
        sentiment = metadata.get("sentiment", "neutral")

        relevance_score = float(np.clip(similarity * 100, 0, 100))
        sensitive_flag = metadata.get("mentions_complications", False) or metadata.get("mentions_competitor", False)

        return ScoredRecord(
            relevance_score=relevance_score,
            urgency=urgency,
            category=category,
            sentiment=sentiment,
            thought_leadership_pillar=pillar,
            similarity_to_corpus=float(similarity),
            sensitive_flag=bool(sensitive_flag),
        )

    def _similarity(self, content_vector: np.ndarray) -> Tuple[float, str]:
        norms = np.linalg.norm(self.corpus_vectors, axis=1) * np.linalg.norm(content_vector)
        scores = (self.corpus_vectors @ content_vector) / norms
        idx = int(np.argmax(scores))
        return float(scores[idx]), self.labels[idx]

    @staticmethod
    def _determine_urgency(metadata: Dict) -> str:
        if metadata.get("breaking_signal"):
            return "breaking"
        if metadata.get("regulatory_deadline"):
            return "breaking"
        return "routine"
