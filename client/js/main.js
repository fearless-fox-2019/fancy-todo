const baseUrl = 'http://localhost:3000'

$(document).ready(function(){
    console.log('readyyyy')
    isLogin()
    $('.modal').modal();
    $('.sidenav').sidenav();
    $('.dropdown-trigger').dropdown();
    $('.datepicker').datepicker();
    $('.timepicker').timepicker();
    // getMyUncompleteTodo();

    $('#register-form').submit(function(event) {
        event.preventDefault()
        let newData = {
            name : $('#name-reg').val(),
            email : $('#email-reg').val(),
            password : $('#password-reg').val()
        }
        register(newData)
    })

    $('#landing-login-but').click(function(event){
        event.preventDefault()
        $('#landing').hide()
        $('#login').show()
    })

    $('#landing-register-but').click(function(event){
        event.preventDefault()
        $('#landing').hide()
        $('#register').show()
    })

    $('#login-form').submit(function(event) {
        event.preventDefault()
        let userData = {
            email : $('#email-log').val(),
            password : $('#password-log').val()
        }
        // console.log(userData)
        login(userData)
    })

    $('#to-login').click(function(event) {
        $('#landing').hide()
        $('#login').show()
        $('#register').hide()
    })

    $('#to-register').click(function(event) {
        $('#landing').hide()
        $('#register').show()
        $('#login').hide()
    })

    $('#to-logout').click(function(event) {
        event.preventDefault()
        logout()
        landingPage()
    })

    $('#landing-login-but').click(function(event) {
        event.preventDefault()
        $('#landing').hide() 
        $('#login').show()
        $('#register').hide()
    })

    $('#form-add-todo').submit(function(event) {
        event.preventDefault()
        let todoData = {
            name : $('#todo-name').val(),
            description : $('#todo-description').val(),
            due_date : $('#due-date-inp').val(),
            time : $('#set-time').val()
        }
        addTodo(todoData)
        $('.modal').modal('close');
        $('.sidenav').sidenav('close');
        $('#todo-name').val('')
        $('#todo-description').val('')
        $('#due-date-inp').val('')
        $('#set-time').val('')
    })

    $('#trigger-comp').click(function(event) {
        event.preventDefault()
        // console.log('masuk click button')
        getCompleteTodo()
    })

    $('#mailer-but').click(function(event) {
        event.preventDefault()
        sendEmail()
    })

    $('#search-href').click(function(event) {
        event.preventDefault()
        let data = {
            name : $('#search').val()
        }
        search(data)
    })

});

function getMyUncompleteTodo(){
    $.get({
        url : `${baseUrl}/todos/uncomplete`,
        headers : { token : localStorage.getItem("token") }
    })
    .done(data => {
        $('#table-uncomp').empty()        
        // console.log('masuk get uncomp')
        // console.log(data)
        data.forEach(el => {
            if(el.status === 'uncompleted'){
                $('#table-uncomp').append(`
                    <tr><td>${el.name}</td><td>${el.description}</td><td><i class="material-icons">date_range</i><br>${el.due_date}</td><td><i class="material-icons">access_time</i><br>${el.time}</td><td><i class="material-icons" style="cursor : pointer" onclick="completeTodo('${el._id}')">check_box</i></td><td><a class="modal-trigger" href="#modal-edit" onclick="findTodo('${el._id}')"><i class="material-icons" style="cursor : pointer">edit</i></a></td> <td id="delete-todo"><i class="material-icons" style="cursor : pointer" onclick="deleteTodo('${el._id}')">delete</i></td><tr>
                `)
            }
        })
    })
    .fail(err => {
        console.log(err)
    })
}

function getCompleteTodo(){
    // console.log('hiyaaaaaaaaaaaaaaaaaaaaaa')
    $('#table-comp').empty()
    $.get({
        url : `${baseUrl}/todos/complete`,
        headers : { token : localStorage.getItem("token") }
    })
    .done(data => {
        // console.log(data)
        data.forEach(el => {
            if(el.status === 'completed'){
                // console.log('masuk getCompletedTodo')
                $('#table-comp').append(`
                    <tr><td>${el.name}</td><td>${el.description}</td><td><i class="material-icons">date_range</i><br>${el.due_date}</td><td><i class="material-icons">access_time</i><br>${el.time}</td> <td><a class="modal-trigger" href="#modal-edit" onclick="findTodo('${el._id}')"><i class="material-icons" style="cursor : pointer">edit</i></a></td> <td id="delete-todo"><i class="material-icons" style="cursor : pointer" onclick="deleteTodo('${el._id}')">delete</i></td><tr>
                `)
            }
        })
    })
    .fail(err => {
        console.log(err)
    })
}

