# Admin Service

## Create a Project

```javascript
async function CreateProject() {
  const projectInfo = {
    "shortCode": "0000",
    "shortName": "short name",
    "longName": "long name",
    "description": "description"
  };

  const response = await fetch('http://localhost:8080/v1/projects',
   {
     method: 'POST',
     body: JSON.stringify(projectInfo)
   });
   
  const project = await response.json();
}
```

```python
import requests

projectInfo = {
    'shortCode': '0000',
    'shortName': 'short name',
    'longName': 'long name',
    'description': 'description'
}

response = requests.post('http://localhost:8080/v1/projects', json=projectInfo)

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "shortCode": "0000",
  "shortName": "short name",
  "longName": "long name",
  "description": "description",
  "createdAt": "2021-06-08 16:06:52 +0200 CEST",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "updatedAt": "null",
  "updatedBy": "null",
  "deletedAt": "null",
  "deletedBy": "null"
}
```

This endpoint creates a project.

<aside class="notice">
    This request will automatically generate a UUID for the project.
</aside>

### HTTP Request

`POST http://localhost:8080/v1/projects`

### Request Body 
Property | Description
--------- | -----------
shortCode | The short code of the project (2 digit hexadecimal)
shortName | The short name of the project
longName | The long name of the project
description | The description of the project

<aside class="notice">
    The short code must be unique. If the short code already exists, an error will be thrown.
</aside>

## Update a Specific Project

```javascript
async function UpdateProject() {
  const updateProjectData = {
    "shortCode": "1111",
    "shortName": "updated short name",
    "longName": "updated long name",
    "description": "updated description"
  };

  const response = await fetch('http://localhost:8080/v1/projects/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8',
   {
     method: 'PUT',
     body: JSON.stringify(updateProjectData)
   });
   
  const updatedProject = await response.json();
}
```

```python
import requests

updateProjectData = {
  'shortCode': '1111',
  'shortName': 'updated short name',
  'longName': 'updated long name',
  'description': 'updated description'
}

response = requests.put('http://localhost:8080/v1/projects/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8', json=updateProjectData)

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "shortCode": "1111",
  "shortName": "updated short name",
  "longName": "updated long name",
  "description": "updated description",
  "createdAt": "2021-04-07T11:22:04.385664+02:00",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "updatedAt": "2021-04-07T12:09:29.043111+02:00",
  "updatedBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "deletedAt": "null",
  "deletedBy": "null"
}
```

This endpoint updates a specific project.

### HTTP Request

`PUT http://localhost:8080/v1/projects/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the project to retrieve

### Request Body
Property | Description
--------- | -----------
shortCode | The updated short code of the project
shortName | The updated short name of the project
longName | The updated long name of the project
description | The updated description of the project

<aside class="notice">
    All properties must be present in the request body and at least one of the values must differ from the current value.
</aside>
<aside class="warning">
    Projects marked as "deleted" cannot be updated.
</aside>
<aside class="warning">
    Empty strings will throw an error.
</aside>

## Delete a Specific Project

```javascript
async function DeleteProject() {
  const response = await fetch('http://localhost:8080/v1/projects/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8',
  {
    method: 'DELETE'
  });
  const project = await response.json();
}
```

```python
import requests

response = requests.delete('http://localhost:8080/v1/projects/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8')

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "shortCode": "1111",
  "shortName": "updated short name",
  "longName": "updated long name",
  "description": "updated description",
  "createdAt": "2021-04-07T11:22:04.385664+02:00",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "updatedAt": "2021-04-07T12:09:29.043111+02:00",
  "updatedBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "deletedAt": "2021-04-07T15:43:21.228206+02:00",
  "deletedBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b"
}
```

This endpoint deletes a specific project.

### HTTP Request

`DELETE http://localhost:8080/v1/projects/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the project to delete


## Get all Projects

```javascript
let projectsList = [];

async function GetAllProjects() {
  const response = await fetch('http://localhost:8080/v1/projects');
  projectsList = await response.json();
}
```

```python
import requests

response = requests.get('http://localhost:8080/v1/projects')

projectsList = response.content
```

> The above command returns JSON structured like this:

```json
{
  "projects": [
    {
      "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
      "shortCode": "0000",
      "shortName": "short name",
      "longName": "long name",
      "description": "description",
      "createdAt": "2021-04-07T11:22:04.385664+02:00",
      "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
      "updatedAt": "2021-04-07T12:09:29.043111+02:00",
      "updatedBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
      "deletedAt": "null",
      "deletedBy": "null"
    },
    {
      "id": "5257bffe-9713-49a8-94da-d4d03ec74b5f",
      "shortCode": "ffff",
      "shortName": "short name 2",
      "longName": "long name 2",
      "description": "description 2",
      "createdAt": "2021-04-07T11:22:19.504136+02:00",
      "createdBy": "e4abe5b8-1cc5-4916-9690-5b61cc0ac137",
      "updatedAt": "null",
      "updatedBy": "null",
      "deletedAt": "null",
      "deletedBy": "null"
    }
  ]
}
```

This endpoint retrieves all projects.

### HTTP Request

`GET http://localhost:8080/v1/projects`

### Request Body
Property | Type | Description
--------- | ----------- | -----------
returnDeletedProjects | Boolean | If true, the list returned will also include projects marked as "deleted".

<aside class="notice">
    The request body is optional. If omitted, <code>returnDeletedProjects</code> will be set to <code>false</code> by default.
</aside>

## Get a Specific Project

```javascript
async function GetProject() {
  const response = await fetch('http://localhost:8080/v1/project/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8');
  const project = await response.json();
}
```

```python
import requests

response = requests.get('http://localhost:8080/v1/project/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8')

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "shortCode": "0000",
  "shortName": "short name",
  "longName": "long name",
  "description": "description",
  "createdAt": "2021-04-07T11:22:04.385664+02:00",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "updatedAt": "2021-04-07T12:09:29.043111+02:00",
  "updatedBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "deletedAt": "null",
  "deletedBy": "null"
}
```

This endpoint retrieves a specific project.

### HTTP Request

`GET http://localhost:8080/v1/projects/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the project to retrieve