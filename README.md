# fancy-todo ❤️

[![standard-readme compliant](https://img.shields.io/badge/Link%20deploy-KANBAN-brightgreen.svg?style=flat-square)](http://fancytodo.indinabilah.me/)


Getting Startted

```
cd server 
npm i
```

### List of basic routes

`baseUrl` :

```
http://localhost:3000
```

| Router | HTTP | Header | Body | Description |
| ------ | ---- | ------ | ---- | ----------- |
| /users | GET | none | none | get all users |
| /users | POST | none | username:STRING(minimal 5 characters), email:STRING(valid email), password:STRING(minimal 5 characters) | register user |
| /users/login | POST | none | email:STRING, password:STRING | user login |
| /todos | POST | token |  |  |
| /todos/title/:title | GET | token | none | get all todos with todo title/name |
| /todos/status/:status | GET | token | none | get all todos with specific status |
| /todos/id/:id | GET | token | none | get all todos with specific userID |
| /todos/:id | PATCH | token | name:STRING, description:STRING, status:STRING(required), due_date:DATE | edit e todo with specific userID |
| /todos/:id | DELETE | token | none | delete a todo with specific userID |