function deleteTodo(todoId){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            $.ajax({
                url : `${baseUrl}/todos/delete/${todoId}`,
                method : 'DELETE',
                headers : { token : localStorage.getItem("token")}
            })
            .done(() => {
                console.log('ashiap kehapus mamang')
                $('#table-uncomp').empty()
                $('#table-comp').empty()
                getCompleteTodo()
                userHome()
            })
            .fail(err => {
                console.log(err)
                if(err.responseText.includes('Unauthorized')){
                    Swal.fire({
                        type: 'error',
                        title: 'Failed to complete todo',
                        text: 'Unauthorized user'
                    })
                }
                if(err.responseText.includes('Invalid Token')){
                    Swal.fire({
                        type: 'error',
                        title: 'Invalid Token'
                    })
                }
            })
          Swal.fire(
            'Deleted!',
            'Your todo list has been deleted.',
            'success'
          )
        }

      })
}

function userHome(){
    $('#table-uncomp').empty()
    $('#todo-table').show()
    $('#todo').fadeIn(200)
    hasToken()
    getMyUncompleteTodo()
}

function addTodo(todoData){    
    console.log(todoData)
    // console.log(localStorage.getItem("token"))
    $.post({
        url: `${baseUrl}/todos/add`,
        dataType: 'json',
        headers : { token: localStorage.getItem("token") },
        data : todoData
    })
    .done(() => {
        Swal.fire({
            // position: 'top-end',
            type: 'success',
            title: 'Success add new Todo list!',
            showConfirmButton: false,
            timer: 1700
        })     
        $('#table-uncomp').empty()
        userHome()
        // console.log(localStorage.getItem(token))        
    })
    .fail(err => {
        console.log(err)
        if(err.responseText.includes('Due Date')){
            Swal.fire({
                type: 'error',
                title: 'Failed to add new Task',
                text: 'Due Date can\'t be before today!'
            })
        }
        if(err.responseText.includes('Invalid Token')){
            Swal.fire({
                type: 'error',
                title: 'invalid token!'
            })
        }
    })
}

function register(newUser){
    $.post({
        url: `${baseUrl}/users/register`,
        data: newUser
    })
    .done(() => {
        Swal.fire({
            // position: 'top-end',
            type: 'success',
            title: 'Success Register, enjoy!',
            showConfirmButton: false,
            timer: 1700
        })     
        $('#register').hide()
        $('#login').show()
    })
    .fail(err => {
        console.log(err)
        if(err.responseText.includes('email')){
            Swal.fire({
                type: 'error',
                title: 'Failed to register',
                text: 'email has been registered!'
            })
        }
        if(err.responseText.includes('name can\'t be blank!')){
            Swal.fire({
                type: 'error',
                title: 'Name can\'t be blank!',
            })
        }
        if(err.responseText.includes('password')){
            Swal.fire({
                type: 'error',
                title: 'Password must have at least 6 characters!'
            })
        }
    })
}

function isLogin(){
    if(localStorage.token){
        hasToken()
    }else{
        noToken()
    }
}

function hasToken(){
    $('#landing').hide()
    $('#to-login').hide()
    $('#to-register').hide()
    $('#login').hide()
    $('#register').hide()
    $('#to-logout').show()
    $('#sidenav-menu').show()
}

function noToken(){
    $('#landing').show()
    $('#to-login').show()
    $('#to-register').show()
    $('#login').hide()
    $('#register').hide()
    $('#to-logout').hide()
    $('#sidenav-menu').hide()
    $('#todo-table').hide()
}

function completeTodo(todoId){
    $('#table-comp').empty()
    console.log('masuk complete todo mamang')
    $.ajax({
        url : `${baseUrl}/todos/complete/${todoId}`,
        method : "PATCH",
        headers : { token: localStorage.getItem('token') }
    })
    .done(() => {
        Swal.fire({
            type: 'success',
            title: 'You Completed this task. Good work!',
            showConfirmButton: false,
            timer: 1500
          })
        getMyUncompleteTodo()
    })
    .fail(err => {        
        console.log(err)
        if(err.responseText.includes('Unauthorized')){
            Swal.fire({
                type: 'error',
                title: 'Failed to complete todo',
                text: 'Unauthorized user'
            })
        }
        if(err.responseText.includes('Invalid Token')){
            Swal.fire({
                type: 'error',
                title: 'Invalid Token'
            })
        }
    })
}

function login(dataUser){
    $.post({
        url : `${baseUrl}/users/login`,        
        data : dataUser
    })
    .done(data => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.name)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });          
        Toast.fire({
            type: 'success',
            title: 'Signed in successfully'
        })
        userHome()

    })
    .fail(err => {
        console.log(err)
        if(err.responseText.includes('email/password')){
            Swal.fire({
                type: 'error',
                title: 'Failed to login',
                text: 'email/password wrong!'
            })
        }
    })
}

