FROM debian:stretch

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get dist-upgrade -y && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install  -y -q --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    lsb-release \
    build-essential \
    apt-utils \
    curl \
    gnupg2 \
    vim \
    git \
    zlib1g \
    zlib1g-dev

# Create aliases
RUN echo 'alias ll="ls -lah"' >> ~/.bashrc
RUN echo 'alias vi="vim"' >> ~/.bashrc

# Nodejs via NVM
ENV NVM_DIR /usr/local/nvm
RUN curl --silent -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install --lts \
    && nvm alias default lts/* \
    && nvm use default

# Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt remove -y cmdtest \
    && apt update \
    && apt-get install --no-install-recommends -y yarn

# Clean apt-get cache
RUN apt-get clean all -y && apt-get autoclean -y

RUN mkdir /app
