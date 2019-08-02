
**Fancy Todo**
----------------------------------------

## Endpoint

baseUrl = http:localhost:3000/

## User Routes
#### User SignUp
| Routes| Method | Request Body | Response Data | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/users/signup`| POST | `{ fullname, username, email, password }` | `{ access_token }`|Register a new user|

#### Return
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMzJlNzQ1YzY1MWFmM2IwZDJiYmEwMiIsImVtYWlsIjoiYmFnYXNwdXRyby5pcnNoYWRpQGdtYWlsLmNvbSIsImlhdCI6MTU2Mzc1NjI5M30.PUD3zcTRrdU_PfgHcYKG0IuB6A4IIcWg2Q7PBOuOjrk",
    "loggedUser": {
        "username": "irshadi",
        "fullname": "Irshadi Bagasputro"
    }
}
#### User Validation
Fullname : <br>
<ul>
  <li> Alphabet and Space Only
  <li> Required
Username : <br>
<ul>
  <li> Alphabet and Several Symbols ('.', '_' or '-')
  <li> Minimum Character : 6
  <li> Must Be Unique
  <li> Required
Email : <br>
<ul>
  <li> Required
Password : <br>
<ul>
  <li> Alphabet and Numeric
  <li> Minimum Character : 8
  <li> Must Be Unique
  <li> Required

#### Todo Routes
| Routes | Method | Request Body | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/todos/create`| POST | -| `{ data }`| Create Todo List
| `/todos/all` | GET | `{name,description,dueDate,isFinished,createdAt,updatedAt}`| Get All Todo List, based on Logged User |
| `/todos/pending` | GET | `{name,description,dueDate,isFinished,createdAt,updatedAt}`| Get Pending Todo List, based on Logged User |
| `/todos/completed` | GET | `{name,description,dueDate,isFinished,createdAt,updatedAt}`| Get Complete Todo List, based on Logged User |
| `/todos/complete` | PATCH | `{id}`| Update Todo to Done Status |
| `/todos/delete` | DELETE | `{id}`| Delete Todo with Finished Status |
| `/todos/find` | GET | `{(used req.query)}`| Find Todo where  'NAME' like 'input' |
