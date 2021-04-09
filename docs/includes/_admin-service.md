# Admin Service

## Create a Project

```javascript
async function CreateProject() {
  const projectInfo = {
    "shortCode": "short code",
    "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
    "shortName": "short name",
    "longName": "long name",
    "description": "description"
  };

  const response = await fetch('http://localhost:8080/v1/project',
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
    'shortCode': 'short code',
    'createdBy': '3018c9db-7a65-44e7-b31a-0d547a10b75b',
    'shortName': 'short name',
    'longName': 'long name',
    'description': 'description'
}

response = requests.post('http://localhost:8080/v1/project', json=projectInfo)

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "shortCode": "short code",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "shortName": "short name",
  "longName": "long name",
  "description": "description",
  "createdAt": "2021-04-07T11:22:04.385664+02:00",
  "updatedAt": "0001-01-01T00:00:00Z"
}
```

This endpoint creates a project.

<aside class="notice">
    This request will automatically generate a UUID for the project and add the current time to the "createdAt" property.
</aside>

### HTTP Request

`POST http://localhost:8080/v1/project/`

### Request Body 
Property | Description
--------- | -----------
shortCode | The short code of the project
createdBy | The UUID of the user sending the request
shortName | The short name of the project
longName | The long name of the project
description | The description of the project

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
      "shortCode": "short code",
      "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
      "shortName": "short name",
      "longName": "long name",
      "description": "description",
      "createdAt": "2021-04-07T11:22:04.385664+02:00",
      "updatedAt": "0001-01-01T00:00:00Z"
    },
    {
      "id": "5257bffe-9713-49a8-94da-d4d03ec74b5f",
      "shortCode": "short code 2",
      "createdBy": "e4abe5b8-1cc5-4916-9690-5b61cc0ac137",
      "shortName": "short name 2",
      "longName": "long name 2",
      "description": "description 2",
      "createdAt": "2021-04-07T11:22:19.504136+02:00",
      "updatedAt": "0001-01-01T00:00:00Z"
    }
  ]
}
```

This endpoint retrieves all projects.

### HTTP Request

`GET http://localhost:8080/v1/projects`

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
  "shortCode": "short code",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "shortName": "short name",
  "longName": "long name",
  "description": "description",
  "createdAt": "2021-04-07T11:22:04.385664+02:00",
  "updatedAt": "0001-01-01T00:00:00Z"
}
```

This endpoint retrieves a specific project.

### HTTP Request

`GET http://localhost:8080/v1/project/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the project to retrieve

## Update a Specific Project

```javascript
async function UpdateProject() {
  const updateProjectData = {
    "shortCode": "updated short code",
    "shortName": "updated short name",
    "longName": "updated long name",
    "description": "updated description"
  };

  const response = await fetch('http://localhost:8080/v1/project/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8',
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
  'shortCode': 'updated short code',
  'shortName': 'updated short name',
  'longName': 'updated long name',
  'description': 'updated description'
}

response = requests.put('http://localhost:8080/v1/project/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8', json=updateProjectData)

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id": "b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "shortCode": "updated short code",
  "createdBy": "3018c9db-7a65-44e7-b31a-0d547a10b75b",
  "shortName": "updated short name",
  "longName": "updated long name",
  "description": "updated description",
  "createdAt": "2021-04-07T11:22:04.385664+02:00",
  "updatedAt": "2021-04-07T12:09:29.043111+02:00"
}
```

This endpoint updates a specific project.

<aside class="notice">
    This request will automatically update the "updatedAt" property.
</aside>

### HTTP Request

`PUT http://localhost:8080/v1/project/<ID>`

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
    At least one of the properties must be present in the request body.
</aside>
<aside class="warning">
    Empty strings are ignored.
</aside>

## Delete a Specific Project

```javascript
async function DeleteProject() {
  const response = await fetch('http://localhost:8080/v1/project/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8',
  {
    method: 'DELETE'
  });
  const project = await response.json();
}
```

```python
import requests

response = requests.delete('http://localhost:8080/v1/project/b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8')

project = response.content
```

> The above command returns JSON structured like this:

```json
{
  "id":"b9d7a6e4-dcd6-43ff-a928-f55e9e8097f8",
  "deletedAt":"2021-04-07T11:51:21.228206+02:00"
}
```

This endpoint deletes a specific project.

### HTTP Request

`DELETE http://localhost:8080/v1/project/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
ID | The ID of the project to delete
