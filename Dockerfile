FROM node:12.12.0-alpine

COPY . .
RUN apk --no-cache add curl
RUN chmod +x wait-for-db.sh
RUN npm install
# copy over the rest of the source code
EXPOSE 3000
CMD ["./wait-for-db.sh", "node", "index.js" ] # run the app in production