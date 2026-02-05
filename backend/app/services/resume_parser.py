import PyPDF2
import re
from typing import Dict, List, Any, Optional
from datetime import datetime


class ResumeParser:
    """Service for parsing resume files"""
    
    @staticmethod
    async def extract_text_from_pdf(file_content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            print(f"Error extracting PDF text: {e}")
            return ""
    
    @staticmethod
    def extract_text_from_docx(file_content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            from docx import Document
            import io
            doc = Document(io.BytesIO(file_content))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            print(f"Error extracting DOCX text: {e}")
            return ""
    
    @staticmethod
    def parse_resume_text(text: str) -> Dict[str, Any]:
        """Parse resume text to extract structured data"""
        result = {
            "experiences": [],
            "education": [],
            "skills": [],
        }
        
        # Extract skills (simple approach)
        skills_keywords = [
            "python", "javascript", "java", "c++", "c#", "go", "rust",
            "react", "vue", "angular", "nodejs", "fastapi", "django",
            "sql", "postgresql", "mongodb", "redis",
            "aws", "gcp", "azure", "docker", "kubernetes",
            "git", "ci/cd", "agile", "rest api", "graphql",
            "html", "css", "scss", "typescript",
            "machine learning", "tensorflow", "pytorch", "nlp",
        ]
        
        text_lower = text.lower()
        found_skills = set()
        
        for skill in skills_keywords:
            if skill in text_lower:
                found_skills.add(skill)
        
        result["skills"] = [{"name": skill} for skill in sorted(found_skills)]
        
        # Extract work experience using patterns
        # Looks for patterns like "Company Name | Title | Dates"
        experience_pattern = r"(.+?)\s*\|?\s*(.+?)\s*\|?\s*(\d{1,2}/\d{1,2}/\d{4})\s*[-–]\s*(\d{1,2}/\d{1,2}/\d{4}|Present)"
        
        # Extract education
        education_keywords = ["bachelor", "master", "phd", "degree", "diploma", "b.s.", "m.s.", "m.a."]
        education_lines = []
        
        for line in text.split("\n"):
            if any(keyword in line.lower() for keyword in education_keywords):
                education_lines.append(line.strip())
                result["education"].append({
                    "school": line.strip(),
                    "degree": "Not specified"
                })
        
        return result
    
    @staticmethod
    def extract_email(text: str) -> Optional[str]:
        """Extract email address from text"""
        pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        match = re.search(pattern, text)
        return match.group(0) if match else None
    
    @staticmethod
    def extract_phone(text: str) -> Optional[str]:
        """Extract phone number from text"""
        pattern = r"(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})"
        match = re.search(pattern, text)
        return match.group(0) if match else None


import io
resume_parser = ResumeParser()
