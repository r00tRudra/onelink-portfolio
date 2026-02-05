# OneLink Portfolio API Documentation

## Complete API Reference

Base URL: `http://localhost:8000`

All timestamps are in ISO 8601 format (UTC).

---

## Authentication Endpoints

### 1. Initiate GitHub OAuth Login
```
GET /auth/login
```

**Response:**
```json
{
  "authorization_url": "https://github.com/login/oauth/authorize?..."
}
```

**Description:** Returns the GitHub OAuth authorization URL. Redirect user to this URL.

---

### 2. Handle OAuth Callback
```
GET /auth/callback?code=<code>&state=<state>
```

**Query Parameters:**
- `code` (string): OAuth code from GitHub
- `state` (string): State parameter for CSRF protection

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "expires_in": 604800,
  "user": {
    "id": 1,
    "github_username": "johndoe",
    "portfolio_username": "johndoe"
  }
}
```

**Description:** GitHub calls this endpoint after user approves. Returns JWT token for subsequent requests.

---

### 3. Logout
```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## User Endpoints

### 1. Get Current User Profile
```
GET /users/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "github_id": 123456,
  "github_username": "johndoe",
  "portfolio_username": "johndoe",
  "avatar_url": "https://avatars.githubusercontent.com/u/123456?v=4",
  "profile_url": "https://github.com/johndoe",
  "bio": "Full stack developer",
  "location": "San Francisco, CA",
  "email": "john@example.com",
  "is_public": true,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "last_sync": "2024-01-16T08:15:00Z"
}
```

---

### 2. Update User Profile
```
PUT /users/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "Updated bio",
  "location": "New York, NY",
  "is_public": true
}
```

**Response:** Updated user object (same as GET /users/me)

---

### 3. Get Public User Profile
```
GET /users/{portfolio_username}
```

**Response:**
```json
{
  "portfolio_username": "johndoe",
  "github_username": "johndoe",
  "bio": "Full stack developer",
  "location": "San Francisco, CA",
  "avatar_url": "https://avatars.githubusercontent.com/u/123456?v=4",
  "profile_url": "https://github.com/johndoe",
  "is_public": true
}
```

**Note:** No authentication required. Returns 404 if user is not public.

---

## Work Experience Endpoints

### 1. Add Work Experience
```
POST /users/me/experience
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "description": "Led development of new features",
  "start_date": "2022-01-15T00:00:00Z",
  "end_date": null,
  "is_current": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Senior Developer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "description": "Led development of new features",
  "start_date": "2022-01-15T00:00:00Z",
  "end_date": null,
  "is_current": true,
  "created_at": "2024-01-16T10:30:00Z",
  "updated_at": "2024-01-16T10:30:00Z"
}
```

---

### 2. Get Work Experiences
```
GET /users/me/experience
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Senior Developer",
    "company": "Tech Corp",
    ...
  }
]
```

---

### 3. Update Work Experience
```
PUT /users/me/experience/{experience_id}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** Same as POST (partial updates supported)

---

### 4. Delete Work Experience
```
DELETE /users/me/experience/{experience_id}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Experience deleted"
}
```

---

## Education Endpoints

### 1. Add Education
```
POST /users/me/education
```

**Request Body:**
```json
{
  "school": "Stanford University",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "description": "GPA: 3.8",
  "start_date": "2018-09-01T00:00:00Z",
  "end_date": "2022-05-31T00:00:00Z",
  "is_current": false
}
```

---

### 2. Get Education
```
GET /users/me/education
```

---

### 3. Update Education
```
PUT /users/me/education/{education_id}
```

---

### 4. Delete Education
```
DELETE /users/me/education/{education_id}
```

---

## Skills Endpoints

### 1. Add Skill
```
POST /users/me/skills
```

**Request Body:**
```json
{
  "name": "Python",
  "proficiency": "expert",
  "category": "backend"
}
```

**Proficiency Levels:**
- `beginner`
- `intermediate`
- `expert`

**Common Categories:**
- `frontend`, `backend`, `devops`, `design`, `mobile`, `data-science`

---

### 2. Get Skills
```
GET /users/me/skills
```

---

### 3. Update Skill
```
PUT /users/me/skills/{skill_id}
```

---

### 4. Delete Skill
```
DELETE /users/me/skills/{skill_id}
```

---

## Project Endpoints

### 1. Sync Projects from GitHub
```
POST /projects/sync
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Synced 15 projects",
  "synced_count": 15
}
```

**Description:** Fetches all public repos from GitHub, detects demos, classifies projects, and updates database.

---

### 2. Get User's Projects
```
GET /projects?skip=0&limit=20&status_filter=deployed
```

**Query Parameters:**
- `skip` (int): Number of results to skip (pagination)
- `limit` (int): Max results per page (1-100, default 20)
- `status_filter` (string): Filter by status - `deployed`, `code_only`, or `in_progress` (optional)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "github_id": 456789,
      "name": "awesome-project",
      "description": "My awesome project",
      "url": "https://github.com/johndoe/awesome-project",
      "homepage": "https://awesome-project.vercel.app",
      "readme_content": "# Awesome Project...",
      "languages": {
        "Python": 45,
        "HTML": 30,
        "CSS": 25
      },
      "stars": 42,
      "forks": 12,
      "watchers": 5,
      "status": "deployed",
      "is_deployed": true,
      "deployed_url": "https://awesome-project.vercel.app",
      "is_visible": true,
      "is_archived": false,
      "is_fork": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T08:15:00Z",
      "github_updated_at": "2024-01-16T08:15:00Z"
    }
  ],
  "total": 15,
  "page": 0,
  "page_size": 20
}
```

