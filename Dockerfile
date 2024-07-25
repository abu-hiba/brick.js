FROM node:20-alpine as builder

RUN npm i -g pnpm
RUN apk add --no-cache libc6-compat
RUN apk update

ENV PNPM_HOME=/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app
COPY . .
RUN pnpm i --force
RUN pnpm test
RUN pnpm build

FROM nginx:alpine as server

COPY --from=builder /app/dist/assets /usr/share/nginx/html/assets
COPY --from=builder /app/dist/index.html /usr/share/nginx/html