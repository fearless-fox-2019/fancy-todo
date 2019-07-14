var todos = []
$(document).ready(function() {
  if (localStorage.token) {
    $('#form-login').hide()
    $('#form-register').hide()
    $('#edittodo').hide()
    $('#createtodo').hide()
    $('#content-page').show()
    ambilDataTodo() 
  } else {
    $('#form-login').show()
    $('#form-register').hide()
    $('#content-page').hide()
    $('#edittodo').hide()
    $('#createtodo').hide()
  }
})
  $('#btnRegister').click(function() {
      event.preventDefault()
  })
  $('#subregister').click(function() {
      event.preventDefault()
      register()
  })
  $('#btnLogin').click(function() {
      event.preventDefault()
      login()
  })
  $('#sublogin').click(function() {
    event.preventDefault()
    $('#form-register').hide()
    $('#form-login').show()
  })
  $('#btnCreate').click(function() {
    event.preventDefault()
    $('#content-todo').hide()
    $('#content-pick').hide()
    $('#createtodo').show()
  })
  $('#btnFinishedCreate').click(function() {
    event.preventDefault()
    ambilDataTodo()
    $('#createtodo').hide()
    $('#content-todo').show()
  })
  $('#btnAll').click(function() {
    event.preventDefault()
    ambilDataTodo()
    $('#content-todo').show()
  })
  $('#btnNew').click(function() {
    event.preventDefault()
    $('#allTodos').empty()
    statusNew()
  })
  $('#btnProgress').click(function() {
    event.preventDefault()
    $('#allTodos').empty()
    statusProgress()
  })
  $('#btnFinished').click(function() {
    event.preventDefault()
    $('#allTodos').empty()
    statusFinished()
  })
  $('#searchTodo').keypress(function(event){
    const title = $('#searchTodo').val()
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      event.preventDefault()
      $('#allTodos').empty()
      searchTodos(title)
    }
  })
  $('#btnEdit').click(function() {
    event.preventDefault()
    editTodoForm()
    // masih harus refresh
  })

// login-register
function login() {
    console.log('masuk login')
    event.preventDefault()
    const email = $('#inemail').val()
    const password = $('#inpassword').val()
    console.log(email, password, '-------')
    $.ajax({
      method: "POST",
      url: `http://localhost:3000/users/login`,
      data:{
        email: email,
        password: password
      }
    })
    .done(function(response) {
      console.log('login', response)
      localStorage.setItem('token', response.jwt)
      $('#content-page').show()
      $('#form-login').empty()
      ambilDataTodo() 

    })
    .fail(function(jqXHR, textStatus){
      console.log(jqXHR, textStatus)
      Swal.fire('Failed Login', `${jqXHR.responseText}`, 'error')
    })
}
function register() {
    event.preventDefault()
    const usernameRegister = $('#regusername').val()
    const emailRegister = $('#regemail').val()
    const passwordRegister = $('#regpassword').val()
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/users`,
        data: {
            username: usernameRegister,
            email: emailRegister,
            password: passwordRegister
        }
    })
        .done(function(response) {
            console.log(response, 'response')
            Swal.fire('Success Register','Yeaay Success Register', 'success')
            loginForm()
        })
        .fail(function(jqXHR, textStatus){
          console.log(jqXHR.responseText, textStatus)
          Swal.fire('Failed Register', `${jqXHR.responseText}`, 'error')
        })
}
function registerForm() {
  event.preventDefault()
  $('#form-login').hide()
  $('#form-register').show()
  $('#fanc').append(
      `
          <h4>Register . . . 🤩</h4>
          <hr>
      `
  )
}
function loginForm() {
    event.preventDefault()
    $('#form-login').show()
    $('#form-register').hide()
}
function signOut() {
  console.log('logout')
  localStorage.clear()
  $('#content-page').hide()
  $('#form-login').show()
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      console.log('User signed out.');
  });
}
// google
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token;
  // console.log(id_token)
  $.ajax({
    method: "POST",
    url: `http://localhost:3000/users/login/google`,
    data: {id_token: id_token}
  })
  .done(function(response) {
    console.log('login-----', response)
    localStorage.setItem('token', response.jwt)
    $('#content-page').show()
    $('#form-login').empty()
    ambilDataTodo() 
  })
  .fail(function(jqXHR, textStatus){
    // console.log(jqXHR, textStatus)
    // Swal.fire('Failed Login !', `${jqXHR.responseText}`, 'error')
  })
}