---

### 3. Get Specific Project
```
GET /projects/{project_id}
```

**Response:** Single project object (same as items in GET /projects)

---

### 4. Update Project
```
PUT /projects/{project_id}
```

**Request Body:**
```json
{
  "is_visible": false
}
```

**Response:** Updated project object

---

### 5. Delete Project
```
DELETE /projects/{project_id}
```

**Response:**
```json
{
  "message": "Project deleted"
}
```

---

## Resume Endpoints

### 1. Upload & Parse Resume
```
POST /resume/upload
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` (file): PDF or DOCX file (required)

**Response:**
```json
{
  "message": "Resume resume.pdf uploaded and parsed",
  "parsed_data": {
    "experiences": [
      {
        "id": 1,
        "title": "Developer",
        "company": "Company",
        ...
      }
    ],
    "education": [
      {
        "id": 1,
        "school": "University",
        "degree": "Bachelor",
        ...
      }
    ],
    "skills": [
      {
        "name": "Python"
      },
      {
        "name": "JavaScript"
      }
    ],
    "raw_text": "Resume content preview..."
  }
}
```

**Supported Formats:** PDF, DOCX

---

### 2. Get Stored Resume Text
```
GET /resume/text
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "resume_text": "Full resume text content..."
}
```

---

## Public Portfolio Endpoint

### Get Complete Public Portfolio
```
GET /portfolio/{portfolio_username}
```

**Response:**
```json
{
  "user": {
    "portfolio_username": "johndoe",
    "github_username": "johndoe",
    "bio": "Full stack developer",
    "location": "San Francisco, CA",
    "avatar_url": "https://avatars.githubusercontent.com/u/123456?v=4",
    "profile_url": "https://github.com/johndoe",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "projects": [
    {
      "id": 1,
      "name": "awesome-project",
      "description": "My awesome project",
      "url": "https://github.com/johndoe/awesome-project",
      "deployed_url": "https://awesome-project.vercel.app",
      "status": "deployed",
      "languages": {
        "Python": 45,
        "HTML": 30
      },
      "stars": 42,
      "media": []
    }
  ],
  "experiences": [
    {
      "id": 1,
      "title": "Senior Developer",
      "company": "Tech Corp",
      ...
    }
  ],
  "education": [
    {
      "id": 1,
      "school": "Stanford University",
      ...
    }
  ],
  "skills": [
    {
      "id": 1,
      "name": "Python",
      "proficiency": "expert",
      "category": "backend"
    }
  ],
  "media": [
    {
      "id": 1,
      "filename": "portfolio_pic.jpg",
      "file_path": "/uploads/1_portfolio_pic.jpg",
      "media_type": "screenshot",
      "mime_type": "image/jpeg",
      "title": "My Portfolio",
      "description": "Portfolio screenshot",
      "order": 0
    }
  ]
}
```

**Note:** No authentication required. Only returns public data from users with `is_public=true`.

---

## Health Checks

### 1. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "database": "sqlite"
}
```

---

### 2. Root Endpoint
```
GET /
```

**Response:**
```json
{
  "message": "OneLink Portfolio API",
  "docs": "/docs",
  "version": "1.0.0"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 422 | Unprocessable Entity (invalid data) |
| 500 | Server Error |

### Example Error Response
```json
{
  "detail": "User not found"
}
```

---

## Project Status Definitions

- **deployed**: Project has a live demo URL
- **code_only**: Source code only, no live demo
- **in_progress**: Project marked as WIP or experimental

---

## Demo URL Detection

The system automatically detects demo URLs from:
1. Repository homepage field
2. README links to known deployment platforms:
   - Vercel (*.vercel.app)
   - Netlify (*.netlify.app)
   - Heroku (*.herokuapp.com)
   - Render (*.render.com)
   - GitHub Pages (*.github.io)
   - Surge (*.surge.sh)

---

## Rate Limiting

Currently no rate limiting is implemented. Will be added in v2.

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production in `app/main.py`.

---

## Pagination

For list endpoints, use `skip` and `limit` parameters:
- `skip`: Number of records to skip (default 0)
- `limit`: Maximum records to return (default 20, max 100)

Example: `/projects?skip=20&limit=10` returns records 21-30.

---

## Testing

Use the interactive API docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Rate Limits (Future)

Currently unlimited. Planning to add:
- 100 requests per minute per IP
- 1000 requests per hour per user
- GitHub API rate limit handling

---

## Webhooks (Future)

Planned for v2:
- Repository updated webhook
- New repository detection
- Automatic syncs
