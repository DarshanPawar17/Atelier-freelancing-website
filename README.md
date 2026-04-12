# Freelance Marketplace (Local Setup)

This project contains:

- `client` (Next.js frontend)
- `server` (Express + Prisma + MongoDB backend)

## Prerequisites

- Node.js 20+ (Node 22 also works)
- npm 10+
- MongoDB Atlas database URL
- Cloudinary account (for image uploads)
- Stripe keys (for payment flow)

## One-time setup

1. Install dependencies:

```bash
npm install
npm install --prefix server --legacy-peer-deps
npm install --prefix client
```

2. Configure backend env in `server/.env`:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`
- `STRIPE_SECRET_KEY`

3. Configure frontend env in `client/.env.local`:

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`

## Run locally

From project root:

```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

## Optional: clear all existing app data

```bash
npm run seed --prefix server
```

This reset script removes existing users, gigs, orders, messages, and reviews so you can start fresh with your own data.
