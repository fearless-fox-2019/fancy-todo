 // signout google
function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        localStorage.clear()
        changeDisplay(true, ['.form-login', '#nav-register', '#nav-login'])
        changeDisplay(false, ['.user-dashboard', '.form-register', '#nav-logout', '#nav-userlogin'])
        console.log('User signed out.');
    });
}

//signin google
function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: `${baseUrl}/users/signin/google`,
        method: 'POST',
        data: {id_token}
    })
    .done(function({token, payload}) {
        localStorage.setItem('token', token)
        localStorage.setItem('data', JSON.stringify(payload))
        $('#userlogin').html(payload.name)
        $('.welcome').append(
            '<h3> Welcome to fancy todo</h3>'
        )
        changeDisplay(true, ['.user-dashboard', '#nav-logout','#nav-userlogin'])
        changeDisplay(false, ['.form-login', '.form-todo', '#nav-register', '#nav-login', '.list-todos'])
    })
    .fail(function(err) {
        console.log(err)
    })
    
}