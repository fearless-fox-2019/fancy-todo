const baseUrl = `http://localhost:3000/api`

$(document).ready(function() {
    homePage()
    // profilePage()
    if(localStorage.getItem('token')) {
        // console.log('bc')
        afterLoggingIn()
        profilePage()
        listAll()
    } else {
        homePage()
    }

    $('#formRegister').submit(function(event) {
        event.preventDefault()
        registration()
    })

    $('#formLogin').submit(function(event) {
        event.preventDefault()
        login()
        listAll()
        profilePage()
    })

    $('#loginBar').click(function(event) {
        event.preventDefault()
        clickLogin()
    })

    $('#registerBar').click(function(event) {
        event.preventDefault()
        clickRegister()
    })

    $('#homeBar').click(function(event) {
        event.preventDefault()
        homePage()
    })

    $('#signOutBar').click(function(event) {
        event.preventDefault()
        homePage()
    })

    $('#createTask').submit(function(event) {
        event.preventDefault()
        createTodo()
        listAll()
    })

    $('#searchForm').submit(function(event) {
        event.preventDefault()
        filterData()
    })

    $('#allTask').click(function(event) {
        event.preventDefault()
        listAll()
    })

    $('.modal').modal();
})


function homePage() {
    $('#formLogin').hide()
    $('#formRegister').hide()
    $('#signOutBar').hide()
    $('#homePage').show()
    $('#loginBar').show()
    $('#userProfilePage').hide()
    $('#todoList').hide()
    $('#seachTodo').hide()
    $('#registerBar').show()
    $('#homeBar').show()
}

function clickLogin() {
    // console.log('asd')
    $('#formLogin').show()
    // $('#formLogin').show()
    $('#formRegister').hide()
    $('#homePage').hide()
    $('#seachTodo').hide()
}

function clickRegister() {
    $('#formLogin').hide()
    $('#formRegister').show()
    $('#homePage').hide()
    $('#seachTodo').hide()
}

function afterLoggingIn() {
    $('#formLogin').hide()
    $('#formRegister').hide()
    $('#signOutBar').show()
    $('#userProfilePage').show()
    $('#loginBar').hide()
    $('#homePage').hide()
    $('#todoList').show()
    $('#seachTodo').show()
    $('#homeBar').hide()
    $('#registerBar').hide()
}

function signOutBar() {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('username')
    localStorage.removeItem('image')
    homePage()
}

function registration() {
    // console.log($(this).serialize())
    let email = $('#emailRegister').val()
    let password = $('#passwordRegister').val()
    let username = $('#usernameRegister').val()
    // console.log($(this).serialize())
    $.ajax({
        url: `${baseUrl}/users/register`,
        method: "POST",
        data: {
            email,password,username
        }
    })
    .done((datas) => {
        // console.log(datas.token)
        Swal.fire({
            type: 'success',
            title: `Successfully registered! please check your email: ${email} to confirm!`
        })
        $('#formRegister').hide()
        $('#formLogin').show()
    })
    .fail((err) => {
        // console.log(err.responseJSON)
        let msg = err.responseJSON.message
        Swal.fire({
            type: 'error',
            title: 'registration failed',
            text: msg
        })
        console.log(err);
    })
}

// function confirmEmail(token) {
//     $.ajax({
//         url: `${baseUrl}/users/confirmation/${token}`,
//         method: 'POST'
//     })
//     .done((datas) => {
//         console.log('halo')
//     })
//     .fail((err) => {
//         console.log(err)
//     })
// }

function login() {
    let email = $('#emailLogin').val()
    let password = $('#passwordLogin').val()
    console.log(email)
    $.ajax({
        url: `${baseUrl}/users/login`,
        method: "POST",
        data: {
            email,password
        }
    })
    .done((datas) => {
        localStorage.setItem('token', datas.token)
        localStorage.setItem('email',datas.email)
        localStorage.setItem('username',datas.username)
        Swal.fire({
            type:'success',
            title: `Welcome back ${datas.username}!`
        })
        afterLoggingIn()
        profilePage()
        listAll()
    })
    .fail((err) => {
        Swal.fire({
            type:'error',
            title: 'Username/Password is wrong!'
        })
        // console.log('asd')
        console.log(err.responseJSON.message);
    })
}

function onSignIn(googleUser) {
    // gapi.auth2.getAuthInstance().signOut()
    const profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: `${baseUrl}/users/googleSignIn`,
        method: 'POST',
        data: {
            id_token
        }
    })
    .then((datas) => {
        afterLoggingIn()
        // console.log(datas);
        localStorage.setItem('token', datas)
        localStorage.setItem('email',profile.getEmail())
        localStorage.setItem('username',profile.getName())
        localStorage.setItem('image',profile.getImageUrl())
        profilePage()
        listAll()
        Swal.fire({
            type:'success',
            title: `Welcome back ${profile.getName()}!`
        })
    })
    .fail((err) => {
        console.log(err);
    })
}

function profilePage() {
    $('#userProfilePage').empty()
    // $('#homeBar').hide()
    // $('#registerBar').hide()
    if(localStorage.getItem('image')) {
        $('#userProfilePage').append(`
            <div class="card cardProfile">
                <div class="center-align">
                    <img class="circle responsive-img" src="${localStorage.getItem('image')}">
                </div>
            <div class="card-content">
                <span class="card-title activator grey-text text-darken-4 flow-text" style="font-size: 20px;">${localStorage.getItem('email')}<i class="material-icons right">more_vert</i></span>
                    <p>Hello ${localStorage.getItem('username')}! What would you like to do today ?</p>
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${localStorage.getItem('email')}<i class="material-icons right">close</i></span>
                    <p>Hello ${localStorage.getItem('username')}! What would you like to do today ?</p>
                </div>
            </div>
            <div class="collection">
                <a href="#modal1" class="collection-item modal-trigger"><span class="badge"></span>Add Task</a>
                <a href="#" class="collection-item" id="allTask"><span class="badge"></span>All Task</a>
            </div>
        `)
    } else {
        $('#userProfilePage').append(`
        <div class="card cardProfile">
            <div class="center-align">
                <img style="width:100px;"class="circle responsive-img" src="./images/img_avatar.png">
            </div>
        <div class="card-content">
            <span class="card-title activator grey-text text-darken-4 flow-text" style="font-size: 20px;">${localStorage.getItem('email')}<i class="material-icons right">more_vert</i></span>
                <p>Hello ${localStorage.getItem('username')}! What would you like to do today ?</p>
        </div>
        <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${localStorage.getItem('email')}<i class="material-icons right">close</i></span>
                <p>Hello ${localStorage.getItem('username')}! What would you like to do today ?</p>
            </div>
        </div>
        <div class="collection">
            <a href="#modal1" class="collection-item modal-trigger"><span class="badge"></span>Add Task</a>
            <a href="#" class="collection-item" id="allTask"><span class="badge"></span>All Task</a>
        </div>
    `)
    }
}



function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        Swal.fire({
            type: 'success',
            title: 'user signed out'
        })
        console.log('User signed out.');
    });
    signOutBar()
}





