FROM node:22

WORKDIR /app
COPY package.json package-lock.json ./
COPY api/ /app/api

WORKDIR /app/api
RUN npm ci --audit false --fund false
RUN npm run build

CMD ["npm", "start"]
