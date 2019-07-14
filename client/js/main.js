$(document).ready(function() {
    $('#form-login').show()
    $('#form-register').hide()
    $('#content-page').hide()
    $('#btnRegister').click(function() {
        event.preventDefault()
    })
    $('#subregister').click(function() {
        event.preventDefault()
        register()
        loginForm()
    })
    $('#btnLogin').click(function() {
        event.preventDefault()
        // login()
        loginSementara()
    })
})

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

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/users/login`,
        data: {
            id_token: id_token
        }
    })
        .done(function(response) {
            console.log(response)
            $('#test').append(
                `${response.message}
                ${response.data}`
            )
        })

}

function loginForm() {
    event.preventDefault()
    $('#form-login').show()
    $('#form-register').hide()
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
            console.log(response)
            $('#test').append(
                `${response.message}
                ${response}`
            )
        })
}
function loginSementara() {
    event.preventDefault()
    $('#form-login').empty()
    $('#content-page').show()
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/todos`
      })
      .done(function(response) {
        console.log(response)

        //berarti pake id nanti
        response.data.forEach(element => {
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
                        <button class="btn btn-sm btn-outline-info" type="submit" id="btnEdit">Edit</button>
                        <button class="btn btn-sm btn-outline-info" type="submit" id="btnDelete">Delete</button>

                      </li>
                    </div>
                  </ul>
                </div>
              `
          )
        });
    });
}
function login() {
    event.preventDefault()
    $('#form-login').empty()
    $('#content-page').show()
    const username = $('#inusername').val()
    const password = $('#inpassword').val()
    $.ajax({
        method: "POST",
        url: `http://localhost:3000/users/login`,
        data:{
            username: username,
            password: password
        }
      })
      .done(function(response) {
        console.log(response)

        //berarti pake id nanti
        response.data.forEach(element => {
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
                        <button class="btn btn-sm btn-outline-info" type="submit" id="btnEdit">Edit</button>
                        <button class="btn btn-sm btn-outline-info" type="submit" id="btnDelete">Delete</button>

                      </li>
                    </div>
                  </ul>
                </div>
              `
          )
        });
    });
}