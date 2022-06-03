## Client build phase
FROM node:16 as build_client

ADD client /app
WORKDIR /app

RUN yarn install
RUN yarn build

## Server build phase
FROM golang:1.18 AS build_server

# Install GCC for target architecture.
RUN dpkg --add-architecture amd64 \
    && apt-get update \
    && apt-get install -y --no-install-recommends gcc-x86-64-linux-gnu libc6-dev-amd64-cross

ADD server /app
WORKDIR /app

# Copy generated client code build from previous step
COPY --from=build_client /app/build/ /app/web/

# Install pkger command line tools.
RUN go get github.com/markbates/pkger/cmd/pkger
RUN go install github.com/markbates/pkger/cmd/pkger

# Install dependencies
RUN go mod download

# Package static assets
RUN pkger

# Build app
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-linux-gnu-gcc go build -a -o /generated/alba .

# Copy config files
RUN cp /app/build/prod.alba.yml /generated/alba.yml

## Final image
FROM frolvlad/alpine-glibc
RUN apk add --no-cache \
    ca-certificates

COPY --from=build_server /generated/ /app/
RUN chmod +x /app/alba

ENTRYPOINT cd /app && ./alba serve
EXPOSE 8888
