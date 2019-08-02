# fancy-todo

### Make sure you have Node.js and npm installed in your device, and run these commands:

+ npm install
+ npm run start

## TODO List

### Welcome to TODO List
#### Here is the guidelines of TODO List :
#### List of User routes:

|_Route_|_HTTP_|_Headers_|_Body_|_Description_|
|-----|-----|-----|-----|-----|
|/users/register|POST|none|name:String(*Mandatory*), email:String(*Mandatory*), password:String(*Mandatory*)|Sign up with new user info|
|/users/login|POST|none|email:String(*Mandatory*), password:String(*Mandatory*)|Sign in and get an access token|
|/users/googleSignIn|POST|none|none|Need to signed in through google Account and get an access token|

## List of Todo routes:

|_Route_|_HTTP_|_Headers_|_Body_|_Description_|
|-----|-----|-----|-----|-----|
|/todos|GET|token|none|Get all todo list info (owned by user)|
|/todos/:id|GET|token|none|Get info for single todo base on ID (authorized person, only able to access your own Todo)|
|/todos|POST|token|title:String(*Mandatory*), description:String(*Mandatory*)|Create/Insert a todo into the list|
|/todos/:id|DELETE|token|none|Delete a todo from the list base on ID (authorized person, only able to delete your own Todo)|
|/todos/:id|PATCH|token|title:String, description:String|Update todo partially base on ID (blank field will be filled with old data, only able to update your own Todo)|


#### Archived Page
Page for archived Todo
