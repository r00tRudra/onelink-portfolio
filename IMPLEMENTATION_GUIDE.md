# OneLink Portfolio - Implementation Guide

## Project Overview

This is a complete FastAPI backend for the OneLink Portfolio system - a tool that auto-generates professional portfolios from GitHub data.

## What Has Been Implemented

### ✅ Core Features

1. **Database Layer**
   - SQLAlchemy 2.0 ORM
   - SQLite database (easily migratable to PostgreSQL)
   - 6 main models: User, Project, Experience, Education, Skill, Media
   - Proper relationships and foreign keys

2. **Authentication System**
   - GitHub OAuth 2.0 integration
   - JWT token generation & validation
   - Secure token storage
   - Automatic user creation on first login
   - Unique portfolio username generation

3. **GitHub Data Integration**
   - Fetch user repositories
   - Filter forked/archived repos
   - Extract programming languages
   - README fetching & parsing
   - Automatic demo URL detection
   - Project classification (deployed/code_only/in_progress)

4. **User Management API**
   - Profile CRUD operations
   - Work experience management
   - Education history
   - Skills tracking
   - Privacy controls

5. **Project Management**
   - GitHub sync functionality
   - Project visibility control
   - Status tracking
   - Tech stack extraction
   - Statistics (stars, forks, watchers)

6. **Resume Processing**
   - PDF & DOCX file support
   - Text extraction
   - Skill parsing
   - Experience extraction
   - Education detection

7. **Public Portfolio API**
   - Shareable portfolio links
   - No authentication required for viewing
   - Complete portfolio display
   - Media support

8. **Media Management**
   - File metadata storage
   - Media type tracking
   - Ordering support
   - Media association with projects

### ✅ Code Quality

- Clean, modular architecture
- Comprehensive error handling
- Input validation with Pydantic
- Async/await throughout
- Logging support
- CORS enabled
- Type hints

---

## File Structure

```
onelink-portfolio/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app setup
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py               # OAuth endpoints
│   │   │   ├── users.py              # User profile, experience, education, skills
│   │   │   ├── projects.py           # Project CRUD, GitHub sync
│   │   │   ├── portfolio.py          # Public portfolio endpoint
│   │   │   ├── resume.py             # Resume upload & parsing
│   │   │   └── deps.py               # Old deps (can be removed)
│   │   ├── core/
│   │   │   ├── config.py             # Settings & environment config
│   │   │   ├── security.py           # JWT, password hashing, auth
│   │   │   └── github.py             # Placeholder for future
│   │   ├── db/
│   │   │   ├── database.py           # SQLAlchemy setup
│   │   │   └── init_db.py            # Database initialization
│   │   ├── models/
│   │   │   ├── __init__.py           # Model exports
│   │   │   ├── user.py               # User model
│   │   │   ├── project.py            # Project model
│   │   │   ├── experience.py         # Experience model
│   │   │   ├── education.py          # Education model
│   │   │   ├── skill.py              # Skill model
│   │   │   └── media.py              # Media model
│   │   ├── schemas/
│   │   │   ├── user.py               # User schemas
│   │   │   ├── project.py            # Project schemas
│   │   │   ├── portfolio.py          # Portfolio schema
│   │   │   └── resume.py             # Resume/Experience/Education/Skills schemas
│   │   ├── services/
│   │   │   ├── github_service.py     # GitHub API integration
│   │   │   ├── resume_parser.py      # Resume parsing
│   │   │   └── project_classifier.py # Project classification
│   │   └── utils/
│   │       ├── file_upload.py        # File upload utilities
│   │       └── text_extractors.py    # Text extraction helpers
│   ├── requirements.txt              # Python dependencies
│   └── README.md                     # Backend documentation
├── .env.example                      # Environment template
├── API_DOCUMENTATION.md              # Complete API reference
└── IMPLEMENTATION_GUIDE.md           # This file
```

---

## Getting Started

### 1. Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/sagarjana00/onelink-portfolio.git
cd onelink-portfolio/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp ../.env.example ../.env
```

Edit `.env` with your GitHub OAuth credentials:

```env
GITHUB_CLIENT_ID=your_client_id_from_github
GITHUB_CLIENT_SECRET=your_client_secret_from_github
GITHUB_OAUTH_REDIRECT_URI=http://localhost:8000/auth/callback
SECRET_KEY=generate_a_random_secret_key_here
```

### 3. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:8000/auth/callback`
4. Copy Client ID and Client Secret to `.env`

