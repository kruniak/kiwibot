# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Install Prisma globally
RUN npm install -g prisma

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN prisma generate

# Apply database migrations
#RUN prisma db push

# Copy .env file
COPY .env ./

# Define the command to run your application
CMD ["node", "src/index.js"]
