#!/bin/bash

PROJECT_NAME := app
TEMPLATE := --typescript
IMAGE_NAME := fran/nextjs:latest
USER_IDS := $(shell id -u):$(shell id -g)
CONTAINER_NAME := nextapp

#https://github.com/mswag/docker-ionic/blob/develop/Dockerfile

image:
	docker-compose build

create-project:
	docker run --rm -v $(CURDIR):/app ${IMAGE_NAME} npx create-next-app@latest ${PROJECT_NAME}

sh:
	docker-compose exec ${CONTAINER_NAME} sh

start:
	docker-compose up

startd:
	docker-compose up -d

stop:
	docker-compose stop

yarn-first-install:
	docker run --rm --user="${USER_IDS}" -v $(PWD)/app:/app ${IMAGE_NAME} yarn install

# build:
# 	docker-compose exec ionicapp ionic build

# help:
# 	docker run --rm -v $(PWD):/app ${IMAGE_NAME} ionic help serve

# yarn-first-install:
# 	docker run --rm -v $(PWD)/app:/app ${IMAGE_NAME} yarn install

# yarn-install:
# 	docker-compose exec ionicapp yarn install

# yarn-build:
# 	docker run --rm -v $(PWD)/app:/app ${IMAGE_NAME} yarn build

# yarn-test:
# 	docker run --rm -v $(PWD)/app:/app ${IMAGE_NAME} yarn test --watchAll=false
