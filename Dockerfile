ARG NODE_VERSION=20-alpine
ARG NGINX_VERSION=1.27-alpine

FROM node:${NODE_VERSION} AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:${NGINX_VERSION} AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf \
  && printf '%s\n' \
    'server {' \
    '  listen 80;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '' \
    '  location / {' \
    '    try_files $uri $uri/ /index.html;' \
    '  }' \
    '' \
    '  location /assets/ {' \
    '    expires 1y;' \
    '    add_header Cache-Control "public, immutable";' \
    '  }' \
    '}' \
    > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
