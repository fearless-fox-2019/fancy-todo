# How to use Fancy Todo's API

All the route used in this API using url: http://localhost:3000

Here are some routes to use:

| Router  | HTTP  | Headers  | Body  | Request  | Response  |
|---|---|---|:-:|---|---|
| /users/login  | POST | None | email: string<br>password: string  | Body | success: Enter user-page<br>error: invalid input |
| /users/login-google | POST | None | token:string<br>(Google token) |   | success: Enter user-page<br>error: invalid |
| /users/register | POST | None | name: string<br>email: string<br>password: string | body | success: token notification<br>error: invalid input |
| /users/todos | GET | token:string | None  | headers | success:user todos<br>error:no authentication |
| /todos/add | POST | token:string  | name:string<br>description:string<br>due_date:date | body | success: todo<br>error: invalid input |
| /todos/:todoId/update | PATCH | token:string | None | params | success: updated todo<br>error: unauthorized |
| /todos/:todoId/delete | DELETE | token:string | None | params | success: deleted todo<br>error: unauthorized |
| /todos/search | GET | token:string | None | query | success: searched todos<br>error: no authentication |
