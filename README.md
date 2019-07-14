# **Fancy-Todo**

### List of todos routes:
Route | HTTP | Header(s) | Body | Description 
------------ | ------------- | ------------- | ------------- | ------------- 
/repo/todos | GET | token:String | none | Get list of todos info 
/repo/todos/:id | GET | token:String | none | Get single todos info
/repo/todos | POST | token:String | title:String, description:String, status:String, duedate:String | Create a todos
/repo/todos/:id | PUT | token:String | title:String, description:String, status:String, duedate:String | Update a todos
/repo/todos/:id | DELETE | token:String | none | Delete a todos

### List of users routes:
Route | HTTP | Header(s) | Body | Description 
------------ | ------------- | ------------- | ------------- | ------------- 
/users/signin/ | POST | none | email:String, password:String | SignIn User
/users/signup/| POST | none | email:String, password:String | Register User
/users/gsignin/| POST | none | token:String | Sign in with google

### List of projects routes:
Route | HTTP | Header(s) | Body | Description 
------------ | ------------- | ------------- | ------------- | ------------- 
/projects/signin/ | POST | none | email:String, password:String | SignIn User
/projects/signup/| POST | none | email:String, password:String | Register User
/projects/gsignin/| POST | none | token:String | Sign in with google

* $ npm install
* $ npm run dev