# fancy-todo

link deploy = http://fancytodo.zahriahfriska.xyz

## Getting Started
 * npm install
 * `nodemon app.js` or `npm run dev` for running in server port
 * live-server --host=localhost for running in client port
 

list of routes :
```
http://localhost/3000/users
http://localhost/3000/todos
```

### list of `users` routes

Route | HTTP | Headers(s) | Body | Description
------ | ------ | -------| ------- | -----------
/users/register | POST| none | name:String, username:String, email:String, Password:string (required)| Create a new user
/users/login | POST | none | username:String, email:String (required) | login to FancyTodoo app
/users/loginGoogle | POST | none | email google | login with google email (Oauth)

Response :
 * register 
    * response success
    ```
    {
    "message": "Created new user",
    "data": {
        "_id": "5d2ba46ca35eaf794e57e161",
        "name": "Puca",
        "username": "capuca",
        "email": "puca@mail.com",
        "password": "$2b$10$g67LvJuwuaicGi6NycOIAuJaPEIpcnmfQ9BRX.OReLLokX/LCwVUG",
        "createdAt": "2019-07-14T21:53:48.486Z",
        "updatedAt": "2019-07-14T21:53:48.486Z",
        "__v": 0
    }
    ```
    * response failed
    ```
    User validation failed: name: Please fill the name,username: Username already taken"
    ```

    ```
    {
        message : `Internal Server Error`,
            
    })
    ```

* login
    * Success :
    ```
    {
        "message": "Success Login",
        "token": token from jsonwebtoken
    }
    ```

    * failed :
    ```
    {
        "message": "Internal Server Error",
        "err": {
            "code": 500
        }
    }
    ```

### list of `Todos` routes

Route | HTTP | Headers(s) | Auth | Body | Description
------ | ------ | -------| ---------|  ------- | -----------
/todos/createtodo | POST | token | Authentication | name:String, description:String, status:boolean, due_date:date, UserId : ObjectId(user)  | Create new Todo
/todos/listTodo | GET | token | Authentication and Authorization | none | Get user's todo after login
/todos/listTodo/:keyword | GET | token | Authentication and Authorization | keyword:String | Get todo(s) have been searched
/todos/editTodo/:id | GET | token |Authentication and Authorization | none | Get a todo's info for edit todo
/todos/editTodo/:id | PUT | token | Authentication and Authorization | name:String, description:String, statusTodo:boolean, due_date:date  | Update todo's info by todo's id
/todos/deleteTodo/:id | DELETE | token | Authentication and Authorization | none | Delete todo's by todo's id


Response : 
 
  * Create Todo
    - success : 
    ```
    {
        "message": "Created!",
        "data": {
            "status": false,
            "_id": "5d2bafcda35eaf794e57e163",
            "name": "frfregeg",
            "description": "biar sheat",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "createdAt": "2019-07-14T22:42:21.271Z",
            "updatedAt": "2019-07-14T22:42:21.271Z",
            "__v": 0
        }
    }

    ```

    - error : 
    ```
    {
        "message": "Bad Request"
    }
    ```

* List Todo
    - Success :
    ```
    {
    "listTodo": [
        {
            "status": true,
            "_id": "5d2a1a81db25f77245a446bc",
            "name": "Silaturahmi",
            "description": "wdxadae",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        },
        {
            "status": true,
            "_id": "5d2a1e937cdafc3549db2cd9",
            "name": "Buka bersama dengan Artis",
            "description": "zczszvxs",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        },
        {
            "status": true,
            "_id": "5d2a1efe7cdafc3549db2cda",
            "name": "Silaturahmi",
            "description": "mengenalmu begitu dalam",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        },
        {
            "status": true,
            "_id": "5d2a7aae32920e57bc0d9e40",
            "name": "Mau ke pasar",
            "description": "beli bahan makanan buat dimasak dan dimakan anak2",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        },
        {
            "status": true,
            "_id": "5d2ab6f8d3c4192a1a0d743b",
            "name": "Bila aku",
            "description": "jkdkjscksdmkcdsk",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        },
        {
            "status": false,
            "_id": "5d2af63ebf4cc931e6104a9f",
            "name": "ke hacktiv8",
            "description": "belajar biar pinter",
            "due_date": "2019-07-16T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        }
    ],
        "name": "Dedy Simamora"
    }

    ``` 

    - error :
    ```
    {
        "message": "Bad Request"
    }
    ```

* List Todo Search
    - Success :

     ```
     http://localhost:3000/todos/listTodo/pasar

     result :

     [
        {
            "status": true,
            "_id": "5d2a7aae32920e57bc0d9e40",
            "name": "Mau ke pasar",
            "description": "beli bahan makanan buat dimasak dan dimakan anak2",
            "due_date": "2019-07-15T00:00:00.000Z",
            "UserId": "5d292783c4a0384e3008453d",
            "__v": 0
        }
    ]
     ```

* Get Todo Info
    - response success :
    ```
    {
        "status": false,
        "_id": "5d2af63ebf4cc931e6104a9f",
        "name": "ke hacktiv8",
        "description": "belajar biar pinter",
        "due_date": "2019-07-16T00:00:00.000Z",
        "UserId": "5d292783c4a0384e3008453d",
        "__v": 0
    }
    ```

* Edit Todo Info
    - response success:
    ```
    {
        "status": true,
        "_id": "5d2af63ebf4cc931e6104a9f",
        "name": "ke hacktiv8, Pondok Indah",
        "description": "belajar biar pinter",
        "due_date": "2019-07-16T00:00:00.000Z",
        "UserId": "5d292783c4a0384e3008453d",
        "__v": 0,
        "updatedAt": "2019-07-14T22:58:56.862Z"
    }
    ```

* Delete Todo
    - response success :
    ```
        OK
    ```