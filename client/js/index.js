const baseUrl = 'http://localhost:3000'

$(document).ready(function(){
    console.log("js script ready!");
    $('#form-register').hide()
    $('#form-signin').hide()
    $('#form-todo').hide()
    $('#fetchDataTodo').hide()
    $('#button-logout').hide()
    $('#button-project').hide()
    $('#button-backTodo').hide()
    $('#fetchDataWeather').hide()


    if (localStorage.getItem('token')){
        hasToken ()
    }

    $('#button-signin').click(function(event){
        event.preventDefault()
        console.log('masuk button signin')
        $('#form-signin').show()
        $('#form-register').hide()
    })

    $('#button-register').click(function(event){
        event.preventDefault()
        console.log('masuk button register')
        $('#form-register').show()
        $('#form-signin').hide()
    })

    $('#button-project').click(function(event){
        event.preventDefault()
        console.log('masuk button project')
        $('#form-signin').hide()
        $('#form-register').hide()
        $('#form-todo').hide()
        $('#fetchDataTodo').hide()
        let user = {
            UserId: localStorage.userId
        }
        availableUser(user)
    })

    $('#button-backTodo').click(function(event){
        event.preventDefault()
        console.log('masuk button backTodo')
        hasToken()
    })

    $('#button-register').click(function(event){
        event.preventDefault()
        console.log('masuk button register')
        $('#form-register').show()
        $('#form-signin').hide()
    })

    $('#form-register').submit(function(event){
        event.preventDefault()
        console.log('masuk submit register')
        let newUser = {
            name: $('#i-reg-name').val(),
            email: $('#i-reg-email').val(),
            password: $('#i-reg-password').val()
        }
        register(newUser)
    })

    $('#form-signin').submit(function(event){
        event.preventDefault()
        console.log('masuk submit signin')
        let user = {
            email: $('#i-sigin-email').val(),
            password: $('#i-sigin-password').val()
        }
        login(user)
    })

    $('#form-todo').submit(function(event){
        event.preventDefault()
        console.log('masuk submit todo')
        let newTodo = {
            name: $('#i-todo-name').val(),
            description: $('#i-todo-description').val(),
            dueDate: $('#i-todo-dueDate').val(),
            UserId: localStorage.userId
        }
        createTodo(newTodo)
    })

    $('#button-logout').click(function(event){
        event.preventDefault()
        console.log('masuk button register')
        $('#form-register').show()
        $('#homenav').show()
        $('#form-signin').show()
        $('#button-signin').show()
        $('#button-register').show()
        $('#button-logout').show()
        $('#fetchDataWeather').show()
        $('#button-project').show()
        $('#button-backTodo').show()
        $('#form-todo').hide()
        $('#fetchDataTodo').hide()
        $('#form-register').hide()
        $('#form-signin').hide()
        $('#button-logout').hide()
        $('#fetchDataWeather').hide()
        $('#button-project').hide()
        $('#button-backTodo').hide()
        logout()
    })

    
})

