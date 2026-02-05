# OneLink Portfolio Frontend

A modern React/Next.js frontend for the OneLink Portfolio application - an automated portfolio generator that syncs with GitHub.

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your configuration:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

- `/app` - Next.js pages and routes
- `/components` - Reusable React components
- `/lib` - API client and service functions
- `/store` - Zustand state management stores
- `/styles` - Global styles and Tailwind configuration

## Features

- **GitHub OAuth Integration** - Seamless login with GitHub
- **Project Syncing** - Automatically fetch and sync GitHub repositories
- **Profile Management** - Add experience, education, and skills
- **Resume Upload** - Support for PDF and DOCX files
- **Public Portfolio** - Share your portfolio with a unique URL
- **Responsive Design** - Works on all devices

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:8000) |

## Technologies Used

- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Framer Motion** - Animations (optional)

## API Integration

All API calls are made through `/lib/services.ts` which provides:
- Authentication endpoints
- User profile management
- Project CRUD operations
- Experience, education, and skills management
- Resume upload and parsing
- Public portfolio retrieval

## Building & Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Troubleshooting

### API Connection Issues
- Ensure backend is running on the configured URL
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS is enabled on backend

### Authentication Issues
- Clear browser cookies and localStorage
- Check that GitHub OAuth callback URL is configured correctly
- Verify token is being stored properly in localStorage

## License

MIT
