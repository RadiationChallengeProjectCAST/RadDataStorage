FROM node:12.12.0-alpine

WORKDIR /home/app/backend

COPY . .
RUN apk --no-cache add curl
RUN npm install
# copy over the rest of the source code
EXPOSE 3000

CMD [ "node", "index.js" ] # run the app in production
