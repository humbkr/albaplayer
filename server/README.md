# Alba Player (server)
> Minimalistic audio library web player.

## About
This folder is only for the server part of the application.  
It can be used independently of the client part to serve an API for any client.

## Developement

**Tech stack:**
- Golang
- GraphQL API
- SQLite

**Dependencies:**   

This project uses go modules.

**Code organization:**   

This project mostly follows [https://github.com/golang-standards/project-layout](https://github.com/golang-standards/project-layout) for its repository structure.   
In terms of go packages structure, it follows the concepts of Clean Architecture: 
[http://manuel.kiessling.net/2012/09/28/applying-the-clean-architecture-to-go-applications/](http://manuel.kiessling.net/2012/09/28/applying-the-clean-architecture-to-go-applications/)

**GraphQL**
This project uses gqlgen.

To generate the new code after a schema update, run
```shell
go run github.com/99designs/gqlgen generate
```

#### Docker

A docker image is provided for development purposes, if you don't want to install the dev stack on your machine.   
(Note that you will unfortunately still have to install Golang if you want IDEs like JetBrains' Goland to work 
properly.)

##### Prerequisites
- docker set up on your machine
- ``make`` command available (windows users)

##### Set up
From the project root, cd into /docker then run ``make up``  
Once the container is mounted, log into it by running ``make ssh``
From inside the container, install the dependencies by running ```go dep ensure``` from the project's root

##### Use
- To start the application in watch mode, from inside the container run ``fresh`` and wait for the process to finish.
- To access the application in a browser, get the container port from docker: ``docker ps`` (image name is "alba_server"), then go to your browser and
access localhost:<port>.

Available endpoints:
- /graphql : graphql server
- /graphiql : graphiql client for testing (when dev mode is enabled only, see alba.yml)

Note that you need to build the [client app](https://github.com/humbkr/albaplayer-client) separately to access the user interface. By running only the server part
in this repository you will only have access to the two endpoints mentionned earlier.   

#### Include the client app in the build
To build the client app, follow the readme at [https://github.com/humbkr/albaplayer-client](https://github.com/humbkr/albaplayer-client).   
Once the client prod build is generated, dump its contents in the /web directory of this project.

Alternatively you can also get the end-user build on the [official website](https://albaplayer.com) and copy-paste the web directory contents into /web.

#### Test
From the project root run ``go test ./...``
