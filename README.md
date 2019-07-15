# fancy-todo

A Todo-list app for Portofolio on Hacktiv8 Bootcamp

## USAGE

Before using the API, make sure you install these packages on global by running this code

```
 $ npm i -g live-server nodemon mongodb
```

Then just run these codes 

For server :
```
  $ npm install
  $ npm run dev
```

For client "
```
  $ live-server --host=localhost
```



---------------------------------------------

### Base URL Routes

Base URL on localhost : `http//localhost:3000/api`

Examples : 
```
http//localhost:3000/api/users
```

## User Routes


| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/users/register`| POST | `{ email, password }` | `Registered User Info` | 400 ( Email is already taken!) <br>400 (Email is empty!) <br>400 (Password is empty!)   |Register with new user info|
| `/users/login` | POST | `{ email, password }`| `{payload{_id, email}, access_token }`| 400 (Invalid username/password) |Login and get an access token and email |
| `/users/login/google` | POST |  | `{ payload{_id, email}, access_token }` | | Sign in with Google|


## Todo Routes
-----

The API have 2 leading routes for : 
+ Project
+ User

Change the type after `http//localhost:3000/api/todos/` based on routes above

example : 

```
http//localhost:3000/api/todos/project/       // for todo's project
http//localhost:3000/api/todos/user/        // for todo's user
```


| Route                   | HTTP   | HEADERS                               | BODY/PARAMS                                              | RESPONSE                                                    | DESCRIPTION                                        | VALIDATION |
|-------------------------|--------|---------------------------------------|----------------------------------------------------------|-------------------------------------------------------------|----------------------------------------------------|------------|
| /todos/{type}                 | GET    | Headers : {token: authenticate token} | -                                                        | [{id, title, description, user, project, status, due_date}] | Get all todos for user or project                  | -          |
| /todos/{type}/{todoId}        | GET    | Headers : {token: authenticate token} | Params {todoId}                                          | {id, title, description, user, project, status, due_date}   | Get one todo for user or project based on `todoId` | -          |
| /todos/{type}                 | POST   | Headers : {token: authenticate token} | Body {title, description, due_date} <br> Params {todoId} | {id, title, description, user, project, status, due_date}   | Create new todo                                    | -          |
| /todos/{type}/{todoId}        | PUT    | Headers : {token: authenticate token} | Body {title, description, due_date} <br> Params {todoId} | {id, title, description, user, project, status, due_date}   | Edit/replace existing todo based on `todoId`       | -          |
| /todos/{type}/status/{todoId} | PATCH  | Headers : {token: authenticate token} | Params {todoId}                                          | {id, title, description, user, project, status, due_date}   | Update status to `true` based on `todoId`          | -          |
| /todos/{type}/{todoId}        | DELETE | Headers : {token: authenticate token} | Params {todoId}                                          | -                                                           | Delete one todos                                   | -          |



## Project Routes

base url : `http//localhost:3000/api/projects`

example : 
```
  http://localhost:3000/projects
```

| ROUTES                           | HTTP   | HEADERS                               | BODY/PARAMS                                   | RESPONSE                     | DESCRIPTION                                        | VALIDATION |
|----------------------------------|--------|---------------------------------------|-----------------------------------------------|------------------------------|----------------------------------------------------|------------|
| /projects                        | GET    | Headers : {token: authenticate token} | -                                             | [{id, members, owner, name}] | get project list                                   | -          |
| /projects                        | POST   | Headers : {token: authenticate token} | Body {name}                                   | {id, members, owner, name}   | create project                                     | -          |
| /projects/editname/{projectId}   | PATCH  | Headers : {token: authenticate token} | Body {name} <br> params {projectId}           | {id, members, owner, name}   | edit project name                                  | Owner only |
| /projects/kickmember/{projectId} | PATCH  | Headers : {token: authenticate token} | Body {user: email} <br> params {projectId}    | {id, members, owner, name}   | kick one member based on user email                | Owner only |
| /projects/add/{projectId}        | POST   | Headers : {token: authenticate token} | Body [{users: email}] <br> params {projectId} | {id, members, owner, name}   | add one or multiple registered user based on email | Owner only |
| /projects/{projectId}            | DELETE | Headers : {token: authenticate token} | params {projectId}                            | -                            | Delete one existing project                        | Owner only |