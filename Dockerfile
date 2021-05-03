FROM node:alpine
# Create app directory
WORKDIR /usr/src/app

# Install App dependencies
# only copying the package.json and packge-lock.json files to use cached Docker layers
COPY package*.json ./

RUN npm install

# bundle app source code inside Docker image
COPY . .

EXPOSE 3000

RUN npm run build

CMD npx serve -s build -l 3000