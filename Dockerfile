FROM node:16.2.0

COPY . .

RUN npm config set update-notifier false
RUN npm install

CMD ["npm", "run", "--silent", "default"]
