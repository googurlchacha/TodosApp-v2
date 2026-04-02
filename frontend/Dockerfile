FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_HOST=backend
# Allow ${BACKEND_HOST} in the nginx template (required on nginx 1.19+ images).
ENV NGINX_ENVSUBST_TEMPLATE_VARS_LIST=BACKEND_HOST
EXPOSE 80
