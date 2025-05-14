# Use a lightweight, secure Node.js image
FROM node:18.19.1-slim

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (for caching npm install)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your backend source code
COPY . .

COPY .env .env

# Expose the backend port (change if different)
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
