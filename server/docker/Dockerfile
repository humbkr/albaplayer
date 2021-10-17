FROM dockercore/golang-cross:latest


RUN apt-get update

# Vim
RUN apt-get install -y vim
RUN apt-get install -y zip

# Create aliases
RUN echo 'alias ll="ls -lah"' >> ~/.bashrc
RUN echo 'alias vi="vim"' >> ~/.bashrc

# Create working dir
RUN mkdir /app

# Set go bin which doesn't appear to be set already
ENV GOBIN /go/bin

# Install live refresh server
RUN go get github.com/pilu/fresh

CMD []
