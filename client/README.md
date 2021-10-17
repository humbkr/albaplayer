# Alba player (client)
> Minimalistic audio library web player.

## About
This folder is only for the client part of the application.  
It can be used independently of the server part to access an already running Albaplayer server
instance, or any server that matches the required graphql API.

## Developement

**Tech stack:**
- React
- Apollo GraphQL
- Redux toolkit

**Dependencies:**   

This project uses yarn to manage its dependencies.

**Code organization:**   

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)
and thus follows its basic code structure.

**Code style:**   

This project uses [AirBNB javascript codestyle](https://github.com/airbnb/javascript) plus
some tweaks.

Jetbrains IDE setup: [https://www.themarketingtechnologist.co/eslint-with-airbnb-javascript-style-guide-in-webstorm/](https://www.themarketingtechnologist.co/eslint-with-airbnb-javascript-style-guide-in-webstorm/)

### Quick start
```bash
cp .env .env.development
# Here Change .env.development values

yarn install
yarn start
```

#### Jetbrains IDE setup
This project uses absolute imports. To avoid Jetbrains IDEs to complain:
- Right click on the /src folder > Mark directory as > Resources root
- Menu > Settings > Editor > Code style > Javascript > Check "Use paths relative to the project, resource, or sources root"

#### Docker

A docker image is provided for developement purposes, if you don't want to install the dev stack on your machine.   
(Note that you will unfortunately still have to install npm and other stuff if you want IDEs like JetBrains' Webstorm 
to work properly.)

##### Prerequisites
- docker set up on your machine
- ``make`` command available (windows users)

##### Set up
From the project root, cd into /docker then run ``make up``  
Once the container is mounted, log into it by running ``make ssh``
From inside the container, install the dependencies by running ```yarn install``` from the project's root

##### Use
- To start the application in watch mode, from inside the container run ``yarn start`` and wait for the process to finish.
- To access the application in a browser, get the container port from docker: ``docker ps`` (image name is "alba_client"), then go to your browser and
access localhost:<port>.
- To change the backend API url, see comments in the /.env file.
- To run eslint on src/ run ``yarn lint``

#### Known issues
- Warning about findDOMNode in the console: see https://github.com/bvaughn/react-virtualized/issues/1353

## TODO
- [ ] Write some tests for UI (redux tests done)
- [ ] Improve perfs for library loading
