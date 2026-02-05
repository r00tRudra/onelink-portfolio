from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)  # NULL if portfolio-level media
    
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)  # Relative path or URL
    media_type = Column(String, nullable=False)  # screenshot, video, gif, etc
    mime_type = Column(String, nullable=True)  # image/png, video/mp4, etc
    
    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)  # Sort order
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="media")
    project = relationship("Project", back_populates="media")
