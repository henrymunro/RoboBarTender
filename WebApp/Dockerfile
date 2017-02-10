FROM node:boron


# Create app directory
RUN mkdir -p /var/src/app
WORKDIR /var/src/app


# Install app dependencies
COPY package.json /var/src/app/
RUN npm install --production

# Bundle app source
COPY . /var/src/app

EXPOSE 3000
CMD [ "npm", "start" ]