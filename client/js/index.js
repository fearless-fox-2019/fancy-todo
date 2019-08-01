// const baseUrl='http://104.197.237.157'
const baseUrl='http://localhost:3000'


var token = localStorage.getItem('token')
var user = localStorage.getItem('user')

$('#loginForm').on('submit', function() {
    console.log('masuk ke login ajax client')
    event.preventDefault();
    let email = $('#email').val()
    let password = $('#password').val()
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/login',
        data: {
            email: email,
            password: password
        }
    })
    .done(function(data) {
        // console.log(JSON.stringify(data), 'ini json stringifyyyyyyyyyyyyy')
        isToken()
        localStorage.setItem('token', data.token)
        // console.log(data.token, 'ini DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA TOKENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN')
        localStorage.setItem('user',JSON.stringify(data.details))
    })
    .fail(function(err) {
        console.log(err);
    })
})


$('#signForm').on('submit', function() {
    console.log('masuk ke ajax register function')
    event.preventDefault();
    let name_ = $('#name-sign').val()
    let email_ = $('#email-sign').val()
    let password_ = $('#password-sign').val()
    console.log(name_,email_,password_)
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/users/register',
        // data: $(this).serialize(),
        data: {
            name : name_,
            email: email_,
            password: password_
        }
    })
    .done(function(data) {
       console.log(data)
    })
    .fail(function(err) {
        console.log(err);
    })
})

$('#todoForm').on('submit', function() {
    console.log('masuk ke ajax todo Create Function')
    event.preventDefault();
    let todoTitle_ = $('#todoTitle').val()
    let todoDescription_ = $('#todoDescription').val()
    let todoDueDate_ = $('#todoDuedate').val()
    console.log(todoTitle_,todoDescription_,todoDueDate_)
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/todos/',
        // data: $(this).serialize(),
        headers:{
            token: localStorage.token
        },
        data: {
            title : todoTitle_,
            description: todoDescription_,
            dueDate : todoDueDate_
        }
    })
    .done(function(data) {
       console.log(data)
      //  $('#createTodo').hide()
       isToken()
    })
    .fail(function(err) {
        console.log(err);
    })
})

// $('#editForm').on('submit', function() {
//   console.log('masuk ke ajax todo Edit Function')
//   event.preventDefault();
  // let id = todo.id
  function submitEdit(id){
    event.preventDefault();
  // let todoid = id
  let editTitle_ = $('#editTitle').val()
  let editDescription_ = $('#editDescription').val()
  let editDueDate_ = $('#editDuedate').val()
  console.log(id,'ini IDDDDDDDDDDDD')
  console.log(editTitle_,editDescription_,editDueDate_)
  $.ajax({
      method: 'PATCH',
      url: `${baseUrl}/todos/${id}`,
      headers:{
          token: localStorage.token
      },
      data: {
          title : editTitle_,
          description: editDescription_,
          dueDate : editDueDate_
      }
  })
  .done(function(data) {
     console.log(data)
     console.log('berhasil edit Todo')
    //  $('#createTodo').hide()
     isToken()
  })
  .fail(function(err) {
      console.log(err);
  })
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var idToken = googleUser.getAuthResponse().id_token;
    
    $.ajax({
        url:"http://localhost:3000/users/googleSignIn",
        method:"POST",
        data:{
            idToken : idToken
        }
    })
    .done(response => {
        console.log(response)
        localStorage.setItem("token", response.token);
        console.log(JSON.stringify(response))
        console.log('sampai di done googlesignin')
        isToken()
    })
    .fail((jqXHR, textStatus) => {
        console.log(jqXHR, textStatus);
      });
}

function signout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log("User signed out.");
    });
    localStorage.clear()
    $('#loginPage').show()
    $('#navbar').hide()
    $('#signOut').hide()
    $('#todo').hide()
    $('#archived').hide()
    $('#todoList').hide()
    $('#onProgressList').hide()
    $('#finishedList').hide()
    $('#archivedList').hide()
    $('#archive').hide()
}

function isToken() {
    console.log(token)
    console.log(user)
    $('#loginPage').hide()
    $('#registerPage').hide()
    $('#todo').show()
    $('#archived').hide()
    $('#navbar').show()
    $('#signOut').show()
    $('#todoList').show()
    $('#onProgressList').show()
    $('#finishedList').show()
    $('#archivedList').hide()
    $('#archive').show()
    $('#backtotodo').hide()
    fetchMyTodo()
}

