# fancy-todo

how to running app.js
> npm run dev

### all endpoint Users

| method | routes                        | detail                              | body | headers | query |
| ------ | ----------------------------- | ------------------------------------|--------|-------------|----|
| POST   | /users/register                 | create new `User`                         | email, password,username | - | -|
| POST   | /users/login                    | `User` login to system                    | email, password | - | -|| POST   | /users/tokensignin                    | `User` sign in with Google                   | - | - | -|                
| GET   | /users/find                    | Find `User` by email                   | - | - |  email |
------

### all endpoint Todos

| method | routes                        | detail                              | body | headers |
| ------ | ----------------------------- | ------------------------------------|--------|-------------|
| GET    | /todos                    |   show `Todo` list created by owner                 | - | token |
| GET    | /todos/:todoid                | show one `Todo` list by id              | - | token |
| POST   | /todos                    | create new `Todo` list                   | name, description,due_date | token |
| DELETE   | /todos/:todoid              | delete one of `Todo` list by id          | - | token |
| PUT    | /todos/:todoid                | edit `Todo` list by id                   | name, description,duedate | token |
| PATCH    | /todos/:todoid              | edit status of `Todo` list (uncompleted to completed)          | title | token |
| GET    | /todos/search/:search                | get one `Todo` list by user's input              | - | token |
                 

------

### all endpoint Pojects

| method | routes                        | detail                              | body | headers |
| ------ | ----------------------------- | ------------------------------------|--------|-------------|
| GET    | /projects/my                    |   show `Projects` list created by owner                  | - | token |
| GET    | /projects/group                    |   show `Projects` list created by other owner and owner is being one of a member                  | - | token |
| GET    | /projects/detail/:id                    |   show `Projects` detail                  | - | token |
| GET    | /projects/one/:id                    |   show one `Projects` created by owner                  | - | token |
| POST   | /projects                    | create new `Project`                   | name, description | token |
| PUT    | /projects/:id                | add `Todo` to one of projects                   | name, description,due_date | token |
| DELETE   | /projects/:id              | delete one of `Projects` list by id          | - | token |
| PATCH    | /projects/:id/edit              | edit one of `Projects` list          | name, description | token |
| GET    | /projects/send/:id/:email                | to send an email to one of member being added in one of `Projects`              | - | token |
| PATCH    | /projects/:id/invite              | add member to one of `Projects` list          | userid | token |
| PATCH    | /projects/:id/remove              | remove member from one of `Projects` list          | userid | token |                

------

## Example endpoint
### Todos

> GET / todos

#### expected output
status code: 200

array of object

    [
        {
            "status":false,
            "isProject":false,
            "_id":"5d2b509fadf64f264af80497",
            "name":"revision ",
            "description":"harus bisa semangat",
            "due_date":"2019-07-15T00:00:00.000Z",
            "user_id":"5d2adabbdd30f45770f96836",
            "createdAt":"2019-07-14T15:56:15.571Z",
            "updatedAt":"2019-07-14T15:56:15.571Z",
            "__v":0
        }
    ]

> POST / todos
#### input required
    {
        "name":"revision ",
        "description":"harus bisa semangat",
        "due_date":"2019-07-15",
    }

validation: due_date should be at least tomorrow's date, not today's

#### expected output
status code: 201

    {
        "status":false,
        "isProject":false,
        "_id":"5d2b509fadf64f264af80497",
        "name":"revision ",
        "description":"harus bisa semangat",
        "due_date":"2019-07-15T00:00:00.000Z",
        "user_id":"5d2adabbdd30f45770f96836",
        "createdAt":"2019-07-14T15:56:15.571Z",
        "updatedAt":"2019-07-14T15:56:15.571Z",
        "__v":0
    }

#### expected output validation error
status code : 400

    {
        "message": "Todo validation failed: due_date: you must set the date at least tomorrow!"
    }

#### expected output req.body empty
status code : 400
    {
        "message":"Todo validation failed: name: Path `name` is required., description: Path `description` is required."
    }


> GET / todos/ search/ revision
#### expected output
status code: 200

    {
        "status":false,
        "isProject":false,
        "_id":"5d2b509fadf64f264af80497",
        "name":"revision ",
        "description":"harus bisa semangat",
        "due_date":"2019-07-15T00:00:00.000Z",
        "user_id":"5d2adabbdd30f45770f96836",
        "createdAt":"2019-07-14T15:56:15.571Z",
        "updatedAt":"2019-07-14T15:56:15.571Z",
        "__v":0
    }

### Projects

> GET / projects / my

#### expected output
status code: 200

array of object

    [
        {
            "members":[],
            "todos":[],
            "_id":"5d2b45ddbd3feb237cdb279d",
            "name":"Fancy Todo",
            "description":"let's make it fancy guys!",
            "user_id":"5d2adabbdd30f45770f96836",
            "createdAt":"2019-07-14T15:10:21.866Z",
            "updatedAt":"2019-07-14T15:10:21.866Z",
            "__v":0
        }
    ]

