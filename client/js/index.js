var token = localStorage.getItem('token')
var user = localStorage.getItem('user')

$('#loginForm').on('submit', function() {
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
       isToken()
       localStorage.setItem('token', data.token)
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
        localStorage.setItem("token", response);
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
    $('#content-todo').hide()
}

function isToken() {
    console.log(token)
    console.log(user)
    $('#loginPage').hide()
    $('#registerPage').hide()
    $('#todo').show()
    $('#navbar').show()
    $('#signOut').show()
    $('#content-todo').show()
}

function changeToRegister() {
    $('#registerPage').show()
    $('#loginPage').hide()
    $('#navbar').hide()
    $('#signout').hide()
    $('#todo').hide()
}

function changeToLogin() {
    $('#registerPage').hide()
    $('#loginPage').show()
    $('#navbar').hide()
    $('#signout').hide()
    $('#todo').hide()
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
    }
})