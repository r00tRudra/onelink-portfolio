from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, index=True, nullable=False)
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    url = Column(String, nullable=False)
    homepage = Column(String, nullable=True)  # Live demo URL
    readme_content = Column(String, nullable=True)
    
    # Tech stack
    languages = Column(JSON, nullable=True)  # {language: percentage}
    
    # GitHub stats
    stars = Column(Integer, default=0)
    forks = Column(Integer, default=0)
    watchers = Column(Integer, default=0)
    
    # Project classification
    status = Column(String, default="code_only")  # deployed, code_only, in_progress
    is_deployed = Column(Boolean, default=False)
    deployed_url = Column(String, nullable=True)  # Actual live demo URL found
    
    # Privacy
    is_visible = Column(Boolean, default=True)  # User can hide specific projects
    is_archived = Column(Boolean, default=False)
    is_fork = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    github_updated_at = Column(DateTime, nullable=True)
    
    # Foreign key
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="projects")
    media = relationship(
        "Media",
        back_populates="project",
        lazy="select",
        cascade="all, delete-orphan"
    )