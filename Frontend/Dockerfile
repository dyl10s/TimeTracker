FROM node:12 as build
WORKDIR /app
COPY package.json package.json
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN npm run build -- --prod

FROM nginx:1.19.6
COPY --from=build /app/dist/TimeTracker/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf