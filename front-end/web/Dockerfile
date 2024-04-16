# Use a Node.js image as the base
FROM node:14

# Create a working directory inside the container
WORKDIR /app-web

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else from the application into the working directory
COPY . .

# Expose port 8081 (the same as in your .env file)
EXPOSE 8081

# Create a symbolic link to serve the client.apk file
RUN ln -s /app/client/client.apk public/client.apk

# Command to start the application
CMD ["npm", "start"]
