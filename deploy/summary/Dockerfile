FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./mime.types /etc/nginx/mime.types
COPY ./dist/apps/remotes/summary /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