// ambil todo dari localstorage
function ambilDataTodo() {
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos/user",
    headers: {token: localStorage.token} //kriim headers dari klien hohoho
  })
  .done(function(response) {
    console.log(response)
    $('#allTodos').empty()
    if(!response){
      $('#allTodos').show()
    }else{
      response.data.forEach((element, i) => {
        console.log(response)
        todos = response
        $('#allTodos').append(
            `
            <div class="col-4 rounded-circle">
                <ul class="list-group">
                  <div class="container" style="padding-top: 20px; padding-bottom: 20px">
                    <li class="list-group-item" id="title">
                      <h5 style="text-align: center; margin-bottom: 0px" >${element.name}</h5>
                    </li>
                    <li class="list-group-item">
                      <small><b>Description:</b> ${element.description}</small><br>
                    </li>
                    <li class="list-group-item">
                      <small><b>Created Date:</b> ${element.createdAt}</small><br>
                    </li>
                    <li class="list-group-item">
                      <small><b>Due Date:</b> ${element.due_date}</small><br>
                    </li>
                    <li class="list-group-item">
                      <medium><b>Status:</b> ${element.status}</medium><br>
                    </li>
                    <li class="list-group-item">
                      <button class="btn btn-sm btn-outline-info" type="button"  id="btnEdit" onclick="editTodoForm('${element._id}')">Edit</button>
                      <button class="btn btn-sm btn-outline-info" type="button"  id="btnDelete" onclick="deleteTodo('${element._id}')">Delete</button>
                    </li>
                  </div>
                </ul>
              </div>
            `
        )
      });
    }
  })
  .fail((jqXHR, textStatus) => {
    console.log(jqXHR, textStatus, 'error')
  })
}
// create todo
function createTodo(){
  const name = $('#inname').val()
  const description = $('#indescription').val()
  const due_date = $('#induedate').val()

  console.log(name, description, due_date, 'data')
  $.ajax({
    method: "POST",
    url: "http://localhost:3000/todos",
    headers: {
      token: localStorage.token
    },
    data:{
      name: name,
      description: description,
      due_date: due_date
    }
  })
  .done(response => {
    console.log(response)
    ambilDataTodo()
  })
  .fail(function(jqXHR, textStatus){
    console.log(jqXHR, textStatus)
    Swal.fire('Failed Login', `${jqXHR.responseText}`, 'error')
  })
}
// update todo
function editTodo(index) {
  let name = $('#editinname').val()
  let description = $('#editindescription').val()
  let status = $('#selectStatus').val()
  let due_date = $('#editinduedate').val()
  const data = {
    name,
    description,
    status,
    due_date
  }
  $.ajax({
    method: "PATCH",
    url: `http://localhost:3000/todos/${index}`,
    headers: {
      token: localStorage.token
    },
    data: data
  })
  .done(function(response){
    ambilDataTodo()
    $('#allTodos').show()
    $('#edittodo').hide()
  })
  .fail(function(jqXHR, textStatus){
    console.log(jqXHR, textStatus)
    Swal.fire('Failed Update', `${jqXHR.responseText}`, 'error')
  })
}
function editTodoForm(id) {
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/id/${id}`,
    headers: {
      token: localStorage.token
    }
  })
  .done(function (response){
    let element = response.data
    element.due_date = element.due_date.slice(0, 10)
      event.preventDefault()
      $('#content-todo').hide()
      $('#content-pick').hide()
      $('#createtodo').hide()
      $('#allTodos').hide()
      $('#edittodo').show()
      $('#editinname').val(`${element.name}`)
      $('#editindescription').val(`${element.description}`)
      $('#editinstatus').val(`${element.status}`)
      $('#editinduedate').val(`${element.due_date}`)
      $('#btnedit').empty()
      $('#btnedit').append(
        `
          <button onclick="editTodo('${element._id}')" type="submit" class="btn btn-sm btn-outline-success">Finished ... </button>
        `
      )
  })
  .fail(function(jqXHR, textStatus){
    console.log(jqXHR, textStatus)
    Swal.fire('Failed Update', `${jqXHR.responseText}`, 'error')
  })
}
//delete todo
function deleteTodo(index) {
  $.ajax({
    method: "DELETE",
    url: `http://localhost:3000/todos/${index}`,
    headers: {
      token: localStorage.token
    }
  })
  .done(function(){
    ambilDataTodo()
    Swal.fire('Success Delete','Yeaay Success Delete', 'success')    
  })
  .fail(function(jqXHR, textStatus){
    console.log(jqXHR, textStatus)
    Swal.fire('Failed Delete', `${jqXHR.responseText}`, 'error')
  })
}
// get by status
function statusNew() {
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/status/new`,
    headers: {token: localStorage.token} //kriim headers dari klien hohoho
  })
  .done(function(response) {
    console.log(response)
    response.data.forEach((element, i) => {
      console.log(response)
      todos = response
      $('#allTodos').show()
      $('#allTodos').append(
          `
          <div class="col-4 card"">
              <ul class="list-group">
                <div class="container" style="padding-top: 20px; padding-bottom: 20px">
                  <li class="list-group-item" id="title">
                    <h5 style="text-align: center; margin-bottom: 0px" >${element.name}</h5>
                  </li>
                  <li class="list-group-item">
                    <small><b>Description:</b> ${element.description}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Created Date:</b> ${element.createdAt}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Due Date:</b> ${element.due_date}</small><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Status:</b> ${element.status}</medium><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Action: </b></medium><br>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnEdit" onclick="editTodoForm('${element._id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnDelete" onclick="deleteTodo('${element._id}')">Delete</button>
                  </li>
                </div>
              </ul>
            </div>
          `
      )
    });
  })
  .fail((jqXHR, textStatus) => {
    console.log(jqXHR, textStatus, 'error')
  })
}
function statusProgress() {
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/status/Progress`,
    headers: {token: localStorage.token} //kriim headers dari klien hohoho
  })
  .done(function(response) {
    console.log(response)
    response.data.forEach((element, i) => {
      console.log(response)
      todos = response
      $('#allTodos').show()
      $('#allTodos').append(
          `
          <div class="col-4 card"">
              <ul class="list-group">
                <div class="container" style="padding-top: 20px; padding-bottom: 20px">
                  <li class="list-group-item" id="title">
                    <h5 style="text-align: center; margin-bottom: 0px" >${element.name}</h5>
                  </li>
                  <li class="list-group-item">
                    <small><b>Description:</b> ${element.description}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Created Date:</b> ${element.createdAt}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Due Date:</b> ${element.due_date}</small><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Status:</b> ${element.status}</medium><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Action: </b></medium><br>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnEdit" onclick="editTodoForm('${element._id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnDelete" onclick="deleteTodo('${element._id}')">Delete</button>
                  </li>
                </div>
              </ul>
            </div>
          `
      )
    });
  })
  .fail((jqXHR, textStatus) => {
    console.log(jqXHR, textStatus, 'error')
  })
}
function statusFinished() {
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/status/Finished`,
    headers: {token: localStorage.token} //kriim headers dari klien hohoho
  })
  .done(function(response) {
    console.log(response)
    response.data.forEach((element, i) => {
      console.log(response)
      todos = response
      $('#allTodos').show()
      $('#allTodos').append(
          `
          <div class="col-4 card"">
              <ul class="list-group">
                <div class="container" style="padding-top: 20px; padding-bottom: 20px">
                  <li class="list-group-item" id="title">
                    <h5 style="text-align: center; margin-bottom: 0px" >${element.name}</h5>
                  </li>
                  <li class="list-group-item">
                    <small><b>Description:</b> ${element.description}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Created Date:</b> ${element.createdAt}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Due Date:</b> ${element.due_date}</small><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Status:</b> ${element.status}</medium><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Action: </b></medium><br>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnEdit" onclick="editTodoForm('${element._id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnDelete" onclick="deleteTodo('${element._id}')">Delete</button>
                  </li>
                </div>
              </ul>
            </div>
          `
      )
    });
  })
  .fail((jqXHR, textStatus) => {
    console.log(jqXHR, textStatus, 'error')
  })
}

//search
function searchTodos(value) {
  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/title/${value}`,
    headers: {token: localStorage.token}
  })
  .done(response => {
    console.log(response)
    response.data.forEach((element, i) => {
      console.log(response)
      $('#allTodos').show()
      $('#allTodos').append(
          `
          <div class="col-4 card"">
              <ul class="list-group">
                <div class="container" style="padding-top: 20px; padding-bottom: 20px">
                  <li class="list-group-item" id="title">
                    <h5 style="text-align: center; margin-bottom: 0px" >${element.name}</h5>
                  </li>
                  <li class="list-group-item">
                    <small><b>Description:</b> ${element.description}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Created Date:</b> ${element.createdAt}</small><br>
                  </li>
                  <li class="list-group-item">
                    <small><b>Due Date:</b> ${element.due_date}</small><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Status:</b> ${element.status}</medium><br>
                  </li>
                  <li class="list-group-item">
                    <medium><b>Action: </b></medium><br>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnEdit" onclick="editTodoForm('${element._id}')">Edit</button>
                    <button class="btn btn-sm btn-outline-info" type="button"  id="btnDelete" onclick="deleteTodo('${element._id}')">Delete</button>
                  </li>
                </div>
              </ul>
            </div>
          `
      )
    });
  })
  .fail(function(jqXHR, textStatus){
    console.log(jqXHR, textStatus)
    Swal.fire('Data Not Found !', `${jqXHR.responseText}`, 'error')
  })
}