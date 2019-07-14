let Url = 'http://localhost:3000'

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token
    console.log(id_token);

    $.ajax({
        url: `${Url}/users/tokensignin`,
        method: "POST",
        data: {
            id_token: id_token
        },
        success: function (data) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('username', data.username)
            swal.fire({
                type: "success",
                title: "Success Login!"
            })
            $("#loginForm").hide()
            $("#navbar").show()
            $("#logoutbtn").show()
            $('#todolist').show()
            showTodo()
            $('#modalCreate').show()
            
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    localStorage.clear()
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function login() {
    $("#login").click(function (e) {
        e.preventDefault();
        let email = $('#email').val()
        let password = $('#password').val()

        if (email != '' && password != '') {
            $.ajax({
                method: "POST",
                url: `${Url}/users/login`,
                data: {
                    email,
                    password
                }
            })
                .done(resp => {
                    swal.fire({
                        type: "success",
                        title: "Success Login!"
                    })
                    localStorage.setItem("token", resp.token)
                    localStorage.setItem("username", resp.username)
                
                    checkLogin()
                })
                .fail((err,jqXHR, textStatus) => {
                    console.log(textStatus)
                    swal.fire({
                        type: "error",
                        title: err.responseJSON.message
                    })
                })
        } else {
            swal.fire({
                type: "error",
                title: "Email/Password cannot be empty"
            })
        }

    });
}

function register() {
    $("#regisButton").click(function (e) {
        e.preventDefault();
        $("#loginForm").hide()
        $("#regisForm").show()
    });

    $("#register").click(function (e) {
        e.preventDefault();
        let username = $('#Username1').val()
        let email = $('#Email1').val()
        let password = $('#Password1').val()

        if (email != '' && password != '' && username != '') {
            $.ajax({
                method: "POST",
                url: `${Url}/users/register`,
                data: {
                    username,
                    email,
                    password
                }
            })
                .done(resp => {
                    $('#regisform').hide()
                    $('#loginform').show()

                    swal.fire({
                        type: "success",
                        title: "Success Register, Please Login"
                    })
                    
                })
                .fail((err, jqXHR, textStatus) => {
                    console.log(textStatus)
                    swal.fire({
                        type: "error",
                        title: err.responseJSON.message
                    })
                    $('#regisform').show()
                })
        } else {
            swal.fire({
                type: "error",
                title: "Email/Password cannot be empty"
            })
            $('#regisform').show()
        }
    })
}

function logout() {
    $('#logoutbtn').click(function () {
        event.preventDefault()
        swal.fire({
            title: 'Are you sure?',
            text: "Your todo is waiting for you",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        })
            .then((result) => {
                if (result.value) {
                    signOut()
                    Swal.fire(
                        "You're logging out..!!",
                        'success'
                    )
                    // $('#navbar').hide()
                    // $('#todolist').hide()
                    // $('#modalCreate').hide()
                    // $('#projectDetail').hide()
                    // $('#homeProject').hide()
                    // // $('#loginform').show()
                    // window.location.href = 'http://localhost:8080/'
                    checkLogin()
                    $('.hello').empty()
                } else {
                    Swal.fire(
                        "Yes, play again",
                        'success'
                    )
                }


            });
    })
}

$(document).ready(function () {

    register()
    login()
    logout()
});
