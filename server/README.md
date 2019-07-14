# Trail Work

## Geting Started
- npm install
- Run `nodemon app.js or npm run dev` to start the server.
- Run `live-server --host=localhost` to start the client
- baseUrl: http://localhost:8080

## Feature
- Register
- Login
- Login With Google
- Create Project
- Create Todo
- Invite Member
- Edit Project
- Delete Project
- Edit Todo
- Delete Todo
- Update Status Todo


## Routes
### User Route
#### Register

    URL: ${baseUrl}/users/register
    Method: POST
    Headers: none
    params: none
    body: {name: String, email: String, password: String}
    Success Response: 
        Code 201:
            {
                "_id":"5d10a8fb6776a53e8f8f12ed",
                "name":"Ana",
                "email":"ana@mail.com",
                "password":"$2b$10$iZWscBJjoGT8keRIOthySuwOIFMgIpHChImQtG5ZqdaJ/.MxnD8Fi",
                "__v":0
            }
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Login

    URL: ${baseUrl}/users/login
    Method: POST
    Headers: none
    params: none
    body: {email: String, password: String}
    Success Response: 
        Code 200:
            {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMjRhZjYwNmJkNTkzMTkwYzM1Y2ZiYSIsImVtYWlsIjoiYW5hQG1haWwuY29tIiwibmFtZSI6ImFuYSIsImlhdCI6MTU2MzA4Nzg3NiwiZXhwIjoxNTYzMDkxNDc2fQ.6scundMCsMz94JwAE0qdRRWN55UDTwf3KQ12v5OZdJg",
                "name": "ana",
                "userId": "5d24af606bd593190c35cfba"
            }
    Error Response:
        Code 404:
        Content: {message: 'Wrong Email/Password'}

#### Login With Google

    URL: ${baseUrl}/users/loginGoogle
    Method: POST
    Headers: none
    params: none
    body: none
    Success Response: 
        Code 200:
            {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMjRhZjYwNmJkNTkzMTkwYzM1Y2ZiYSIsImVtYWlsIjoiYW5hQG1haWwuY29tIiwibmFtZSI6ImFuYSIsImlhdCI6MTU2MzA4Nzg3NiwiZXhwIjoxNTYzMDkxNDc2fQ.6scundMCsMz94JwAE0qdRRWN55UDTwf3KQ12v5OZdJg",
                "name": "ana meilani",
                "userId": "5d24af606bd593190c35cfba"
            }
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}


