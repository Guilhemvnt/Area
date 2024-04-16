# AREA API definition

Collection "AREA" - Resource Management

This collection is designed to streamline resource management within the AREA project. It encompasses API requests for creating, updating, and deleting resources, as well as data retrieval operations. The endpoints cover various aspects of the project, including authentication, scenarios, components, user management, and execution.

## Authentication

The Authentication API provides endpoints for user registration and login to access the AREA project.

### POST /register

Register a new user account to access the AREA project.

* request query :

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

* good answer body :

  ```json
  {
    "message": "User registered"
  }
  ```

* bad answer body :

  ```json
  {
    "error": "Registration failed"
  }
  ```

#### POST /login

Authenticate a user to access the AREA project.

* request query :

  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

* good answer body :

  ```json
  {
    "token": "string"
  }
  ```

* bad answer body :

  ```json
  {
    "error": "Invalid credentials"
  }
  ```

## Scenario

The Scenario API provides endpoints for managing and retrieving scenarios within the AREA project.

### POST /addScenario

Add a new scenario to the AREA project.

* request query :
  * token : *"String"*

  ```json
  {
    "scenario_name": "string",
    "scenario_description": "string"
  }
  ```

* good answer body :

  ```json
  {
    "success": true,
    "message": "string",
    "scenario": {
      "id": "number",
      "user_id": "number",
      "scenario_name": "string",
      "scenario_description": "string"
    }
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

* bad answer body :

  ```json
  {
    "success": false,
    "error": "add scenario failed"
  }
  ```

#### GET /getScenarios

Retrieve a list of all scenarios in the AREA project.

* request query :
  * token : *"String"*

* good answer body :

  ```json
  {
    "success": true,
    "message": "scenario fetched",
    "result": {
      "command": "SELECT",
      "rowCount": 1,
      "oid": null,
      "rows": [
        {
          "id": "number",
          "user_id": "number",
          "scenario_name": "string",
          "scenario_description": "string"
        }
      ],
    }
  }
  ```

  ```json
  {
    "success": true,
    "message": "scenario fetched",
    "result": {
      "command": "SELECT",
      "rowCount": 2,
      "oid": null,
      "rows": [
          {
            "id": "number",
            "user_id": "number",
            "scenario_name": "string",
            "scenario_description": "string"
          },
          {
            "id": "number",
            "user_id": "number",
            "scenario_name": "string",
            "scenario_description": "string"
          }
      ],
    }
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

#### GET /getScenario

Retrieve details of a specific scenario in the AREA project.

* request query :
  * token : *"String"*

  ```json
  {
    "id" : "number"
  }
  ```

* good answer body :

  ```json
  {
    "success": true,
    "message": "scenario fetched",
    "result": {
      "command": "SELECT",
      "rowCount": 1,
      "oid": null,
      "rows": [
        {
          "id": "number",
          "user_id": "number",
          "scenario_name": "string",
          "scenario_description": "string"
        }
      ],
    }
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

## Components

The Components API provides endpoints for managing components within a scenario in the AREA project.

### POST /addComponent

Add a component to a scenario within the AREA project.

* request query :
  * token : *"String"*

  ```json
  {
    "scenario_id": "number",
    "component_name": "string",
    "component_type": "string",
    "link_to": "string"
  }
  ```

* good answer body :

  ```json
  {
    "message": "Component added successfully"
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

#### POST /getComponents

Retrieve a list of components within a specific scenario in the AREA project.

* request query :
  * token : *"String"*

  ```json
  {
    "id" :  "number"
  }
  ```

* good answer body :

  ```json
  {
    "success": true,
    "message": "components fetched",
    "result": {
      "command": "SELECT",
      "rowCount": 1,
      "oid": null,
      "rows": [
        {
          "id": "number",
          "scenario_id": "number",
          "component_name": "string",
          "component_type": "string",
          "link_to": "string"
        }
      ],
    }
  }
  ```

  ```json
  {
    "success": true,
    "message": "components fetched",
    "result": {
      "command": "SELECT",
      "rowCount": 2,
      "oid": null,
      "rows": [
        {
          "id": "number",
          "scenario_id": "number",
          "component_name": "string",
          "component_type": "string",
          "link_to": "string"
        },
        {
          "id": "number",
          "scenario_id": "number",
          "component_name": "string",
          "component_type": "string",
          "link_to": "string"
        }
      ],
    }
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

#### DELETE /delComponent

Add a component to a scenario within the AREA project.

* request query :
  * token : *"String"*

  ```json
  {
    "scenario_id": "number",
    "component_id": "number"
  }
  ```

* good answer body :

  ```json
  {
    "message": "Component deleted successfully"
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

## User

The User API provides an endpoint for retrieving user information within the AREA project.

### GET /getUserId

Retrieve information about a specific user in the AREA project.

* request query :
  * token : *"String"*

* good answer body :

  ```json
  {
    "userId": "number"
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

## Execution

The Execution API provides endpoints for executing scenarios and cryptographic operations within the AREA project.

### POST /doScenario

Execute a scenario within the AREA project.

* request query :
  * token : *"String"*

  ```json
  {
    "id" : "number"
  }
  ```

* good answer body :

  ```json
  {
    "success": true,
    "message": "Action done successfully",
  }
  ```

* unsuccessful answer body :

  ```json
  {
    "success": false,
    "message": "Action run but not trigger",
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```

### POST /authMicrosoft

auth to microsoft graph API

* request query :
  * token : *"String"*

* good answer body :

  ```json
  {
    "success": true,
    "message": "auth done",
    "info": {
        "url": "https://microsoft.com/devicelogin",
        "code": "a random code"
    }
  }
  ```

* unregister answer body :

  ```json
  {
    "error": "Invalid token"
  }
  ```
