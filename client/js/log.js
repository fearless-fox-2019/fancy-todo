// signIn-signUp
function signInForm() {
    $('#signInForm').toggle()
    $('#signUpForm').hide()
}

function signUpForm() {
    $('#signUpForm').toggle()
}

function toSignInForm() {
    $('.heroContainer').hide()
    $('#signUpForm').toggle()
    signInForm()
    signInErr()
    $('.signInFailPopUp').hide()
    $('#loginFormUsername').val('')
    $('#loginFormPassword').val('')
}

function signInErr() {
    $('.signInFailPopUp').show()
    $('#loginFormUsername').val('')
    $('#loginFormPassword').val('')
}

function getSignIn() {
    let username = $('#loginFormUsername').val()
    let password = $('#loginFormPassword').val()
    console.log(username, password, '<== ini us pas')
    $.ajax({
            url: `${baseUrl}/users/signin`,
            type: 'POST',
            data: {
                username,
                password
            }
        })
        .done((loggedIn) => {
            console.log(loggedIn)
            localStorage.setItem('token', loggedIn.token)
            toHome()
        })
        .fail((err) => {
            console.log(err)
            signInErr()
        })
    console.log('hehehe')
}

function getSignUp() {
    let signUpData = {
        username: $('#signUpFormUsername').val(),
        email: $('#signUpFormEmail').val(),
        password: $('#signUpFormPassword').val()
    }
    console.log(signUpData,'ini sign up data')
    $.ajax({
        url: `${baseUrl}/users/signup`,
        type: `POST`,
        data: signUpData
    })
        .done((created)=> {
            console.log(created)
            toSignIn()
        })
        .fail((err)=> {
            console.log(err)
        })

}

function toSignUp() {
    $('#signInForm').hide()
    $('#signUpForm').show()
}

function toSignIn() {
    $('#signInForm').show()
    $('#signUpForm').hide()
}

function signOutLocal() {
    console.log('ahahaha')
    localStorage.removeItem('token')
    signOut()
    toLanding()
    $('#signInForm').hide()
    $('#signUpForm').hide()
    $('.heroContainer').show()
}

//google thing
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
            url: `${baseUrl}/users/signin/google`,
            type: `POST`,
            data: {
                idToken: id_token
            }
        })
        .done(({
            token
        }) => {
            if (token) {
                console.log(token, 'token dari google')
                localStorage.setItem('token', token)
                signInForm()
                toHome()
            }
        })
        .fail((err) => {
            console.log(err)
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}