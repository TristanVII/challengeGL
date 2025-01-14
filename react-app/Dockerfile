FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables if needed
ENV NODE_ENV=production

# Build the app
RUN npm run build || (echo "Build failed" && exit 1)

# Install serve to run the built app
RUN npm install -g serve

EXPOSE 5173

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"] 