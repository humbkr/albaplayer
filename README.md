# Alba Player
> Minimalistic audio library web player.

## About
Alba player is an audio library web-based player. I was tired of all the desktop audio players 
available on linux and macos with questionable user interfaces and/or library management, 
and I wanted to learn Golang and React, so I decided to build my own.   
This player is by purpose limited in terms of functionalities, as its main goal is to just 
play music. It is focused on users that like playing entire albums more than random songs from their
library.  

Although fully operational, this project is still under heavy development, as it is a pet project
that I use to improve my coding skills. Contributions and remarks on the existing code are welcomed!

WEBSITE (with demo): [https://albaplayer.com](https://albaplayer.com)

### Basic features

- HTML5 audio player with basic controls (play / pause / previous / next / timeline progress / 
volume / random / repeat)
- Main playing queue à la Winamp (playback doesn't magically change to the songs you are currently 
browsing in the library)
- Library browser with Artists / Albums / Tracks views that actually manage compilations properly
- Now playing screen with current song info and buttons to google lyrics and guitar tabs
- Client / server app, so can be installed on a server to access and play a music library remotely
- Can manage huge libraries (tested with 30000+ songs)

**Note:** this player is not adapted for mobile or tablet use. A good mobile UI would be completely 
different from a desktop one, so I focused on the desktop first, as there are already a lot of good 
mobile players apps.

## Installation

Grab the archive corresponding to your system on the [official website](https://albaplayer.com), 
unzip it somewhere, tinker with the alba.yml configuration file and run the alba executable from the 
command line.

## Developement

**Tech stack:**
- React for the client
- Golang for the server
- GraphQL
- SQLite

### Quick start
#### Prerequisites
You need to have
- [node](https://nodejs.org/)
- [yarn 1](https://classic.yarnpkg.com/)
- [Go](https://golang.org/)

Installed and set up on your machine.

#### Setup project

```shell
## Install git hooks utilities
yarn install

## Setup client
cd client

# Setup environment variables
cp .env .env.development
# (here Change .env.development values)

# Install dependencies
yarn install

## Setup server
cd ../server

# Configure the server options
cp alba.yml.example alba.yml
# (here Change alba.yml)

# Install dependencies
go mod download
```

#### Start server
You will have to install [Air](https://github.com/cosmtrek/air) to have hot reloading enabled.
```shell
curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b $(go env GOPATH)/bin
```
Note: don't forget to add GOPATH/bin to your PATH

Then
```shell
cd server
air
```

#### Start client
```shell
cd client
yarn start
```

#### Notes

If you only want to work on the client you can set  
```dotenv
REACT_APP_BACKEND_URL=https://demo.albaplayer.com
```
in /client/.env.development instead of having to run the server locally

## Docker
To use the docker container, you will need to mount four volumes:
```
- ./volumes/alba.yml:/app/alba.yml
- ./volumes/alba.db:/app/alba.db
- ./volumes/covers:/app/covers
- ./volumes/library:/app/library
```
And to make sure the alba.yml and alba.db files exist on the host before starting the container
so docker mounts them correctly and not as directories.
