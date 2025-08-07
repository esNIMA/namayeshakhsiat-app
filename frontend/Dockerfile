# Frontend Dockerfile - Production build
FROM node:18-alpine as builder

WORKDIR /app

# کپی package files
COPY package*.json ./

# نصب همه dependencies (dev هم لازمه برای build)
RUN npm ci

# تنظیم environment variables برای build
ARG REACT_APP_API_URL=https://namayeshakhsiat.xyz/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# کپی کد و build
COPY . .
RUN npm run build

# Production serve
FROM node:18-alpine

WORKDIR /app

# نصب serve برای static files
RUN npm install -g serve

# کپی build شده
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# اجرای static server با تنظیمات SPA
CMD ["serve", "-s", "dist", "-l", "3000", "--single"]