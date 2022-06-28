# Alba Player (server)
> Minimalistic audio library web player.

## About
This folder is only for the server part of the application.  
It can be used independently of the client part to serve an API for any client.

## Development

### Quickstart
```shell
# Edit config file to your liking
vi alba.yml

# Run project in watch mode
air
```

##### Use

Available endpoints:
- /graphql : graphql server
- /graphiql : graphiql client for testing (when dev mode is enabled only, see alba.yml)

### Tech stack
- Go
- gqlgen
- SQLite

### GraphQL
This project uses [gqlgen](https://github.com/99designs/gqlgen).

To generate the new code after a schema update, run
```shell
go run github.com/99designs/gqlgen generate
```

### Tests
From the project root run ``go test ./...``
