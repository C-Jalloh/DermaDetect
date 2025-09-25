from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .extensions import db


class BaseModel(db.Model):
    __abstract__ = True

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class SyncMixin:
    sync_status: Mapped[str] = mapped_column(
        String(16), default="new", nullable=False, index=True
    )
    last_modified_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )


class CHWUser(BaseModel):
    __tablename__ = "chw_users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    patients: Mapped[list[Patient]] = relationship("Patient", back_populates="chw")
    cases: Mapped[list[Case]] = relationship("Case", back_populates="chw")
    vitals: Mapped[list[Vitals]] = relationship("Vitals", back_populates="chw")


class DoctorUser(BaseModel):
    __tablename__ = "doctor_users"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    diagnoses: Mapped[list[Diagnosis]] = relationship("Diagnosis", back_populates="doctor")


class Patient(BaseModel, SyncMixin):
    __tablename__ = "patients"

    chw_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("chw_users.id"), nullable=False
    )
    demographics: Mapped[str] = mapped_column(Text, nullable=False)

    chw: Mapped[CHWUser] = relationship("CHWUser", back_populates="patients")
    cases: Mapped[list[Case]] = relationship("Case", back_populates="patient")
    vitals: Mapped[list[Vitals]] = relationship("Vitals", back_populates="patient")


class Case(BaseModel, SyncMixin):
    __tablename__ = "cases"

    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id"), nullable=False
    )
    chw_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("chw_users.id"), nullable=False
    )
    triage_data: Mapped[str] = mapped_column(Text, nullable=False)
    ai_analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="TRIAGED", nullable=False)
    risk_level: Mapped[str] = mapped_column(String(16), nullable=False)
    image_urls: Mapped[str] = mapped_column(Text, nullable=True)

    patient: Mapped[Patient] = relationship("Patient", back_populates="cases")
    chw: Mapped[CHWUser] = relationship("CHWUser", back_populates="cases")
    diagnoses: Mapped[list[Diagnosis]] = relationship("Diagnosis", back_populates="case")
    queue_entries: Mapped[list[MedGemmaQueue]] = relationship(
        "MedGemmaQueue", back_populates="case"
    )


class Diagnosis(BaseModel, SyncMixin):
    __tablename__ = "diagnoses"

    case_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("cases.id"), nullable=False
    )
    doctor_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("doctor_users.id"), nullable=False
    )
    diagnosis_text: Mapped[str] = mapped_column(Text, nullable=False)
    prescription: Mapped[str | None] = mapped_column(Text, nullable=True)

    case: Mapped[Case] = relationship("Case", back_populates="diagnoses")
    doctor: Mapped[DoctorUser] = relationship("DoctorUser", back_populates="diagnoses")


class Vitals(BaseModel, SyncMixin):
    __tablename__ = "vitals"

    patient_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("patients.id"), nullable=False
    )
    chw_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("chw_users.id"), nullable=False
    )
    temperature: Mapped[str] = mapped_column(String(16), nullable=False)  # e.g., "98.6°F"
    blood_pressure: Mapped[str] = mapped_column(String(16), nullable=False)  # e.g., "120/80"
    weight: Mapped[str] = mapped_column(String(16), nullable=False)  # e.g., "70kg"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    patient: Mapped[Patient] = relationship("Patient", back_populates="vitals")
    chw: Mapped[CHWUser] = relationship("CHWUser", back_populates="vitals")


class MedGemmaQueue(BaseModel):
    __tablename__ = "medgemma_queue"

    case_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("cases.id"), nullable=False, unique=True
    )
    status: Mapped[str] = mapped_column(String(16), default="queued", nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    case: Mapped[Case] = relationship("Case", back_populates="queue_entries")
