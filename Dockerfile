FROM node:18
RUN npm install -g typescript
WORKDIR /app
COPY package.json .

RUN yarn install --frozen-lockfile
COPY . /
EXPOSE 5056