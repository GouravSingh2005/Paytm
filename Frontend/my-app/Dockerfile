# Use Node 20 for Vite app
FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

RUN npm install

COPY . .

# Build Vite app
RUN npm run build

# Install serve to serve production build
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start app
CMD ["serve", "-s", "dist", "-l", "3000"]