### Project Route
#### Create Project

    URL: ${baseUrl}/projects
    Method: POST
    Headers: token
    params: none
    body: {name: String, description: String, members: Array}
    Success Response: 
        Code 200:
            {
                "members": [
                    "5d28c0cdd78bc32590d6eb70"
                ],
                "_id": "5d2ad55c798fcd0c02ea0bac",
                "name": "create porto",
                "description": "membuat portofolio web fancy todo",
                "creator": "5d24af606bd593190c35cfba",
                "createdAt": "2019-07-14T07:10:20.862Z",
                "updatedAt": "2019-07-14T07:10:20.862Z",
                "__v": 0
            }
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Get All Project for Authenticated User

    URL: ${baseUrl}/projects
    Method: GET
    Headers: token
    params: none
    body: none
    Success Response: 
        Code 200:
            [
                {
                    "members": [
                        "5d24af606bd593190c35cfba",
                        "5d2611537ca3151e525b30f8",
                        "5d28c0cdd78bc32590d6eb70"
                    ],
                    "_id": "5d28ca85b78ae4309bf00ffb",
                    "todoList": [],
                    "name": "myproject",
                    "description": "ini projectku untuk membuat fancy todo",
                    "creator": {
                        "_id": "5d28c0cdd78bc32590d6eb70",
                        "name": "mei",
                        "email": "mei@mail.com",
                        "password": "$2b$10$PVrkjgOH/RD6qmg1953wX.eDMKrtsGzVj8o1ohzsrORoOBfXCy4aW",
                        "__v": 0
                    },
                    "__v": 0,
                    "updatedAt": "2019-07-14T04:16:32.018Z"
                },
                {
                    "members": [
                        "5d24af606bd593190c35cfba",
                        "5d28c0cdd78bc32590d6eb70"
                    ],
                    "_id": "5d2aa8205e8d1e150767e1d4",
                    "name": "fancy todo porto",
                    "description": "membuat aplikasi fancy todo dengan menggunakan jquery",
                    "creator": {
                        "_id": "5d28c0cdd78bc32590d6eb70",
                        "name": "mei",
                        "email": "mei@mail.com",
                        "password": "$2b$10$PVrkjgOH/RD6qmg1953wX.eDMKrtsGzVj8o1ohzsrORoOBfXCy4aW",
                        "__v": 0
                    },
                    "createdAt": "2019-07-14T03:57:20.406Z",
                    "updatedAt": "2019-07-14T03:57:20.406Z",
                    "__v": 0
                },
                .......
            ]
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Get One Project

    URL: ${baseUrl}/projects/:projectId
    Method: GET
    Headers: token
    params: projectId
    body: none
    Success Response: 
        Code 200:
        {
            "members": [
                "5d24af606bd593190c35cfba",
                "5d28c0cdd78bc32590d6eb70"
            ],
            "_id": "5d2aa8205e8d1e150767e1d4",
            "name": "fancy todo porto",
            "description": "membuat aplikasi fancy todo dengan menggunakan jquery",
            "creator": "5d28c0cdd78bc32590d6eb70",
            "createdAt": "2019-07-14T03:57:20.406Z",
            "updatedAt": "2019-07-14T03:57:20.406Z",
            "__v": 0
        }

    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Update Project

    URL: ${baseUrl}/projects/:projectId
    Method: PATCH
    Headers: token
    params: projectId
    body: any field of model
    Success Response: 
        Code 200:
        {
            "members": [
                "5d28c0cdd78bc32590d6eb70"
            ],
            "_id": "5d2ad55c798fcd0c02ea0bac",
            "name": "create porto fancy todo",
            "description": "membuat portofolio web fancy todo",
            "creator": "5d24af606bd593190c35cfba",
            "createdAt": "2019-07-14T07:10:20.862Z",
            "updatedAt": "2019-07-14T07:21:58.236Z",
            "__v": 0
        }

    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Invite Member

    URL: ${baseUrl}/projects/invite/:projectId
    Method: PATCH
    Headers: token
    params: projectId
    body: {Array: members[]}
    Success Response: 
        Code 200:
        {
            "members": [
                "5d28c0cdd78bc32590d6eb70",
                "5d2611537ca3151e525b30f8"
            ],
            "_id": "5d2ad55c798fcd0c02ea0bac",
            "name": "create porto fancy todo",
            "description": "membuat portofolio web fancy todo",
            "creator": "5d24af606bd593190c35cfba",
            "createdAt": "2019-07-14T07:10:20.862Z",
            "updatedAt": "2019-07-14T07:21:58.236Z",
            "__v": 0
        }

    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Delete Project

    URL: ${baseUrl}/projects/:projectId
    Method: DELETE
    Headers: token
    params: projectId
    body: none
    Success Response: 
        Code 200:
        [
            {
                "n": 0,
                "ok": 1,
                "deletedCount": 0
            },
            {
                "n": 1,
                "ok": 1,
                "deletedCount": 1
            }
        ]
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}



