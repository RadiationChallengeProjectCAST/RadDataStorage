FROM node:15.5.0-alpine

COPY . .
RUN apk --no-cache add curl
RUN sed -i 's/\r$//' wait-for-db.sh  && chmod +x wait-for-db.sh
RUN npm install
# copy over the rest of the source code
EXPOSE 3000
CMD ["./wait-for-db.sh", "node", "index.js" ] # run the app in production
