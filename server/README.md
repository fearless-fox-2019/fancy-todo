
**Fancy Todo**
----------------------------------------

## Endpoint

baseUrl = http:localhost:3000/

#### User Routes
| Routes| Method | Request Body | Response Data | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/users/register`| POST | `{ fullname, username, email, password }` | `{ access_token }`|Register a new user|
| `/users/login` | POST | `{ email, password }`| `{ token }`|Log in and get an email verification!|
| `/users/signin-google` | POST | `{ token(google) }` | `{ ntoken }` | |Sign in with Google|
| `/users/dashboard` | GET | | `${ fullname, username, email, (if any) picture}` | Upon Log in, will carry basic information about User |

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
