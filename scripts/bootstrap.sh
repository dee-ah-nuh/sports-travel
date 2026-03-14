#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Sports Travel – Bootstrap"
echo "=============================="

# 1. Check required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js >= 20 required"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm required: npm install -g pnpm"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker not found — skipping DB/Redis setup"; SKIP_DOCKER=true; }

# 2. Copy env file
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example — add your API keys when ready"
fi

# 3. Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# 4. Start Docker services
if [ "${SKIP_DOCKER:-false}" != "true" ]; then
  echo "🐳 Starting Postgres + Redis..."
  docker compose -f infra/docker-compose.yml up -d
  echo "   Waiting for Postgres to be ready..."
  sleep 3
fi

# 5. Generate Prisma client
echo "🗄  Generating Prisma client..."
pnpm db:generate

# 6. Run migrations (skip if no DB)
if [ "${SKIP_DOCKER:-false}" != "true" ]; then
  echo "🗄  Running migrations..."
  pnpm db:migrate || pnpm --filter @sports-travel/api exec prisma migrate dev --name init
  echo "🌱 Seeding database..."
  pnpm db:seed || true
fi

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Start dev servers:"
echo "  pnpm dev              # starts API + web together"
echo "  pnpm --filter @sports-travel/api dev      # API only (port 3001)"
echo "  pnpm --filter @sports-travel/web dev      # Web only (port 5173)"
echo "  pnpm --filter @sports-travel/mobile dev   # Expo (scan QR with Expo Go)"
echo ""
echo "Health check: http://localhost:3001/health"
echo "Web app:      http://localhost:5173"
