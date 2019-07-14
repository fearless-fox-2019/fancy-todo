# Fancy Todo

## Deployed at


## User Routes

|Route|HTTP|Headers|Body|Response|Description|
|-|-|-|--------|------------------|------------|
|`/api/register`|`POST`|None|`username: String`<br>`email: String`<br>`password: String`|`{access_token: jwtToken}`|Register a new user |
|`/api/login`|`POST`|None|`username: String`<br> `password: String`|`{access_token: jwtToken}`|Login with your user account||
|`/api/login/google`|`POST`|None|None|`{access_token: jwtToken}`|Login with your google user account||
#

## Project Routes
|Route|HTTP|Headers|Body|Response|Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
|`/api/projects/add`|`POST`|`token: jwtToken`|`name: String`|`New Project Data`|Create a new project|
|`/api/projects/:{projectId}`|`GET`|`token: jwtToken`|None|`Selected Project Data`|Gets a single project with list of members and todos|
|`api/projects/:{projectId}/invite`|`PATCH`|`{token: jwtToken}`|`member: String`|`Updated Project Data`|Invite a user into your project|
|`api/projects/:{projectId}/delete`|`DELETE`|`{token: jwtToken}`|None|{deletedCount:1}|Deletes a selected project|

## Todo Routes
|Route|HTTP|Headers|Body|Response|Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
|`api/projects/:{projectId}/createTodo`|`POST`|`{token: jwtToken}`|`name: String `<br> `category: String`|`New Todo Data`|Creates a todo in current selected project|
|`api/projects/:{projectId}/update`|`PATCH`|`{token: jwtToken}`|`todoStatus: Boolean`|`Updated todo Data`|Updates the status of a selected Todo|
|`api/projects/:{projectId}/deletetodo`|`DELETE`|`{token: jwtToken}`|`todo: todoId`|None|Deletes a selected todo in a project|



