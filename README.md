# QuickBlog

A lightweight full-stack blogging application built with a Vite + React frontend and a Node.js + Express backend. The project provides basic blogging features, an admin area, image uploads via ImageKit, and optional AI content generation via Gemini.

## Repository structure

- client/ — Vite + React frontend
- server/ — Express backend with MongoDB
- StartProject.sh — helper script

## Features

- Create, read, update, delete blog posts
- Admin authentication (JWT)
- Image uploads using ImageKit
- AI-assisted content generation (Gemini)
- Simple admin dashboard and blog listing UI

## Tech stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JSON Web Tokens (JWT)
- Image hosting: ImageKit
- Optional AI: Google Gemini via @google/genai

## Prerequisites

- Node.js 18+ and npm
- A MongoDB instance (URI)
- ImageKit account (public/private keys + url endpoint) if using image uploads
- Gemini API key if using AI features

## Environment variables (create a `.env` file in `server/`)

- `MONGODB_URI` — MongoDB connection URI (without the `/quickblog` suffix)
- `JWT_SECRET` — Secret used to sign/verify JWTs
- `IMAGEKIT_PUBLIC_KEY` — ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` — ImageKit URL endpoint
- `GEMINI_API_KEY` — API key for Google Gemini (optional)
- `PORT` — (optional) server port, defaults to `3000`

## Setup & Development

Open two terminals (frontend and backend):

Frontend

```bash
cd client
npm install
npm run dev
```

Backend

```bash
cd server
npm install
npm run server   # uses nodemon for hot reload
# or
npm start        # runs node server.js
```

Visit the frontend URL shown by Vite (typically `http://localhost:5173`) and the API at `http://localhost:3000` (or your `PORT`).

## Deployment

Both `client` and `server` include `vercel.json` files for easy deployment to Vercel. Configure environment variables in your hosting provider. For production, build the client using `npm run build` in the `client/` folder.

## Notes

- The frontend calls the backend routes under `/api/*`. Update any base URLs in `client/src` if your API is hosted under a different origin or path.
- `server/configs/db.js` appends `/quickblog` to the `MONGODB_URI`. Provide the base MongoDB URI accordingly.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

## License

MIT
