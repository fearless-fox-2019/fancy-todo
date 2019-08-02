const baseUrl = `http://35.197.154.197`

function checkLogin(){
    if(localStorage.token){

    } else {

    }
}

function landingPage(){
    $('#home-page').hide()
    $('#navbar').hide()
    $('#form-create').hide()
    $('#form-update').hide()
}


function registerNewUser(){
    event.preventDefault()
    let name =  $('#name-register').val()
    let username = $('#username-register').val()
    let email = $('#email-register').val()
    let password = $('#password-register').val()

    $.ajax({
        method : 'POST',
        url : `${baseUrl}/users/register`,
        data : {
            name , username, email, password
        }
    })
    .done(function(data){
        $('#modal-register').click(function() {
            event.preventDefault()
            $('#register-modal-form').modal('hide');
            Swal.fire(
                'Success!',
                'Your account is already created',
                'success'
                )
            landingPage()
        });
    })
    .fail(function(err){
        Swal.fire({
            type: 'error',
            title: 'Oops... Something went wrong!',
            text: `${JSON.stringify(err.responseJSON)} `
          })
        console.log(err);
    })
}

function login(){
    event.preventDefault()
    let username =  $('#username').val()
    let password = $('#password').val()

    $.ajax({
        method : 'POST',
        url : `${baseUrl}/users/login`,
        data : {username, password}
    })
    .done(function(data){
        console.log(data.token);
        localStorage.setItem('token', data.token)
        $('#form-login').hide()
        getTodosUser()
        $('#navbar').show()
        $('#home-page').show()
    })
    .fail(function(err){
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: err.message
          })
        console.log(err);
    })
}

function getTodosUser(){
    console.log('localStorage.token on getTodosUser',localStorage.token);
    $.ajax({
        method : 'GET',
        url : `${baseUrl}/todos/listTodo`,
        headers : { token : localStorage.token }
    })
    .done(function(data){
        console.log(data, "<<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log('SAMPE SINI');
        
        $('#userProfile').empty()
        $('#userProfile').append(
            `              
            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-user"></i>  ${data.name}
            </button>
             <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" href="#" onclick="editUser()">Edit Profile</a>
            <a class="dropdown-item" href="#" onclick="logout()">Sign Out</a>
          </div>`
        )
            data.listTodo.forEach(element => {
              console.log(element);
              
                if(element.status == true){
                $('#listTodos').append(
                    `<div class="card" style="width: 100%; margin-bottom:10px">
                    <div class="card-body">
                        <div class="row">
                        <div class="col-3">
                        <i class="fa fa-check-square text-center" style="font-size:40px; margin-top:25%; margin-left:33%";></i>
                        </div>
                        <div class="col-9">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.due_date.substring(0,10)}</h6>
                        <p class="card-text">${element.description}</p>
                        <button onclick="formEdit('${element._id}')" type="button" class="btn btn-primary">Edit</button>
                        <button onclick="deleteTodo('${element._id}')" type="button" class="btn btn-danger">Delete</button>
                        </div>
                        </div>
                        </div>
                  </div>`
                  )
              } else {
                $('#listTodos').append(
                    `<div class="card" style="width: 100%; margin-bottom:10px">
                    <div class="card-body">
                        <div class="row">
                        <div class="col-3"></div>
                        <div class="col-9">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.due_date.substring(0,10)}</h6>
                        <p class="card-text">${element.description}</p>
                        <button onclick="formEdit('${element._id}')" type="button" class="btn btn-primary">Edit</button>
                        <button onclick="deleteTodo('${element._id}')" type="button" class="btn btn-danger">Delete</button>
                        </div>
                        </div>
                        </div>
                  </div>`
                  )
            }
        });
    })
    .fail(function(err){
        $('#listTodos').append(
            `<h4 class="text-center "style="margin:auto;"> Oops, you don't have any to-do-list, make a new one!</h4>`
        )
    })
}

function formEdit(id){
    console.log("masuk form edit");
    
    console.log(id);
    
    $.ajax({
        method : `GET`,
        url : `${baseUrl}/todos/editTodo/${id}`,
        headers : {token : localStorage.token}
    })
    .done(function(data){
        $('#home-page').hide()
        $('#listTodos').empty()
        $('#get-data-update').append(`
        <div>
        <h2>Edit Todo</h2>
        <form>
        <div class="form-group">
        <input type="text" class="form-control" id="title" value="${data.name}">
        </div>
        <div class="form-group">
        <label for="description">Description</label>
        <input type="textarea" class="form-control" id="description" value="${data.description}">
        </div>
        <div class="form-group">
        <label for="due-date">Due Date</label>
        <input type="date" class="form-control" id="duedate" placeholder="${data.due_date.substring(0,10)}">
        </div>
        <div class="form-check">
        <input type="checkbox" class="form-check-input" id="statusCheck">
        <label class="form-check-label" for="exampleCheck1">Done</label>
        </div>
        <button type="submit" class="btn btn-primary" onclick="submitEditTodo('${data._id}')" >Submit</button>
        </form>
        </div>`)
        
        $('#duedate').val(data.due_date.substring(0,10))
    })
    .fail(function(err){
        console.log(err);
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: err.message
          })
        console.log(err);
    })
}

