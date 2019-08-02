# fancy-todo
## My App Name
My Todo List build with Express and Mongoose

## List of basic routes:

| Route  | HTTP | Headers(s) | Body | Description         |
| ------ | ---- | ---------- | ---- | ------------------- |
| http://localhost:3000/users/register   | POST  | None       | register | register manually (input from body)
| http://localhost:3000/users/login   | POST  | none       | login | login manually (input from body)
| http://localhost:3000/users/login/google   | token  | None       | None | register/login using google
| http://localhost:3000/users/allUsers   | GET  | token       | None | get all user data (for project)
| http://localhost:3000/todos   | GET  | token       | None | Get all todo by user Id
| http://localhost:3000/todos/create   | POST  | token       | todo | Create new todo by signed user
| http://localhost:3000/todos/delete   | POST  | token       | None | Delete todo by signed user
| http://localhost:3000/todos/update   | POST  | token       | None | Mark todo as finished / unfinished
| http://localhost:3000/weathers   | GET  | token       | None | Fancy, inform the weather in Jakarta

GOOGLE_CLIENT_ID=38893530788-p9mbaml2k7bq02jifa52f6juei0i3st6.apps.googleusercontent.com