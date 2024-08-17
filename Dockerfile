FROM node:18.19.0
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
RUN npx prisma generate
CMD ["npm", "run", "dev"]