function searchTodo(){
    event.preventDefault()
    let keyword = $('#keyword-todo').val()
    $.ajax({
        method : 'GET',
        url : `${baseUrl}/todos/listTodo/${keyword}`,
        headers : { token : localStorage.token }
    })
    .done(function(data){
        console.log(data);
        
        $('#listTodos').empty()
        data.forEach(element =>{
            if(element.status == true){
                $('#listTodos').append(
                    `<div class="card" style="width: 100%; margin-bottom:10px">
                    <div class="card-body">
                        <div class="row">
                        <div class="col-3">
                        <i class="fa fa-check-square text-center" style="font-size:40px; margin-top:25%; margin-left:33%";></i>
                        </div>
                        <div class="col-9">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.due_date.substring(0,10)}</h6>
                        <p class="card-text">${element.description}</p>
                        <button onclick="formEdit('${element._id}')" type="button" class="btn btn-primary">Edit</button>
                        <button onclick="deleteTodo('${element._id}')" type="button" class="btn btn-danger">Delete</button>
                        </div>
                        </div>
                        </div>
                  </div>`
                  )
              } else {
                $('#listTodos').append(
                    `<div class="card" style="width: 100%; margin-bottom:10px">
                    <div class="card-body">
                        <div class="row">
                        <div class="col-3"></div>
                        <div class="col-9">
                        <h5 class="card-title">${element.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${element.due_date.substring(0,10)}</h6>
                        <p class="card-text">${element.description}</p>
                        <button onclick="formEdit('${element._id}')" type="button" class="btn btn-primary">Edit</button>
                        <button onclick="deleteTodo('${element._id}')" type="button" class="btn btn-danger">Delete</button>
                        </div>
                        </div>
                        </div>
                  </div>`
                  )
            }
        })
    })
    .fail(function(err){

    })
}

function addNewTodo(){
    $('#home-page').hide()
    $('#form-create').show()
}

function createTodo(){
    event.preventDefault()
    let name = $('#title').val()
    let description = $("#description").val()
    let due_date = $("#duedate").val()
    let newTodo = {name,description,due_date}
    console.log(newTodo);
    $.ajax({
        method : 'POST',
        url : `${baseUrl}/todos/createtodo`,
        data : newTodo,
        headers : {token : localStorage.token}
    })
    .done(function(data){
        console.log(data);
        $('#form-create').hide()
        $('#home-page').show()
        $('#listTodos').empty()
        getTodosUser()
    })
    .fail(function(err){
        console.log(err);
        Swal.fire({
            type: 'error',
            title: 'Oops... Something went wrong!',
            text: `${JSON.stringify(err.responseJSON)} `
          })
        console.log(err);
    })
}

function submitEditTodo(id){
    event.preventDefault()
    let name = $('#title').val()
    let description = $("#description").val()
    let status = $("#statusCheck").val()
    let due_date = $("#duedate").val()
    let statusTodo
    if(status == 'on') statusTodo = true
    else statusTodo=false
    let newUpdateTodo = {name, description, statusTodo, due_date}
    $.ajax({
        method : 'PUT',
        url : `${baseUrl}/todos/editTodo/${id}`,
        data : newUpdateTodo,
        headers : {token : localStorage.token}
    })
    .done(function(data){
        $('#home-page').show()
        $('#form-update').hide()
        getTodosUser()
    })
    .fail(function(err){
        console.log(fail);
    })
}

function deleteTodo(id){
    event.preventDefault()
    console.log(`${baseUrl}/todos/deleteTodo/${id}`);
    
    $.ajax({
        method : 'DELETE',
        url : `${baseUrl}/todos/deleteTodo/${id}`,
        headers : { token : localStorage.token }
    })
    .done(function(data){
        $('#listTodos').empty()
        getTodosUser()
        
    })
    .fail(function(err){
        console.log(err);
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: err.message
          })
        console.log(err);
    })
}

function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    
    $.ajax({
        method: "POST",
        url: `${baseUrl}/users/loginGoogle`,
        data: {
            id_token : id_token
        }
      })
      .done(function(ticket){
        console.log("donee");
        console.log(ticket);

        localStorage.setItem('token', ticket.token)
        $('#form-login').hide()
        getTodosUser()
        $('#navbar').show()
        $('#home-page').show()
      })
      .fail(function(err) {
          console.log("fail");
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: err.message
          })
        console.log(err);
          console.log(err);
      })
  }


function logout(){
    var auth2 = gapi.auth2.getAuthInstance();
    if(auth2){
        auth2.signOut().then(function () {
            localStorage.removeItem('token')
            landingPage()
            $('#login').show()
            $('#navbar').hide()
            // $('#userProfile').empty()
            $('#home-page').hide()
            $('#listTodos').empty()
            $('#form-login').show()
        })
    } else {
        localStorage.removeItem('token')
        landingPage()
        $('#login').show()
        $('#navbar').hide()
        $('#home-page').hide()
        // $('#userProfile').empty()
        $('#listTodos').empty()
        $('#form-login').show()
    }
}

$(document).ready(function(){
    landingPage()
})