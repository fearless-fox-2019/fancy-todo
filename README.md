**Fancy Todo**
----------------------------------------
## Endpoint
baseUrl = http:localhost:3000
### Not requires a Token : 
#### User Routes
| `Routes`| `Method` | `Request Body` | `Response Data`| `Response Error` | `Description` |
|----------------------|--------|-----------------------------|-----------------------------------|--|---------------------------------------------------------------|
| /users/register| POST | { name, email, password } | { access_token } | 400(email has been registered!) <br>400(email format is wrong!)<br> 400(email required!)<br> 400(password length more than 6 characters!)<br> 400(password required!)|Register a new user|
| /users/login | POST | { email, password }| { name, access_token }| 400(email/password wrong!) |Log in|
| /users/loginGoogle | POST | { id_token } | { name, access_token } | |Sign in with Google|
### Requires a Token :
#### Todo Routes ({ headers: { token } })
| `Routes` | `Method` | `Request Body` | `Response Success` | `Response Error` | `Description`|
|-----------------------------------|--------|----------------------------------|------------------|---------------------|------------------------------------------------------------------------------|
| /todos/uncomplete| GET | - | { data }| 401(Invalid Token) <br> 401(you have to login first!) <br> 500 (Internal Server Error) |  get your Uncomplete ToDo list
| /todos/complete/ | GET | - | { data }| 401 (Invalid Token) <br> 401 (you have to login first!) <br> 500 (Internal Server Error) | Get your completed ToDolist|
| /todos/add | POST | {name,description,due_date,time}| ${success message} | 401(Invalid Token) <br> 401(you have to login first!) <br> 400 (Due Date can't be before today)| Create a new Task! |
| /todos/delete/:id | DELETE | -| { deleted }| 401 (Invalid Token)<br> 401 (you have to login first!) <br> 401 (Unauthorized) <br> 404 (Unauthorized) <br> 500 (Internal Server Error) | Delete a a ToDo List |
| /todos/complete/:id| PATCH | - | { completed } | 401 (Invalid Token)<br> 401 (you have to login first!) <br> 404 (Unauthorized) <br> 500 (Internal Server Error) | Complete a ToDo |
| /todos/edit/:id| PATCH | - | { success } | 401 (Invalid Token)<br> 401 (you have to login first!) <br> 404 (Unauthorized) <br> 500 (Internal Server Error) | Edit todo list data |
| /todos/sendEmail| POST | - | ${ success message }| 401 (Invalid Token)<br> 401 (you have to login first!) <br> 500 (Internal Server Error) | Get an email of all Uncompleted tasks, in case you can't access the web, so you have the backup. |
| /todos/search| POST | - | { data }| 401 (Invalid Token)<br> 401 (you have to login first!) <br> 500 (Internal Server Error) | Search ToDo list by name, the results will be a collection of ToDo lists of everyone and it's name contain input value given. |