# 🔗 TinyLink

> A modern, full-stack URL shortener with analytics

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-green?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%2B%20Render-blue)](https://vercel.com/)

TinyLink lets you create short URLs, track clicks, and manage your links — all with a sleek, responsive interface.

## ✨ Features

- **URL Shortening** — Generate short codes automatically or use custom aliases
- **Click Analytics** — Track visit counts and last-click timestamps
- **Link Management** — Dashboard to view, manage, and delete links
- **Instant Redirects** — Fast redirection to original URLs
- **Responsive UI** — Modern, futuristic design with Tailwind CSS

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), React, Tailwind CSS |
| Backend | Express.js, Mongoose |
| Database | MongoDB Atlas |
| Hosting | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```
TinyLink/
├── backend/
│   ├── server.js
│   ├── models/
│   │   └── Link.js
│   ├── utils/
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── page.js
    │   ├── code/[code]/page.js
    │   └── globals.css
    ├── lib/api.js
    ├── tailwind.config.js
    ├── package.json
    └── .env.local
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=4000
MONGODB_URI=your-mongodb-uri-here
BASE_URL=http://localhost:4000
```

Start the server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_FRONTEND_BASE=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/links` | Create a short link |
| `GET` | `/api/links` | List all links |
| `GET` | `/api/links/:code` | Get link stats |
| `DELETE` | `/api/links/:code` | Delete a link |
| `GET` | `/:code` | Redirect to original URL |

### Create a Link

```bash
curl -X POST http://localhost:4000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "code": "my-link"}'
```

Response:

```json
{
  "code": "my-link",
  "url": "https://example.com"
}
```

## 🌐 Deployment

### Backend → Render

1. Push your code to GitHub
2. Create a new **Web Service** on Render
3. Configure:
   - **Runtime:** Node
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add environment variables:
   ```
   PORT=10000
   MONGODB_URI=your-mongodb-atlas-uri
   BASE_URL=https://your-backend.onrender.com
   ```

### Frontend → Vercel

1. Import your repository to Vercel
2. Set the root directory to `frontend`
3. Add environment variables:
   ```
   NEXT_PUBLIC_API_BASE=https://your-backend.onrender.com
   NEXT_PUBLIC_FRONTEND_BASE=https://your-frontend.vercel.app
   ```

### Database → MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Allow network access from `0.0.0.0/0`
4. Copy your connection string and add it to your backend environment

## 🔒 CORS Configuration

Update `allowedOrigins` in your backend to include your frontend URL:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app"
];
```

