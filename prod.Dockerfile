FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --production --frozen-lockfile

COPY --from=builder /app/dist /app/dist

# Comando de inicio
CMD ["npm", "start"]