### Todo Routes
#### Create Todo

    URL: ${baseUrl}/todos
    Method: POST
    Headers: token
    params: none
    body: {name: String, description: String, dueDate: Date, projectId: String}
    Success Response: 
        Code 200:
            {
                "status": "todo",
                "_id": "5d2add7ab4759711af813582",
                "name": "create fitur CRUD",
                "description": "create fitur CRUD todo",
                "dueDate": "2019-07-16T00:00:00.000Z",
                "userId": "5d24af606bd593190c35cfba",
                "projectId": "5d28ca85b78ae4309bf00ffb",
                "createdAt": "2019-07-14T07:44:58.506Z",
                "updatedAt": "2019-07-14T07:44:58.506Z",
                "__v": 0
            }
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Get All Todos with Specific Status and ProjectId

    URL: ${baseUrl}/todos/:status/:projectId
    Method: GET
    Headers: token
    params: status, projectId
    body: none
    Success Response: 
        Code 200:
            [
                {
                    "status": "todo",
                    "_id": "5d2add7ab4759711af813582",
                    "name": "create fitur CRUD",
                    "description": "create fitur CRUD todo",
                    "dueDate": "2019-07-16T00:00:00.000Z",
                    "userId": {
                        "_id": "5d24af606bd593190c35cfba",
                        "name": "ana",
                        "email": "ana@mail.com",
                        "password": "$2b$10$iDIpGUjvUrro1z4UD77o5erNy0iFrQVdS4hOFMsTyHV376WDWo9/6",
                        "__v": 0
                    },
                    "projectId": {
                        "members": [
                            "5d24af606bd593190c35cfba",
                            "5d2611537ca3151e525b30f8",
                            "5d28c0cdd78bc32590d6eb70"
                        ],
                        "_id": "5d28ca85b78ae4309bf00ffb",
                        "todoList": [],
                        "name": "myproject",
                        "description": "ini projectku untuk membuat fancy todo",
                        "creator": "5d28c0cdd78bc32590d6eb70",
                        "__v": 0,
                        "updatedAt": "2019-07-14T04:16:32.018Z"
                    },
                    "createdAt": "2019-07-14T07:44:58.506Z",
                    "updatedAt": "2019-07-14T07:44:58.506Z",
                    "__v": 0
                },
                ......
            ]
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Get All Todos with Specific Status and ProjectId

    URL: ${baseUrl}/todos/:todoId
    Method: GET
    Headers: token
    params: todoId
    body: none
    Success Response: 
        Code 200:
            {
                "status": "todo",
                "_id": "5d2add7ab4759711af813582",
                "name": "create fitur CRUD",
                "description": "create fitur CRUD todo",
                "dueDate": "2019-07-16T00:00:00.000Z",
                "userId": {
                    "_id": "5d24af606bd593190c35cfba",
                    "name": "ana",
                    "email": "ana@mail.com",
                    "password": "$2b$10$iDIpGUjvUrro1z4UD77o5erNy0iFrQVdS4hOFMsTyHV376WDWo9/6",
                    "__v": 0
                },
                "projectId": {
                    "members": [
                        "5d24af606bd593190c35cfba",
                        "5d2611537ca3151e525b30f8",
                        "5d28c0cdd78bc32590d6eb70"
                    ],
                    "_id": "5d28ca85b78ae4309bf00ffb",
                    "todoList": [],
                    "name": "myproject",
                    "description": "ini projectku untuk membuat fancy todo",
                    "creator": "5d28c0cdd78bc32590d6eb70",
                    "__v": 0,
                    "updatedAt": "2019-07-14T04:16:32.018Z"
                },
                "createdAt": "2019-07-14T07:44:58.506Z",
                "updatedAt": "2019-07-14T07:44:58.506Z",
                "__v": 0
            }
    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Update Todo

    URL: ${baseUrl}/todos/:todoId
    Method: PATCH
    Headers: token
    params: todoId
    body: any field on Todo model
    Success Response: 
        Code 200:
        {
            "status": "todo",
            "_id": "5d2add7ab4759711af813582",
            "name": "create fitur CRUD user",
            "description": "membuat fitur untuk create read update delete user",
            "dueDate": "2019-07-16T00:00:00.000Z",
            "userId": "5d24af606bd593190c35cfba",
            "projectId": "5d28ca85b78ae4309bf00ffb",
            "createdAt": "2019-07-14T07:44:58.506Z",
            "updatedAt": "2019-07-14T07:57:34.652Z",
            "__v": 0
        }

    Error Response:
        Code 500:
        Content: {message: 'Internal Server Error'}

#### Delete Todo

    URL: ${baseUrl}/todos/:todoId
    Method: DELETE
    Headers: token
    params: todoId
    body: none
    Success Response: 
        Code 200:
        {
            "todo": {
                "status": "todo",
                "_id": "5d29f2f554a9b91d8186c006",
                "name": "testing",
                "description": "testing for feature delete todo",
                "dueDate": "2019-07-16T00:00:00.000Z",
                "userId": "5d28c0cdd78bc32590d6eb70",
                "projectId": "5d28ca85b78ae4309bf00ffb",
                "createdAt": "2019-07-13T15:04:21.874Z",
                "updatedAt": "2019-07-14T03:20:21.043Z",
                "__v": 0
            }
        }
    Error Response:
        Code: 404
        Content: {message: 'Todo not found!'}
        Code: 500
        Content: {message: 'Internal Server Error'}
