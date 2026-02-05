from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    is_visible: Optional[bool] = None


class ProjectResponse(ProjectBase):
    id: int
    github_id: int
    url: str
    homepage: Optional[str]
    readme_content: Optional[str]
    languages: Optional[Dict[str, int]]
    stars: int
    forks: int
    watchers: int
    status: str  # deployed, code_only, in_progress
    is_deployed: bool
    deployed_url: Optional[str]
    is_visible: bool
    is_archived: bool
    is_fork: bool
    created_at: datetime
    updated_at: datetime
    github_updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ProjectPublicResponse(BaseModel):
    """Public project info (filtered)"""
    id: int
    name: str
    description: Optional[str]
    url: str
    deployed_url: Optional[str]
    status: str
    languages: Optional[Dict[str, int]]
    stars: int

    class Config:
        from_attributes = True


class ProjectSyncRequest(BaseModel):
    """Request to manually sync projects from GitHub"""
    pass


class ProjectListResponse(BaseModel):
    """Paginated project list"""
    items: List[ProjectResponse]
    total: int
    page: int
    page_size: int
