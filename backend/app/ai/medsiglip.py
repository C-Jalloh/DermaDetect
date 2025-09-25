from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import numpy as np


@dataclass
class MedSigLipResult:
    risk_score: float
    risk_level: str


class MedSigLipModel:
    def __init__(self, model_path: str | Path) -> None:
        self.model_path = Path(model_path)
        if not self.model_path.exists():
            # In production replace with actual model loading logic (ONNX, TF.js wrapper, etc.)
            raise FileNotFoundError(
                f"MedSigLip model not found at {self.model_path}. Please provide the converted model."
            )

    def predict(self, image_tensor: np.ndarray) -> MedSigLipResult:
        # Placeholder implementation. Substitute with actual inference.
        score = float(np.clip(np.mean(image_tensor), 0, 1))
        level = "high" if score > 0.7 else "medium" if score > 0.4 else "low"
        return MedSigLipResult(risk_score=score, risk_level=level)


def load_model(model_path: str | Path) -> MedSigLipModel:
    return MedSigLipModel(model_path)
