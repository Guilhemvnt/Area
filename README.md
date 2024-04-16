# Readme AREA project

## Introduction

The goal of this project is to explore the chosen software platform through the creation of a business application. To achieve this, we must implement a software suite that functions similarly to IFTTT and/or Zapier. This software suite will be divided into three parts:

* An application server to implement all the features listed below (see Features)
* A web client to use the application from your browser by querying the application server
* A mobile client to use the application from your phone by querying the application server

## Architecture

* A front-end web is built in React and TypeScript by Erwann LAPLANTE.
* A front-end mobile is built in Flutter and Draft by Hugo FLEURY.
* A REST API in Node.js is created by Guilhem VINET and Oscar DESCHAMPS.

## Workflow

For each feature, work on its branch.
Once the feature is complete, merge it into the parent branch (front or back).

When a general merge is needed, merge into dev.

When dev is stable, merge into main.

## Installation and Execution

### Installation

Be sure to have an internet connection

For ubuntu installation, follow this [Docker Docs](https://docs.docker.com/engine/install/ubuntu/) and this [Docker Docs](https://docs.docker.com/desktop/install/ubuntu/)

### Execution

#### Dependencies

```bash
./init_docker.sh
```

#### Construction

```bash
sudo docker-compose build
```

In some versions of Docker, you may need to use `docker compose` instead of `docker-compose`.

#### Launch

```bash
sudo docker-compose up
```

In some versions of Docker, you may need to use `docker compose` instead of `docker-compose`.

## Find results

You can find:

* The server on your browser on [localhost:8080](http://localhost:8080)
* All server information on your browser on [localhost:8082about.json](http://$ipAddress:$port/about.json)
* The web client on your browser on [localhost:8081]("localhost:8081")
* AN android version of the mobile client on your browser on [localhost:8081/client.apk](http://localhost:8081/client.apk)

## Ducumentation

You can find all documentation in the "Documentation" folder.

## Contact

Erwann LAPLANTE: <erwann.laplante@epitech.eu>  
Oscar DESCHAMPS: <oscar.deschamps@epitech.eu>  
Guilhem VINET: <guilhem.vinet@epitech.eu>  
Hugo FLEURY: <hugo.fleury@epitech.eu>
