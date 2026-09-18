# Use official Node runtime as a parent image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
