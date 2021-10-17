# Build phase
FROM golang:1.15 AS build

ADD . /app
WORKDIR /app

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

# Final image
FROM frolvlad/alpine-glibc
RUN apk add --no-cache \ 
  ca-certificates

COPY --from=build /generated/ /app/
RUN chmod +x /app/alba

ENTRYPOINT cd /app && ./alba serve
EXPOSE 8888

