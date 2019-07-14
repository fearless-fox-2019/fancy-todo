**Fancy Todo**
----------------------------------------

## Endpoint

baseUrl = http:localhost:3000/api
### *Doesn't Require Token*

#### User Routes
| Routes| Method | Request Body | Response Data| Response Error | Description |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| `/users/register`| POST | `{ username, email, password }` | `{ access_token }` | 400 (`{email}` has been registered!) <br>400 (`{email}` is not a valid email!) <br>  (`${username}` has been registered!)|Register a new user|
| `/users/login` | POST | `{ email, password }`| `{ name, access_token }`| 400 (Wrong email/password) |Log in and get an email verification!|
| `/users/googleSignIn` | POST | `{ id_token }` | `{ name, newPass, access_token }` | |Sign in with Google and get a new password! |
| `users/confirmation/:token` | GET | | `${token, email}` | 401 `${token}` confirmation is wrong! | Get verification link sent to your email! |

### Token is required!

#### Todo Routes (`{ headers: { token } }`)
| Routes | Method | Request Body | Response Success | Response Error | Description|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| `/todos/listTodo`| GET | -| `{ data }`| 401(Invalid Token) <br> 401(Please Login) <br> 404 (wrong User) <br> 500 (Internal Server Error) |  get your todoList according to your User
| `/todos/createTodo` | POST | `{name,description,dueDate}`| `${success message}` | 401(Invalid Token) <br> 401(Please Login) <br> 404 (Wrong User) <br> 400 (DueDate must be more than today)| Create a new Task! |
| `/todos/deleteTodo/:id` | DELETE | -| `{ deleted }`| 401 (Invalid Token)<br> 401 (Please Login) <br> 401 (Unauthorized) <br> 404 (Wrong User) <br> 500 (Internal Server Error) | Delete a a Todo List |
| `/todos/completeTodo/:id`| PATCH |  | `{ completed }`| 401 (Invalid Token)<br> 401 (Please Login) <br> 404 (Wrong User) <br> 500 (Internal Server Error) | Complete a ToDo |
| `/todos/favouriteTodo/:id` | PATCH| -| `{ favourite }`| 401 (Invalid Token) <br> 401 (Please login ) <br> 401 Unauthorized <br> 404 (Wrong User) <br> 500 (Internal Server Error) | Favourite a ToDo |
| `/todos/filter(req.query)` | GET | - | `${filteredData}` | 401(Invalid Token) <br> 401(Please login) <br> 404(Wrong User) <br> 500 (Internal Server Error) | Search a Todo based on their name |
