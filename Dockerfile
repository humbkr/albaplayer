## Client build phase
FROM node:14 as build_client

ADD client /app
WORKDIR /app

RUN yarn install
RUN yarn build

## Server build phase
FROM golang:1.16 AS build_server

ADD server /app
WORKDIR /app

# Copy generated client code build from previous step
COPY --from=build_client /app/build/ /app/web/

# Install pkger command line tools.
RUN go get github.com/markbates/pkger/cmd/pkger

# Install dependencies
RUN go mod download

# Package static assets
RUN pkger

# Build app
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -a -o /generated/alba .

# Copy config files
RUN cp /app/build/prod.alba.yml /generated/alba.yml
RUN chmod +x /generated/alba

## Final image
FROM scratch

COPY --from=build_server /generated/ /app/

ENTRYPOINT cd /app && ./alba serve
EXPOSE 8888
