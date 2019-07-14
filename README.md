# fancy-todo ❤️


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
Router | HTTP | Header | Body | Description 
-------|--------|------- |-------|----
/users | GET | none | none | get all users 
/users | POST | none | username:STRING(minimal 5 characters), email:STRING(valid email), password:STRING(minimal 5 characters) | register user
/users/login | POST | none | username:STRING, password:STRING | user login
/todos/:idUser | GET | UserId | none | get all todos with specific userID
/todos/:idUser | POST | UserId | name:STRING, description:STRING, status:STRING(not required), due_date:DATE | create a new todo with specific userID
/todos/:idUser/:idTodo | PATCH | UserId, TodoId| name:STRING, description:STRING, status:STRING(required), due_date:DATE | edit e todo with specific userID
/todos/:idUser/:idTodo | DELETE | UserId, TodoId | none | delete a todo with specific userID

