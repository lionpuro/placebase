FROM node:22 AS base

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY api/ /app/api
RUN npm ci --audit false --fund false
WORKDIR /app/api
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/api/data ./api/data
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/package.json ./api/package.json
WORKDIR /app/api

CMD ["npm", "start"]
