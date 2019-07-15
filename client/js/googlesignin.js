
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: 'post',
        url: 'http://localhost:3000/users/googlesignin',
        data: {
            id_token: id_token
        }
    })
    .done( (data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('email', data.email)
        isLogin = true
        checkLogin(isLogin)
        afterLogin()
    })
    .fail( (err)=> {
        console.log(err)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('logout button google')
    });
}
