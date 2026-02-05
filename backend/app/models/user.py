from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True, nullable=False)
    github_username = Column(String, unique=True, index=True, nullable=False)
    portfolio_username = Column(String, unique=True, index=True, nullable=False)  # Unique shareable URL slug
    avatar_url = Column(String, nullable=True)
    profile_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    location = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # OAuth
    access_token = Column(String, nullable=True)
    token_type = Column(String, default="bearer")
    
    # Resume
    resume_text = Column(String, nullable=True)
    resume_raw = Column(String, nullable=True)  # Raw resume content
    
    # Profile visibility
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_sync = Column(DateTime, nullable=True)  # Last GitHub sync time

    # Relationships
    projects = relationship(
        "Project",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan"
    )
    experiences = relationship(
        "Experience",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan"
    )
    education = relationship(
        "Education",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan"
    )
    skills = relationship(
        "Skill",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan"
    )
    media = relationship(
        "Media",
        back_populates="user",
        lazy="select",
        cascade="all, delete-orphan"
    )