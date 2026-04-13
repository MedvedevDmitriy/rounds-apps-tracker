FROM node:20-alpine

WORKDIR /app

COPY . .

RUN corepack enable
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/web

RUN pnpm build

RUN pnpm add -g serve

RUN pnpm prisma migrate deploy

CMD ["serve", "-s", "dist", "-l", "3000"]