function weather (){
    $.ajax({
        url: `${baseUrl}/weathers?location=jakarta`,
        type: "get",
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(data){
            $('#fetchDataWeather').empty()
            console.log('masuk frontend cuaca')
            $('#fetchDataWeather').append(`
            <p> Location: jakarta </p>
            <p> Current Weather: ${data.weather[0].main}</p>
            <p> Description : ${data.weather[0].description}</p>
        `)
        })
        .fail(function(err){
            console.log(err)
        })
}

function hasToken (){
    $('#form-register').hide()
    $('#homenav').hide()
    $('#form-signin').hide()
    $('#button-signin').hide()
    $('#button-register').hide()
    $('#button-logout').show()
    $('#button-project').show()
    $('#button-backTodo').show()
    $('#form-todo').show()
    $('#fetchDataTodo').empty()
    $('#fetchDataTodo').show()
    $('#fetchDataWeather').show()
    weather()
    console.log(localStorage.userId)
    $.ajax({
        url: `${baseUrl}/todos/?UserId=${localStorage.userId}`,
        type: "get",
        dataType: "json",
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(allTodo){
            console.log(allTodo)
            
            $('#fetchDataTodo').append(`
            <table border="6">
                <tr>
                    <th><h4>No</h4></th>
                    <th><h4>Name</h4></th>
                    <th><h4>Description</h4></th>
                    <th><h4>Due Date</h4></th>
                    <th><h4>Action</h4></th>
                    <th><h4>Status</h4></th>
                </tr>
                <tr>
                    <td id="userTodoNo"></td>
                    <td id="userTodoName"></td>
                    <td id="userTodoDescription"></td>
                    <td id="userTodoDueDate"></td>
                    <td id="deleteTodo"></td>
                    <td id="statusTodo"></td>
                </tr>
            </table>
            `)
            for (let i=0; i<allTodo.length; i++){
                $('#userTodoNo').append(`<h4> ${i+1} </h4>`)
                $('#userTodoName').append(`<h4> ${allTodo[i].name} </h4>`)
                $('#userTodoDescription').append(`<h4> ${allTodo[i].description} </h4>`)
                $('#userTodoDueDate').append(`<h4> ${allTodo[i].dueDate.substring(0,10)} </h4>`)
                $('#deleteTodo').append(`<h4 class="btn-danger"><a onclick="deleteTodoById('${allTodo[i]._id}')"> Delete</a> </h4>`)
                if (allTodo[i].status === false){
                    $('#statusTodo').append(`<h4 class="btn-warning"><a onclick="changeStatusFinished('${allTodo[i]._id}')"> Unfinished</a> </h4>`)
                } else {
                    $('#statusTodo').append(`<h4 class="btn-success"><a onclick="changeStatusUnfinished('${allTodo[i]._id}')"> finished</a> </h4>`)
                }
            }
        })
        .fail(function(err){
            console.log(err)
        })
}

function changeStatusFinished (inputId){
    console.log('masuk tombol changeStatusFinished')
    let updateTodo = {
        status: true
    }
    $.ajax({
        url: `${baseUrl}/todos/update?id=${inputId}`,
        type: "post",
        dataType: "json",
        data: updateTodo,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(updatedTodo){
            console.log('status updated to done')
            hasToken()
        })
        .fail(function(err){
            console.log(err)
        })
}

function changeStatusUnfinished (inputId){
    console.log('masuk tombol changeStatusUnfinished')
    let updateTodo = {
        status: false
    }
    $.ajax({
        url: `${baseUrl}/todos/update?id=${inputId}`,
        type: "post",
        dataType: "json",
        data: updateTodo,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(updatedTodo){
            console.log('status updated to done')
            hasToken()
        })
        .fail(function(err){
            console.log(err)
        })
}

function deleteTodoById(input){
    console.log(input)
    let deletedTodo = {
        id: input
    }
    $.ajax({
        url: `${baseUrl}/todos/delete`,
        type: "post",
        dataType: "json",
        data: deletedTodo,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(deletedTodo){
            console.log('todo deleted')
            hasToken()
        })
        .fail(function(err){
            console.log(err)
        })
}

function createTodo (input){
    // console.log(input)
    $.ajax({
        url: `${baseUrl}/todos/create`,
        type: "post",
        dataType: "json",
        data: input,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(allTodo){
            $('#fetchDataTodo').empty()
            hasToken ()
        })
        .fail(function(err){
            console.log(err)
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: `${err.responseJSON.message}`,
            })
        })
}

function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    const idToken= googleUser.getAuthResponse().id_token
    $.ajax({
        url: `${baseUrl}/users/login/google`,
        type: "post",
        dataType: "json",
        data: {idToken},
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(data){
            console.log('masuk ke front end google signin')
            // console.log(data.token, data.userId, data.name, data.email)
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
            hasToken ()
        })
        .fail(function(err){
            console.log(err)
        })
}

function login (user){
    $.ajax({
        url: `${baseUrl}/users/login`,
        type: "post",
        dataType: "json",
        data: user,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(data){
            console.log(data)
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
            hasToken()

        })
        .fail(function(err){
            console.log(err)
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: `${err.responseJSON.message}`,
            })
        })
}

function logout (){
    localStorage.clear()
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
    .then(function(){
        console.log('User signout')
    })
    .catch(function(err){
        console.log(err)
    })
}



function register (newUser){
    console.log(newUser)
    $.ajax({
        url: `${baseUrl}/users/register`,
        type: "post",
        dataType: "json",
        data: newUser,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(success){
            console.log(success)
            let loginOption = {
                email: newUser.email,
                password: newUser.password
            }
            login(loginOption)
        })
        .fail(function(err){
            console.log(err)
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: `${err.responseJSON.message}`,
            })
        })
}

function availableUser(user){
    console.log('masuk user', user)
    $.ajax({
        url: `${baseUrl}/users/allUsers`,
        type: "get",
        dataType: "json",
        data: user,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function(allUser){
            $('#fetchDataUsers').append(`
            <table border="6">
            <tr>
                <th><h2>No</h2></th>
                <th><h2>Name</h2></th>
                <th><h2>Emailn</h2></th>
                <th><h2>Action</h2></th>
            </tr>
            <tr>
                <td id="userAvailableNo"></td>
                <td id="userAvailableName"></td>
                <td id="userAvailableEmail"></td>
                <td id="userAvailableAction"></td>
            </tr>
            </table>
            `)
            for (let i=0; i<allUser.length; i++){
                $('#userAvailableNo').append(`<h2> ${i+1} </h2>`)
                $('userAvailableName').append(`<h2> ${allUser[i].name} </h2>`)
                $('#userAvailableEmail').append(`<h2> ${allUser[i].email} </h2>`)
                $('#userAvailableAction').append(`<h2> Collaborate </h2>`)
            }
        })
        .fail(function(err){
            console.log(err)
        })
}