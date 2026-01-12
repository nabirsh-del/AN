from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional

import yaml


@dataclass
class VectorSettings:
    provider: str
    api_key: str
    environment: str
    index: str


@dataclass
class LLMSettings:
    provider: str
    model: str
    temperature: float = 0.0


@dataclass
class AlertingSettings:
    email_recipients: List[str]
    slack_webhook: Optional[str]
    relevance_threshold: int
    urgency_override: str


@dataclass
class PilotSettings:
    start_date: str
    end_date: str


@dataclass
class Settings:
    postgres_dsn: str
    vector_db: VectorSettings
    llm: LLMSettings
    alerting: AlertingSettings
    pilot: PilotSettings


def load_settings(path: Path) -> Settings:
    with path.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    return Settings(
        postgres_dsn=data["postgres_dsn"],
        vector_db=VectorSettings(**data["vector_db"]),
        llm=LLMSettings(**data["llm"]),
        alerting=AlertingSettings(**data["alerting"]),
        pilot=PilotSettings(**data["pilot"]),
    )