> GET / projects / detail / 5d2b45ddbd3feb237cdb279e

#### expected output
status code: 200

array of object

    {
        "members":[
            {
                "_id":"5d2ad99c8b9151564844bc6d",
                "username":"Viuty",
                "email":"vsuzy1206@gmail.com",
                "password":"$2a$10$H3oy60wHXq8TTY2RX0/M2ubwPoT7.0tDEiAmHiB12Z2PcBZp.OSZ2",
                "createdAt":"2019-07-14T07:28:28.178Z",
                "updatedAt":"2019-07-14T07:28:28.178Z",
                "__v":0
            }],
        "todos":[],
        "_id":"5d2b45ddbd3feb237cdb279e",
        "name":"Mini Wp","description":"let's make it fancy guys!",
        "user_id":{
            "_id":"5d2adabbdd30f45770f96836",
            "username":"tviuty",
            "email":"tviuty@yahoo.com",
            "password":"$2a$10$Wx1zg9HdvHpSSLhcE.RWSegZOPoB3CaPQdXGlIOBI3jiu8LwCZQxq",
            "createdAt":"2019-07-14T07:33:15.240Z",
            "updatedAt":"2019-07-14T07:33:15.240Z","__v":0
            },
        "createdAt":"2019-07-14T15:10:21.884Z",
        "updatedAt":"2019-07-14T15:18:54.077Z",
        "__v":0
    }


> POST / projects
#### input required
    {
        "name":"fancy",
        "description":"let's make it fancy guys!"
    }
note: description is optional

#### expected output
status code: 201

    {
        "members":[],
        "todos":[],
        "_id":"5d2b45ddbd3feb237cdb279d",
        "name":"fancy",
        "description":"let's make it fancy guys!",
        "user_id":"5d2adabbdd30f45770f96836",
        "createdAt":"2019-07-14T15:10:21.866Z",
        "updatedAt":"2019-07-14T15:10:21.866Z",
        "__v":0
    }

#### expected output empty body name
    {
        "message": "Project validation failed: name: Path `name` is required."
    }


> PATCH / projects / 5d2b45ddbd3feb237cdb279d /edit
#### input 
    {
        "name":"fancy todo",
        "description":"let's make it fancy guys!"
    }

#### expected output
status code: 200

    {
        "members":[],
        "todos":[],
        "_id":"5d2b45ddbd3feb237cdb279d",
        "name":"fancy todo",
        "description":"let's make it fancy guys!",
        "user_id":"5d2adabbdd30f45770f96836",
        "createdAt":"2019-07-14T15:10:21.866Z",
        "updatedAt":"2019-07-14T15:10:21.866Z",
        "__v":0
    }


### Users

> GET / users / find?email=vsuzy1206@gmail.com

#### expected output
status code : 200

    {
        "_id":"5d2ad99c8b9151564844bc6d",
        "username":"Viuty",
        "email":"vsuzy1206@gmail.com",
        "password":"$2a$10$H3oy60wHXq8TTY2RX0/M2ubwPoT7.0tDEiAmHiB12Z2PcBZp.OSZ2",
        "createdAt":"2019-07-14T07:28:28.178Z",
        "updatedAt":"2019-07-14T07:28:28.178Z",
        "__v":0
    }


> POST / users/register
#### input
    {
        "email": "tviuty@yahoo.com",
        "password": "12345",
        "username" : "tviuty"
    }
#### expected output
status code: 201

object

    {
        "id": 2,
        "email": "tviuty1206@yahoo.com",
        "password": "$2a$10$hnpJVqap6dJRTIANw8avFOSRe2Uhy43KD2jz5DCd6yIZBYlTUaN9.",
        "username" : "tviuty",
        "updatedAt": "2019-07-08T10:01:21.667Z",
        "createdAt": "2019-07-08T10:01:21.667Z"
    }

 > POST / users/login
#### input
    {
        "email": "tviuty@yahoo.com",
        "password": "12345",
    }
#### expected output
status code: 200

object

    {
       "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dml1dHlAeWFob28uY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkdG5iaU52eHp2Vmpud2cuOUJBYXJiZVBGVU5BaDFzbEZEbFJpODU0a1h4VGxCYzdEeXYvZlMiLCJjcmVhdGVkQXQiOiIyMDE5LTA3LTA4VDA2OjExOjIyLjU5NFoiLCJ1cGRhdGVkQXQiOiIyMDE5LTA3LTA4VDA2OjExOjIyLjU5NFoiLCJpYXQiOjE1NjI1NzE2NzIsImV4cCI6MTU2MjU3NTI3Mn0.HF9CmMpJrzSV64fO-T6CH76bJkPCf22td4PddDa-lW8"
    }