### 4. Run the Server

```bash
uvicorn app.main:app --reload
```

Server starts at `http://localhost:8000`

Access:
- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc (ReDoc)
- **Health Check**: http://localhost:8000/health

---

## Database Schema Overview

### Users Table
Stores authenticated users with GitHub info and profile data.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  github_id INTEGER UNIQUE NOT NULL,
  github_username STRING UNIQUE NOT NULL,
  portfolio_username STRING UNIQUE NOT NULL,
  avatar_url STRING,
  profile_url STRING,
  bio STRING,
  location STRING,
  email STRING,
  access_token STRING,
  token_type STRING DEFAULT 'bearer',
  resume_text STRING,
  resume_raw STRING,
  is_public BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_sync DATETIME
);
```

### Projects Table
Stores GitHub repositories synced for each user.

```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  github_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  name STRING NOT NULL,
  description STRING,
  url STRING NOT NULL,
  homepage STRING,
  readme_content STRING,
  languages JSON,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,
  status STRING DEFAULT 'code_only',
  is_deployed BOOLEAN DEFAULT FALSE,
  deployed_url STRING,
  is_visible BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  is_fork BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  github_updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Relationships

```
User (1) ──── (many) Projects
User (1) ──── (many) Experiences
User (1) ──── (many) Education
User (1) ──── (many) Skills
User (1) ──── (many) Media

Project (1) ──── (many) Media
```

---

## API Flow Examples

### Complete User Registration & Sync Flow

1. **User clicks "Login with GitHub"**
   ```
   GET /auth/login
   → Returns GitHub OAuth URL
   ```

2. **User authorizes on GitHub**
   ```
   Redirected to GitHub consent screen
   User clicks "Authorize"
   ```

3. **GitHub redirects back to app**
   ```
   GET /auth/callback?code=xxx&state=yyy
   → Backend exchanges code for GitHub token
   → Creates User in database
   → Returns JWT token
   ```

4. **User stores JWT locally**
   ```
   Frontend stores token in localStorage/cookie
   ```

5. **Auto-sync projects on first login** (Optional)
   ```
   POST /projects/sync
   Authorization: Bearer <jwt_token>
   → Fetches all repos from GitHub
   → Creates Project records
   → Detects demo URLs
   → Classifies projects
   ```

6. **User adds manual profile info**
   ```
   POST /users/me/experience
   POST /users/me/education
   POST /users/me/skills
   ```

7. **User uploads resume (optional)**
   ```
   POST /resume/upload
   → Parses PDF/DOCX
   → Extracts skills/experience/education
   ```

8. **Public portfolio is live**
   ```
   GET /portfolio/johndoe
   → Anyone can view without auth
   ```

---

## Key Implementation Details

### Authentication
- Uses GitHub OAuth for initial auth
- Issues JWT tokens for subsequent requests
- JWT tokens expire after 7 days
- No password storage (GitHub manages authentication)

### GitHub Data Sync
- Fetches repos on demand via `/projects/sync`
- Excludes forked repositories
- Excludes archived repositories
- Detects demo URLs automatically
- Stores tech stack as JSON
- Updates with each sync

### Demo Detection
- Checks repository homepage field first
- Scans README for common patterns:
  - `vercel.app`, `netlify.app`, `herokuapp.com`, `render.com`, `github.io`, `surge.sh`
- Also looks for markdown links with "demo" or "live" text

### Privacy
- Users control visibility of projects
- Portfolio can be hidden entirely
- Public API only returns visible data
- GitHub access tokens never exposed to frontend

---

## Development Workflow

### Adding a New Feature

1. **Create Model** (if needed)
   ```python
   # In app/models/new_model.py
   class NewModel(Base):
       __tablename__ = "new_models"
       # Define columns and relationships
   ```

2. **Create Schema** (validation)
   ```python
   # In app/schemas/new_schema.py
   class NewModelCreate(BaseModel):
       # Define fields
   ```

3. **Create Endpoint**
   ```python
   # In app/api/new_route.py
   @router.post("/", response_model=NewModelResponse)
   async def create_new(obj: NewModelCreate, ...):
       # Implementation
   ```

4. **Import in main.py**
   ```python
   from app.api import new_route
   app.include_router(new_route.router, prefix="/new")
   ```

