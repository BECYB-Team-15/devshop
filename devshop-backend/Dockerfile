# --- ETAP 1: Budowanie (Builder) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build 

# --- ETAP 2: Obraz produkcyjny ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./

# W Fazie I celowo instalujemy wszystkie paczki (w tym devDependencies), 
# aby zagwarantować działanie skryptu npm run db:init
RUN npm ci --legacy-peer-deps

COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000

CMD ["node", "dist/server.js"]