function sendEmail(){
    // console.log('masuk send email mamangsss')
    $.post({
        url : `${baseUrl}/todos/sendEmail`,
        method : "POST",
        headers : {token : localStorage.getItem('token'), name : localStorage.getItem('name')}
    })
    .done(() => {
        Swal.fire({
            type: 'success',
            title: 'An email sent to your email account!',
            showConfirmButton: false,
            timer: 1700
        })  
    })
    .fail(err => {
        console.log(err)
    })
}

function edit(todoId,newData){    
    $.ajax({
        url : `${baseUrl}/todos/edit/${todoId}`,
        method : "PATCH",
        headers : { token: localStorage.getItem('token') },
        data : newData
    })
    .done(result => {
        Swal.fire(
            'Updated!',
            'Your todo list has been deleted!.',
            'success'
        )
        $('#table-uncomp').empty()
        $('#table-comp').empty()
        getCompleteTodo()
        userHome()
    })
    .fail(err => {
        console.log(err)
        if(err.responseText.includes('Unauthorized')){
            Swal.fire({
                type: 'error',
                title: 'Failed to complete todo',
                text: 'Unauthorized user'
            })
        }
        if(err.responseText.includes('Invalid Token')){
            Swal.fire({
                type: 'error',
                title: 'Invalid Token'
            })
        }
    })
}

function findTodo(todoId){
    $.get({
        url : `${baseUrl}/todos/find/${todoId}`,
        headers : { token: localStorage.getItem('token') }
    })
    .done(data => {
        console.log(data)
        $('#todo-edit-name').val(`${data.name}`)
        $('#todo-description-edit').val(`${data.description}`)
        $('#due-date-inp-edit').val(`${data.due_date}`)
        $('#set-time-edit').val(`${data.time}`)
        return new Promise(function(resolve,reject){
            resolve($('#form-edit-todo').submit(function(event) {
                event.preventDefault()
                let newData = {
                    name : $('#todo-edit-name').val(),
                    description : $('#todo-description-edit').val(),
                    due_date : $('#due-date-inp-edit').val(),
                    time : $('#set-time-edit').val()
                }
                // console.log(data._id, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
                edit(data._id, newData)
                $('.modal').modal('close');
            }))
        })  
        .then(() => {
            console.log('sukses mamamannnggg')
        })    
    })
    .fail(err => {
        console.log(err)
        if(err.responseText.includes('not found')){
            Swal.fire({
                type: 'error',
                title: 'Data not found!'
            })
        }
    })
}


function logout(){
    Swal.fire({
        title: 'Are you sure wants to logout?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Logout'
    }).then((result) => {
        if (result.value) {
            localStorage.clear()
            const auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut()
            .then(function(){
                noToken()
                $('#email-log').val('')
                $('#password-log').val('')
            })
            .catch(function(err){
                console.log(err)
            })
        }
    })
}

function landingPage(){
    $('#login').hide()
    $('#register').hide()
    $('landing').show()
}

function onSignIn(googleUser) {
    console.log('masuk google sign in')
    const idToken= googleUser.getAuthResponse().id_token
    $.ajax({
        url: `${baseUrl}/users/loginGoogle`,
        method: 'POST',
        dataType: 'json',
        data:{idToken}
    })
    .done(function(Data){
        console.log(Data)
        localStorage.setItem('token', Data.token)
        localStorage.setItem('name', Data.name)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });          
        Toast.fire({
            type: 'success',
            title: 'Signed in successfully'
        })
        userHome()
    })
    .fail(function(err){
        console.log(err)        
    })
}

function search(todoName){
    console.log(todoName)
    console.log('masuk search')
    $('#table-search').empty()
    $.post({
        url : `${baseUrl}/todos/search`,
        headers : { token : localStorage.getItem('token') },
        data : todoName
    })
    .done(data => {
        console.log(data)
        $('#search').val('')        
        data.forEach(el => {
            $('#table-search').append(`
                <tr><td>${el.name}</td><td>${el.description}</td><td><i class="material-icons">date_range</i><br>${el.due_date}</td><td><i class="material-icons">access_time</i><br>${el.time}</td><td><i class="material-icons" style="cursor : pointer" onclick="completeTodo('${el._id}')">check_box</i></td> <td><a class="modal-trigger" href="#modal-edit" onclick="findTodo('${el._id}')"><i class="material-icons" style="cursor : pointer">edit</i></a></td> <td id="delete-todo"><i class="material-icons" style="cursor : pointer" onclick="deleteTodo('${el._id}')">delete</i></td><tr>
            `)            
        })
    })
    .fail(err => {
        console.log(err)        
    })
}