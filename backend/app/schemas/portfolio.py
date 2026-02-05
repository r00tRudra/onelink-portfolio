from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MediaBase(BaseModel):
    media_type: str  # screenshot, video, gif
    title: Optional[str] = None
    description: Optional[str] = None


class MediaCreate(MediaBase):
    pass


class MediaResponse(MediaBase):
    id: int
    filename: str
    file_path: str
    mime_type: Optional[str]
    order: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PortfolioResponse(BaseModel):
    """Complete portfolio data for public viewing"""
    user: dict  # User public profile
    projects: List[dict]  # Projects list
    experiences: List[dict]  # Experience list
    education: List[dict]  # Education list
    skills: List[dict]  # Skills list
    media: List[MediaResponse]  # Portfolio media
