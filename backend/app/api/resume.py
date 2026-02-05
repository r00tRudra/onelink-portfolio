from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.resume_parser import resume_parser
from app.schemas.resume import ResumeUploadResponse, ResumeParseResponse
import io

router = APIRouter()


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Upload and parse resume"""
    # Validate file type
    allowed_types = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported",
        )
    
    # Read file content
    content = await file.read()
    
    # Extract text based on file type
    if file.content_type == "application/pdf":
        text = await resume_parser.extract_text_from_pdf(content)
    else:  # DOCX
        text = resume_parser.extract_text_from_docx(content)
    
    if not text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to extract text from resume",
        )
    
    # Parse resume
    parsed_data = resume_parser.parse_resume_text(text)
    
    # Save raw resume text
    current_user.resume_raw = text
    current_user.resume_text = text[:5000]  # Summary
    db.commit()
    
    return {
        "message": f"Resume {file.filename} uploaded and parsed",
        "parsed_data": {
            "experiences": parsed_data.get("experiences", []),
            "education": parsed_data.get("education", []),
            "skills": parsed_data.get("skills", []),
            "raw_text": text[:1000] + "..." if len(text) > 1000 else text,
        }
    }


@router.get("/text")
async def get_resume_text(
    current_user: User = Depends(get_current_user),
):
    """Get stored resume text"""
    if not current_user.resume_raw:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume uploaded",
        )
    
    return {"resume_text": current_user.resume_raw}
