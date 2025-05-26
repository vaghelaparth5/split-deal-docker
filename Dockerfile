# Step 1: Use Node.js official image
FROM node:18-alpine
 
# Step 2: Set working directory inside container
WORKDIR /app
 
# Step 3: Copy package.json and package-lock.json (if exists)
COPY package*.json ./
 
# Step 4: Install all node dependencies
RUN npm install
 
# Step 5: Copy rest of your project files
COPY . .
 
# Step 6: Expose port (same as your server's port)
EXPOSE 3000
 
# Step 7: Start the server
CMD ["npm", "start"]