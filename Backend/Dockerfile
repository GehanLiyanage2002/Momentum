# /auth-service/Dockerfile

# 1. Use a lightweight Node.js base image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy only package.json first (this caches dependencies to speed up future builds)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your backend code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 5000

# 7. Start the server
CMD ["node", "server.js"]