function changeToRegister() {
    $('#registerPage').show()
    $('#loginPage').hide()
    $('#navbar').hide()
    $('#signout').hide()
    $('#todo').hide()
    $('#todoList').hide()
    $('#onProgressList').hide()
    $('#finishedList').hide()
    $('#archived').hide()
    $('#archivedList').hide()
    $('#archive').hide()
    // $('#todo').hide()
    // $('#todo').hide()
}

function changeToLogin() {
    $('#registerPage').hide()
    $('#loginPage').show()
    $('#navbar').hide()
    $('#signout').hide()
    $('#todo').hide()
    $('#todoList').hide()
    $('#onProgressList').hide()
    $('#finishedList').hide()
    $('#archived').hide()
    $('#archivedList').hide()
    $('#archive').hide()
}

function archive() {
  $('#registerPage').hide()
  $('#loginPage').hide()
  $('#navbar').show()
  $('#signout').show()
  $('#todo').hide()
  $('#todoList').hide()
  $('#onProgressList').hide()
  $('#finishedList').hide()
  $('#archived').show()
  $('#archivedList').show()
  $('#archive').hide()
  $('#backtotodo').show()
  fetchMyTodo()
}


function fetchMyTodo(){
    $.ajax({
      url: `${baseUrl}/todos/`,
      method: 'GET',
      headers:{
        token: localStorage.token
      }
    })
    .done(todos =>{
      $('#todoList').empty()
        console.log(todos)
      if(todos.length<1){
        $('#todoList').append(`
            <div class="row" >
              <div class="col s12 m6">
                <div class="card horizontal" style="width: 290px; background-color: #ef5350">
                  <div class="card-content black-text" style="text-align:center">
                    <h6 style="font-weight: bold; margin-left: 60px;">Please Add New Todo</6>
                  </div>
                </div>
              </div>
            </div>
        `)
      }else{
        $('#todoList').empty()
        $('#onProgressList').empty()
        $('#finishedList').empty()
        $('#archivedList').empty()
        console.log('masuk ke else lebih dari 1')
          todos.forEach(todo =>{
            if(todo.category == 'Todo'){
            $('#todoList').append(`
                <div class="row" style="margin: 0 auto" >
                  <div class="col s12 m6">
                    <div class="card" style="width: 300px; margin: 10px; background-color: #e6ee9c ; ">
                      <div class="card-image">
                        <a onclick="removeTodo('${todo._id}','${todo.name}')" class="btn-flat" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px;">
                          <i class="fas fa-times"></i>
                        </a>
                      </div>
                      <div class="card-content black-text" style="margin: 0 auto; line-height: 1.5; height:130px;">
                        <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -15px;"><u>${todo.title}</u></span>
                        <p style="font-size: 14px; margin-top:-5px">${todo.description}</p>
                        <p style="font-size: 14px; margin-top:-5px"><i><b>Status : ${todo.category}</i></b></p>
                        <p style="font-size: 14px;">Deadline: ${new Date(todo.dueDate).toLocaleDateString('en-US',
                                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div class="row" >
                        <div class="col s6">
                          <center>
                          <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #2F66A9" data-toggle="modal" data-target="#editTodo">Edit</button>
                          </center>
                        </div>
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #DC143C" onclick="deleteTodo('${todo._id}')">Delete</button>
                          </center>
                        </div>
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="background-color: #558b2f" onclick="updateStatus('${todo._id}', 'Progress')">Do It Now!</button>
                          </center>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `)
          }
          else if(todo.category == 'Progress'){
            $('#onProgressList').append(`
                <div class="row" style="margin: 0 auto" >
                  <div class="col s12 m6">
                    <div class="card" style="width: 300px; margin: 10px; background-color: #e6ee9c ; ">
                      <div class="card-content black-text" style="margin: 0 auto; line-height: 1.5; height:130px;">
                        <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -15px;"><u>${todo.title}</u></span>
                        <p style="font-size: 14px; margin-top:-5px">${todo.description}</p>
                        <p style="font-size: 14px; margin-top:-5px"><i><b>Status : ${todo.category}</i></b></p>
                        <p style="font-size: 14px;">Deadline: ${new Date(todo.dueDate).toLocaleDateString('en-US',
                                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div class="row" >
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #2F66A9" data-toggle="modal" data-target="#editTodo">Edit</button>
                          </center>
                        </div>
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #DC143C" onclick="deleteTodo('${todo._id}')">Delete</button>
                          </center>
                        </div>
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="background-color: #558b2f" onclick="updateStatus('${todo._id}', 'Finished')">Finished!</button>
                          </center>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `)
          }
          else if(todo.category == 'Finished'){
            $('#finishedList').append(`
                <div class="row" style="margin: 0 auto" >
                  <div class="col s12 m6">
                    <div class="card" style="width: 300px; margin: 10px; background-color: #e6ee9c ; ">
                      <div class="card-content black-text" style="margin: 0 auto; line-height: 1.5; height:130px;">
                        <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -15px;"><u>${todo.title}</u></span>
                        <p style="font-size: 14px; margin-top:-5px">${todo.description}</p>
                        <p style="font-size: 14px; margin-top:-5px"><i><b>Status : ${todo.category}</i></b></p>
                        <p style="font-size: 14px;">Deadline: ${new Date(todo.dueDate).toLocaleDateString('en-US',
                                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div class="row" >
                        <div class="col s6">
                          <center>
                          <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #2F66A9" data-toggle="modal" data-target="#editTodo">Edit</button>
                          </center>
                        </div>
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #DC143C" onclick="deleteTodo('${todo._id}')">Delete</button>
                          </center>
                        </div>
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="background-color: #FFA500" onclick="updateStatus('${todo._id}', 'Archived')">Archive It!</button>
                          </center>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `)
          }
          else if(todo.category == 'Archived'){
            $('#archivedList').append(`
                <div class="row" style="margin: 0 auto" >
                  <div class="col s12 m6">
                    <div class="card" style="width: 300px; margin: 10px; background-color: #e6ee9c ; ">
                      <div class="card-content black-text" style="margin: 0 auto; line-height: 1.5; height:130px;">
                        <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -15px;">${todo.title}</span>
                        <p style="font-size: 14px; margin-top:-5px">${todo.description}</p>
                        <p style="font-size: 14px; margin-top:-5px">${todo.category}</p>
                        <p style="font-size: 14px;">Deadline: ${new Date(todo.dueDate).toLocaleDateString('en-US',
                                            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div class="row" >
                        <div class="col s6">
                          <center>
                            <button type="button" class="btn btn-primary" style="margin-bottom: 10px; background-color: #DC143C" onclick="deleteTodo('${todo._id}')">Delete</button>
                          </center>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `)
          }
        })
      }
    })
    .fail(err =>{
      console.log('masuk errror fetch mytodo')
      console.log(err);
    })
  }

  function deleteTodo(id){
    console.log(id);
    Swal.fire({
      title: "Are You sure delete this task? you can't undo this",
      text: name,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sure!'
    })
    .then((result) => {
      if(result.value){
        console.log('masuk remove todo', id)
        $.ajax({
          url: `${baseUrl}/todos/${id}`,
          method: 'delete',
          headers:{
            token: localStorage.token
          }
        })
        .done(response =>{
          Swal.fire({
            position: 'center',
            type: 'success',
            title: `Success Delete Task ${name}`,
            showConfirmButton: false,
            timer: 1200
          })
          fetchMyTodo()
        })
      }else{
          Swal.fire({
            position: 'center',
            type: 'error',
            title: `Cancelling Deleting Task ${name}`,
            showConfirmButton: false,
            timer: 1200
          })
        }
      })
        .fail(err =>{
          console.log('error delete todo')
          console.log(err)
        })
      }


  function updateStatus(id, category){
    console.log('ini id todo', id);
    console.log(`${baseUrl}/todos/${id}`);
    Swal.fire({
      title: "Are You sure you will update this task?, you can't undo this",
      text: name,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sure!'
    })
    .then((result) => {
      if(result.value){
        $.ajax({
          url:`${baseUrl}/todos/${id}`,
          method: 'patch',
          data:{
            category: category
          },
          headers:{
            token: localStorage.token
          }
        })
        .done(response =>{
          Swal.fire({
            position: 'center',
            type: 'success',
            title: `Success Update Task ${name}`,
            showConfirmButton: false,
            timer: 1200
          })
          fetchMyTodo()
        })
      }else{
        Swal.fire({
          position: 'center',
          type: 'error',
          title: `Cancelling Update Task ${name}`,
          showConfirmButton: false,
          timer: 1200
        })
      }
    })
    .fail(err =>{
      console.log('masuk error update finish');
      console.log(err);
    })
}

$(document).ready(function () {
    if (token) {
        isToken()
    } else {
        $('#registerPage').show()
        $('#loginPage').hide()
        $('#navbar').hide()
        $('#signOut').hide()
        $('#todo').hide()
        $('#todoList').hide()
        $('#onProgressList').hide()
        $('#finishedList').hide()
    }
})