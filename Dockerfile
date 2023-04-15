###### build ######
# Image
From nginx:stable@sha256:362b3204bf9c7252f41df91924b72f311a93c108e5bcb806854715c0efffd5f7 AS build

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Setup node.js
Run curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y \
        build-essential \
        nodejs \
    && rm -fr /var/lib/apt/list/*

# Set wroking directory
WORKDIR /usr/local/src/fragment-ui

# Copy package.json and package-lock.json
COPY package*.json .

# Copy source code
COPY ./src ./src

# Copy .env
COPY .env .env

# Install dependencies
RUN npm ci

# Copy built site
Run npm run build 

###### production ######
From nginx:stable@sha256:362b3204bf9c7252f41df91924b72f311a93c108e5bcb806854715c0efffd5f7 AS production

# Production environment
ENV NODE_ENV=production

# Set wroking directory
WORKDIR /usr/local/src/fragment-ui

# Copy built site to where nginx wants them (static sites)
COPY --chown=nobody:nobody --from=build \ 
    /usr/local/src/fragment-ui/dist/ /usr/share/nginx/html/

# Expose port 80 that nginx uses
EXPOSE 80