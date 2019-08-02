# fancy-todo

#### FANCY TODO LIST built Express and Monggose in server.

### User

Routes | HTTP | Body | Description | Error Response  | 
------ | ---- | ---- | ----------- | -----------
/api/users/signup | POST | username:String, email:String, password:String | Register new user | username is empty 400, email is empty 400, password is empty 400
/api/users/signin | POST | username:String,password:String | Logging in user | username/password invalid 401
/api/users/signin/google | POST | google account | Logging in user with google account
/api/users/confirmaton/:token | GET | token and email user | Confirmation email verification


### Todo

Routes | HTTP | Body | Description | Error Response  | Middlewares
------ | ----- | ----- | -------- | -------- | ---
/api/todos | GET | none | Show the todos | none |  Login Authentication
/api/todos/:id | GET | none | Get a single todo info | none | Login Authentication 
/api/todos | POST | name:String, description:Stringuser:[user] status:Boolean, category:string, dueDate:Date| Create new todo | error 400 on name,desription,category,dueDaate and 401 login | Login Authenthication
/api/todos/:id | DELETE | none | Delete by id | none |  Login Authentication & Authorization by owner only 
/api/todos/:id | PUT | input new updated data | Edit your list (will change the whole data) |  error 401 on  name,desription,category,dueDaate, login  |  Login Authentication & Authorization by owner only
/api/todos/category/filter? | GET | none | Get filter by category | none | Login Authentication

## Usage
 Make sure you have Node.js and npm installed in your computer, and then run these commands:
 ```
 $ npm install
 $ npm run dev
 ```

 Access the Web via http://fancy-todo.muhrezbas.xyz

