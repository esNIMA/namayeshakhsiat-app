# Frontend Dockerfile - Production build
FROM node:20-alpine as builder
WORKDIR /app

# کپی package files
COPY package*.json ./

# نصب همه dependencies (هم dev هم production)
RUN npm ci

# کپی کد و build
COPY . .
RUN npm run build

# Production serve
FROM node:20-alpine
WORKDIR /app

# نصب serve برای static files
RUN npm install -g serve

# کپی build شده
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# اجرای static server
CMD ["serve", "-s", "dist", "-l", "3000"]
