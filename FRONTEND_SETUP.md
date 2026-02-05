# OneLink Portfolio - Complete Setup Guide

This guide will help you set up the complete OneLink Portfolio application - both backend and frontend.

## System Requirements

- **Node.js**: 18.x or higher
- **Python**: 3.9 or higher  
- **npm or yarn**: Latest version
- **Git**: For version control

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=sqlite:///./portfolio.db

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_app_id
GITHUB_CLIENT_SECRET=your_github_app_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/callback

# JWT
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# API
API_URL=http://localhost:8000
```

### 5. Initialize Database

```bash
python app/db/init_db.py
```

### 6. Run Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: **http://localhost:8000**
API documentation: **http://localhost:8000/docs**

## Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server

```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## GitHub OAuth Configuration

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: OneLink Portfolio
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:8000/auth/callback

### 2. Get OAuth Credentials

- Copy **Client ID** and **Client Secret**
- Add to your backend `.env` file

## Quick Start Checklist

- [ ] Backend requirements installed
- [ ] Backend `.env` configured
- [ ] Backend database initialized
- [ ] Backend running on http://localhost:8000
- [ ] GitHub OAuth app created
- [ ] Frontend dependencies installed
- [ ] Frontend `.env.local` configured
- [ ] Frontend running on http://localhost:3000

## Testing the Application

### 1. Access the Application

Open http://localhost:3000 in your browser

### 2. Login with GitHub

Click "Login with GitHub" button
- You'll be redirected to GitHub
- Authorize the application
- You'll be redirected back to the dashboard

### 3. Test Features

- **Sync Projects**: Click "Sync GitHub Projects" to import your repositories
- **Add Experience**: Go to Dashboard > Experience and add your work history
- **Add Education**: Go to Dashboard > Education and add your education
- **Add Skills**: Go to Dashboard > Skills and add your technical skills
- **Upload Resume**: Go to Settings and upload a resume (PDF or DOCX)
- **View Portfolio**: Click "View Public Portfolio" to see your public page

### 4. View API Documentation

Visit http://localhost:8000/docs to see the interactive API documentation

## Project Structure

```
onelink-portfolio/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── core/          # Config & security
│   │   └── db/            # Database setup
│   ├── requirements.txt   # Python dependencies
│   └── README.md
│
└── frontend/
    ├── app/              # Next.js pages
    ├── components/       # React components
    ├── lib/              # API client & services
    ├── store/            # State management
    ├── styles/           # Global styles
    ├── package.json      # Node dependencies
    └── README.md
```

## API Endpoints Reference

### Authentication
- `GET /auth/login` - Redirect to GitHub OAuth
- `GET /auth/callback` - GitHub OAuth callback

### Users
- `GET /users/me` - Get current user
- `PUT /users/me` - Update user profile
- `POST /users/{id}/experience` - Add experience
- `GET /users/experience` - Get all experience
- `PUT /users/experience/{id}` - Update experience
- `DELETE /users/experience/{id}` - Delete experience

### Projects
- `POST /projects/sync` - Sync from GitHub
- `GET /projects` - Get all projects
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Portfolio
- `GET /portfolio/{username}` - Get public portfolio

### Resume
- `POST /resume/upload` - Upload resume
- `GET /resume/text` - Get parsed resume text

## Troubleshooting

### Backend Issues

**Port 8000 already in use**
```bash
# Change port
uvicorn app.main:app --reload --port 8001
```

**Database errors**
```bash
# Reset database
rm portfolio.db
python app/db/init_db.py
```

**GitHub OAuth errors**
- Verify CLIENT_ID and CLIENT_SECRET are correct
- Check callback URL matches exactly in GitHub settings
- Clear browser cookies and try again

### Frontend Issues

**Cannot connect to backend**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Clear browser cache

**Token expiration**
- Clear localStorage and login again
- Check backend JWT secret matches

## Deployment

### Backend Deployment (Heroku Example)

```bash
cd backend
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
cd frontend
vercel deploy
```

Set environment variables in deployment platform dashboard.

## Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly
- [ ] Use secure cookies for tokens
- [ ] Implement rate limiting
- [ ] Use PostgreSQL in production (not SQLite)

## Support & Documentation

- **Backend Docs**: See `backend/IMPLEMENTATION_GUIDE.md`
- **Frontend Docs**: See `frontend/README.md`
- **API Reference**: Visit http://localhost:8000/docs
- **GitHub**: [OneLink Portfolio Repository]

## Next Steps

1. Review the [Backend README](backend/README.md)
2. Review the [Frontend README](frontend/README.md)
3. Explore the API at http://localhost:8000/docs
4. Customize the styling with Tailwind CSS
5. Deploy to your preferred hosting platform

---

**Happy building! 🚀**
