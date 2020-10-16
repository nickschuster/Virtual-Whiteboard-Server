FROM node:10

# Define working directory.
WORKDIR /usr/src/app

# Get dependencies.
COPY package*.json ./

# Build/Install deps.
RUN npm install

# Bundle source code.
COPY . .

# App needs port 3000 open to function.
EXPOSE 3000

# Start server.
CMD ["nodejs", "index.js"]