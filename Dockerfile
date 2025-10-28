## Client build phase
FROM node:22 AS build_client

ADD client /app
WORKDIR /app

RUN yarn install
RUN yarn build

## Server build phase
FROM golang:1.23 AS build_server

# Install GCC for target architecture (required for sqlite).
RUN dpkg --add-architecture amd64 \
    && apt-get update \
    && apt-get install -y --no-install-recommends gcc-x86-64-linux-gnu libc6-dev-amd64-cross

ADD server /app
WORKDIR /app

# Copy generated client code build from previous step
COPY --from=build_client /app/dist/ /app/web/

# Install pkger command line tools.
RUN go get github.com/markbates/pkger/cmd/pkger
RUN go install github.com/markbates/pkger/cmd/pkger

# Install dependencies
RUN go mod download

# Package static assets
# TODO: Replace pkger with go internal embed package.
RUN pkger

# Build app
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 CC=x86_64-linux-gnu-gcc go build -a -o /generated/alba .

# Copy config files
RUN cp /app/build/prod.alba.yml /generated/alba.yml
RUN cp /app/build/version.md /generated/version.md

## Final image
FROM debian

# Copy generated files from previous steps
COPY --from=build_server /generated/ /app/

# Make binary executable
RUN chmod +x /app/alba

ENTRYPOINT cd /app && ./alba serve

EXPOSE 8888
