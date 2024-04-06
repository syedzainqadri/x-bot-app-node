# Step 1: Choose the base Image
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install Prisma CLI as a development dependency
# Install all dependencies including development ones
RUN npm install

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Copy Prisma schema file
# Assumes your Prisma schema is in the prisma/ directory
COPY prisma ./prisma

# Step 7: Generate Prisma Client
RUN npx prisma generate

# Step 8: Run Prisma Migrations (Optional)
# Only use this if your database is accessible at build time
# RUN npx prisma migrate deploy

# Step 9: Expose the port your app runs on
EXPOSE 8080

# Step 10: Define the command to run your app
CMD ["node", "server.js"]
