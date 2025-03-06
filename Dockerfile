FROM nginx

WORKDIR /usr/share/nginx/html/
USER root

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist  /usr/share/nginx/html/

COPY ./certs/fullchain.pem /etc/nginx/certs/fullchain.pem

COPY ./certs/privkey.pem /etc/nginx/certs/privkey.pem

EXPOSE 8080 443

CMD ["nginx", "-g", "daemon off;"]

