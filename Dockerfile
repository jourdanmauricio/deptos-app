# Dockerfile para Next.js 15 con Prisma y LibSQL en Coolify
# Multi-stage build para optimizar tamaño de imagen
# Usa Debian Slim por compatibilidad con librerías nativas de LibSQL

# Stage 1: Dependencias
FROM node:20-slim AS deps

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependencias (incluye generación de Prisma por postinstall)
RUN npm ci

# Stage 2: Builder
FROM node:20-slim AS builder

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar dependencias instaladas del stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno necesarias para el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar Prisma Client explícitamente primero
RUN npx prisma generate

# Build de Next.js
RUN npx next build

# Stage 3: Runner (Imagen final de producción)
FROM node:20-slim AS runner

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario no-root para seguridad
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Copiar archivos necesarios para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copiar archivos del build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar Prisma schema y cliente generado
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/lib/generated/prisma ./lib/generated/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check para Coolify
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

CMD ["node", "server.js"]

