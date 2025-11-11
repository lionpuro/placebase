FROM node:22

WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY api/ /app/api

WORKDIR /app
RUN npm ci --audit false --fund false

WORKDIR /app/api
RUN npm run build

CMD ["npm", "start"]
