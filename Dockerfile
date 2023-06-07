# Base image
FROM node:18
# Create app directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock
COPY package*.json ./
COPY yarn*.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY  . .

# Build app
RUN yarn build

# Expose port
EXPOSE 8080

# Run app
CMD ["node", "dist/src/main.js"]
