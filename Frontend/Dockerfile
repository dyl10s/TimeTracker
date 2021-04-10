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
RUN apt-get update
RUN apt install python3 -y python3-venv -y libaugeas0 -y
RUN python3 -m venv /opt/certbot/
RUN /opt/certbot/bin/pip install --upgrade pip
RUN /opt/certbot/bin/pip install certbot certbot-nginx
RUN ln -s /opt/certbot/bin/certbot /usr/bin/certbot