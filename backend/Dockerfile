# Stage 1: Build the application with dependencies
FROM node:16 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY pametni-paketnik/package*.json ./pametni-paketnik/

# Change the working directory to pametni-paketnik
WORKDIR /app/pametni-paketnik

# Install dependencies with legacy peer deps flag
RUN npm install --legacy-peer-deps

# Rebuild bcrypt module within the Docker container
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code to the container
COPY pametni-paketnik/ .

# Ensure http-errors is installed
RUN npm install http-errors --legacy-peer-deps

# Stage 2: Create the final runtime image
FROM node:16

# Set the working directory in the container
WORKDIR /app/pametni-paketnik

# Copy the built node_modules and app code from the builder stage
COPY --from=builder /app/pametni-paketnik /app/pametni-paketnik

# Expose the port the app runs on
EXPOSE 3001

# Command to run the application
CMD ["node", "bin/www"]
