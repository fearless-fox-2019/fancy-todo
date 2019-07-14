let baseURL = 'http://localhost:3000'

function onSignIn(googleUser) {

    var id_token = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    $.ajax({
            method: 'POST',
            url: `${baseURL}/users/login-google`,
            data: {
                "token": id_token
            }
        })
        .done(response => {
            localStorage.setItem('token', response)
            localStorage.setItem('name', profile.getName())
            // $('.logout').show()
            // $('.todo-btn').show()

            // $('.login-btn').hide()
            // $('.register-form').hide()
            $('.user-name').empty()
            $('.user-name').append(`${localStorage.getItem('name')}`)
            $('a.home-switch').removeClass('homebase').addClass('home')

            $('.todos-list').empty()
            getMyTodo()
            $('.logout').show()
            $('.todo-btn').show()
            $('.user-page').show()
            $('.todos-list').show()
            // $('.goto').show()
            // $('.welcome-title').show()

            $('.login-btn').hide()
            $('.register-form').hide()
            $('.login-form').hide()
            // $('.todos').hide()

        })
        .fail(err => {
            console.log({
                message: 'Google Auth Error',
                error: err
            })
        })


}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    $('.logout').hide()
    $('.todo-btn').hide()
    $('.user-page').hide()
    $('.todo-form').hide()

    $('.login-btn').show()
    $('.register-form').show()

    $('a.home-switch').removeClass('home')
    $('a.home-switch').addClass('homebase')
}