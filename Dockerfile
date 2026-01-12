# Fichier Dockerfile pour la production
FROM node:20-alpine AS base

# Installation des dépendances seulement si nécessaire
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installation des dépendances basées sur le gestionnaire de paquets préféré
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild du code source seulement si nécessaire
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run start:build

# Image de production, copie de tous les fichiers et exécution de next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Installation de Docker et Docker Compose
RUN apk add --no-cache docker docker-compose

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copier le docker-compose.yml
COPY docker-compose.yml ./

USER nextjs

# Script pour démarrer les services Docker et attendre qu'ils soient healthy
CMD docker-compose up -d && \
    while ! docker-compose ps | grep -q "healthy"; do sleep 2; done && \
    npm run start:prod
