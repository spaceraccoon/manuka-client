FROM node:alpine AS build

# Extend PATH
ENV PATH=$PATH:/node_modules/.bin

# Set working directory
WORKDIR /manuka-client

# Copy project files for build
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install --silent

# Add application
COPY . .

# Build application
RUN npm run build

# Start nginx
FROM nginx:alpine

# Copy build to static folder
COPY --from=build /manuka-client/build /var/www/html

# Add htpasswd (workaround until compose has proper build secrets https://pythonspeed.com/articles/build-secrets-docker-compose/)
RUN apk add --no-cache --update apache2-utils
ARG NGINX_USERNAME
ARG NGINX_PASSWORD
RUN htpasswd -c -b /etc/nginx/.htpasswd $NGINX_USERNAME $NGINX_PASSWORD

CMD ["nginx", "-g", "daemon off;"]
