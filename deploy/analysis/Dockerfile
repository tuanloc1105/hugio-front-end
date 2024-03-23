FROM nginx

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./mime.types /etc/nginx/mime.types
COPY ./dist/apps/remotes/analysis /build

ENTRYPOINT ["nginx", "-g", "daemon off;"]
