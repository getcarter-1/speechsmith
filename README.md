This is a Next.js app for Speechsmith.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker Compose

Local Compose runs the Next.js app, the BullMQ worker, Postgres, and Redis. The project directory is bind-mounted into the app and worker containers, so code changes on the host are visible immediately. Next.js handles app hot reload; the worker uses nodemon.

1. Create your local environment file:

```bash
cp .env.example .env.local
```

2. Fill in the non-local secrets in `.env.local`. Compose overrides these local service values automatically:

```bash
DATABASE_URL=postgresql://speechsmith:speechsmith@postgres:5432/speechsmith
REDIS_URL=redis://redis:6379
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

3. Build and start the development stack:

```bash
docker compose up --build
```

4. Prepare the local database schema in another terminal:

```bash
docker compose run --rm app npx prisma db push
```

Open [http://localhost:3000](http://localhost:3000). The app is served from the mounted working tree, so editing files locally should trigger a reload. If dependencies change, rebuild the images:

```bash
docker compose build --no-cache app worker
```

If a host port is already in use, override it when starting Compose:

```powershell
$env:APP_PORT=3001; docker compose up --build
```

```bash
APP_PORT=3001 docker compose up --build
```

Useful commands:

```bash
docker compose logs -f app
docker compose logs -f worker
docker compose down
docker compose down -v
```

`docker compose down -v` also deletes the local Postgres and Redis volumes.

## Production Compose

The production override builds the `runner` Docker target and does not mount the source directory:

```bash
docker compose -f docker-compose.prod.yml up --build
```

For a live deployment, provide production-grade `.env.local` values, put a reverse proxy or load balancer in front of the app, and keep the same `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` across app instances when running more than one container.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
