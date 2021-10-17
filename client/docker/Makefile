MAIN_CONTAINER=$(shell docker-compose ps -q client)
MAIN_CONTAINER_PORTS = $(shell docker ps -f id=$(GO_CONTAINER) --format "{{.Ports}}")

.PHONY: up down build rebuild ssh logs get-web

DOCKER_COMPOSE_CMD=docker-compose -f docker-compose.yml

up:
	$(DOCKER_COMPOSE_CMD) up -d

down:
	$(DOCKER_COMPOSE_CMD) stop

stop:
	$(DOCKER_COMPOSE_CMD) stop

build:
	$(DOCKER_COMPOSE_CMD) build

rebuild:
	docker-compose rm -f && $(DOCKER_COMPOSE_CMD) up --build

ssh:
	docker exec -it "$(MAIN_CONTAINER)" /bin/bash

logs:
	$(DOCKER_COMPOSE_CMD) logs

get-web:
	echo "\r\n${MAIN_CONTAINER_PORTS}"|sed 's@0.0.0.0@http://localhost@g'|sed 's@443/tcp, @@g'| sed 's@->80/tcp@@g'
