# /frontend/Dockerfile

# --- STAGE 1: Build the React/Vite app ---
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This creates the optimized production build in the /dist folder
RUN npm run build 

# --- STAGE 2: Serve with NGINX ---
FROM nginx:alpine
# Copy the compiled files from Stage 1 into NGINX's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (Standard HTTP port)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]