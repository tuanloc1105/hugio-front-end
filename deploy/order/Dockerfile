FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./mime.types /etc/nginx/mime.types
COPY ./dist/apps/remotes/order /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
