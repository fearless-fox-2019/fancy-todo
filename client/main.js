$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('.chips').chips();
    $('select').formSelect();
    $('.tooltipped').tooltip()
    $('input#input_text, textarea#textarea1').characterCounter();
    toggleLogin()
});

var baseUrl = "http://localhost:3000/api"

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: "POST",
        url: `${baseUrl}/users/login/google`,
        data: {
            token: id_token
        }
    })
    .done(function(response) {
        $(".modal").modal("close")
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("username", response.username)
        localStorage.setItem("googleLogin", "true")
        toggleLogin()
        $(function() {
            loadMyProjects()
        })
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function login() {
    var username = $("#usernameLogin").val()
    var password = $("#passwordLogin").val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/api/users/login",
        data: {
            username: username,
            password: password
        }
    })
    .done(function(response) {
        $(".modal").modal("close")
        $("#usernameLogin").val("")
        $("#passwordLogin").val("")
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("username", response.username)
        toggleLogin()
        $(function() {
            loadMyProjects()
        })
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function register() {
    var username = $("#usernameRegister").val()
    var password = $("#passwordRegister").val()
    var email = $("#emailRegister").val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/api/users/register",
        data: {
            username: username,
            email: email,
            password: password
        }
    })
    .done(function(response) {
        $(".modal").modal("close")
        $("#usernameRegister").val("")
        $("#emailRegister").val("")
        $("#passwordRegister").val("")
        $("#emailRegister").val()
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("username", response.username)
        toggleLogin()
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function toggleLogin() {
    var token = localStorage.getItem("token")
    if(token) {
        $("#register").hide()
        $("#login").hide()
        $("#logout").text(`${localStorage.getItem("username")} | Logout`)
        $("#logout").show()
        
    } else {
        $("#register").show()
        $("#login").show()
        $("#projectList").empty()
        $("#projectContent").empty()
        $("#instructions").show()
        $("#logout").text(`Logout`)
        $("#logout").hide()
    }
}

function logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    localStorage.removeItem("token")
    toggleLogin()
}