### Testing Workflow

Use the built-in Swagger UI:
1. Go to http://localhost:8000/docs
2. Click "Authorize"
3. Complete GitHub OAuth flow
4. Use endpoints directly from UI

Or use curl:
```bash
# Get OAuth URL
curl http://localhost:8000/auth/login

# After getting JWT token, use it:
curl -H "Authorization: Bearer <token>" http://localhost:8000/users/me
```

---

## Common Issues & Solutions

### Issue: GitHub OAuth Returns 401
**Solution:** 
- Verify Client ID and Secret in `.env`
- Ensure redirect URI matches exactly in GitHub settings
- Check that OAuth app is not revoked

### Issue: Database Locked
**Solution:**
- SQLite locks during concurrent writes
- For production, migrate to PostgreSQL
- Restart server if locked

### Issue: Resume Parser Fails
**Solution:**
- Ensure file is valid PDF/DOCX
- File size < 10MB
- Text encoding is UTF-8

### Issue: Projects Not Syncing
**Solution:**
- Verify GitHub access token is stored
- Check GitHub API rate limits
- Ensure user has public repos

---

## Performance Considerations

1. **Database Queries**
   - Add indexes on frequently filtered columns
   - Consider pagination for large lists

2. **GitHub API**
   - Rate limit: 5000 requests/hour
   - Implement caching for README content
   - Batch requests where possible

3. **File Uploads**
   - Validate file size before processing
   - Process async to avoid blocking
   - Store in external service (S3) for production

4. **Frontend Requests**
   - Enable response caching headers
   - Compress JSON responses
   - Implement request debouncing

---

## Migration Path

### To Production

1. **Database**: Migrate from SQLite to PostgreSQL
   ```python
   # Change in config.py
   DATABASE_URL = "postgresql://user:password@localhost/onelink"
   ```

2. **Security**: 
   - Enable HTTPS
   - Set secure CORS origins
   - Use strong SECRET_KEY
   - Implement rate limiting

3. **Hosting Options**:
   - Heroku
   - AWS (EC2/ECS)
   - DigitalOcean
   - Railway
   - Render

4. **Environment**:
   - Use Docker containers
   - Set up CI/CD pipeline
   - Configure environment variables
   - Add monitoring & logging

### To PostgreSQL

```python
# Install driver
pip install psycopg2-binary

# Update DATABASE_URL in config.py
DATABASE_URL = "postgresql://user:password@localhost:5432/onelink_db"

# Create database
createdb onelink_db

# Run migrations
alembic upgrade head
```

---

## Testing

### Manual Testing Checklist

- [ ] GitHub OAuth login flow
- [ ] User profile creation
- [ ] Project sync from GitHub
- [ ] Project visibility control
- [ ] Experience/Education/Skills CRUD
- [ ] Resume upload & parsing
- [ ] Public portfolio viewing
- [ ] Error handling

### Automated Testing (Future)

```bash
pytest tests/
pytest tests/ --cov=app/  # Coverage report
```

---

## Monitoring & Logging

Current logging setup in `app/main.py`:

```python
import logging
logger = logging.getLogger(__name__)
logger.info("Database initialized successfully")
```

For production, integrate with:
- Sentry (error tracking)
- DataDog (APM)
- ELK Stack (logs)
- Prometheus (metrics)

---

## Next Steps / v2 Features

1. **Media Upload Endpoints**
   - Implement file storage (S3/Cloudinary)
   - Add media CRUD endpoints

2. **Advanced Search**
   - Full-text search on projects
   - Filter by language

3. **Analytics**
   - Portfolio view counts
   - Project popularity

4. **Social Features**
   - Comments on projects
   - Follows/Followers

5. **Customization**
   - Portfolio themes
   - Custom domains
   - Reorder projects

6. **Performance**
   - Redis caching
   - Elasticsearch
   - CDN for media

7. **Integrations**
   - LinkedIn
   - Twitter
   - RSS Feed

---

## Support & Debugging

### View API Logs
```bash
# With verbose logging
uvicorn app.main:app --reload --log-level debug
```

### Debug Database Queries
```python
# In config.py, set:
echo=True  # Will print all SQL queries
```

### Access Database Directly
```bash
sqlite3 onelink_portfolio.db
sqlite> SELECT * FROM users;
```

---

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

---

## License

MIT
