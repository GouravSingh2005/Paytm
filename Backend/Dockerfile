FROM node:18

# Working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Expose port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
