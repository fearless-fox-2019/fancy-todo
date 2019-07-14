function signIn() {
    let emailItem = $('#emailSignin').val()
    let passwordItem = $('#passwordSignin').val()
    $.ajax({
        url: `${baseUrl}/users/signin`,
        type: 'POST',
        data: {
            email: emailItem,
            password: passwordItem
        }
    })
    .done(data => {
        localStorage.setItem(`access_token`, data.access_token)
        localStorage.setItem(`name`, data.name)
        localStorage.setItem(`userId`, data.userId)
        isLogin()
    })
    .fail(error => {
        console.log(error)
    })
}

function signUp() {
    let nameItem = $('#nameSignup').val()
    let emailItem = $('#emailSignup').val()
    let passwordItem = $('#passwordSignup').val()
    $.ajax({
        url: `${baseUrl}/users/signup`,
        type: 'POST',
        data: {
            name: nameItem,
            email: emailItem,
            password: passwordItem
        }
    })
    .done(data => {
        console.log(data);
    })
    .fail(error => {
        console.log(error)
    })
}

function onSignIn(googleUser) {
    const idToken= googleUser.getAuthResponse().id_token
    $.ajax({
        url: `http://localhost:3000/users/gsignin`,
        type: 'post',
        data: {
           idToken
        }
    })
    .done(function(data){
        localStorage.setItem('access_token', data.token)
        localStorage.setItem(`name`, data.name)
        localStorage.setItem(`userId`, data.id)
        isLogin()
    })
    .fail(function(err){
        console.log(err)
    })
}

function isLogin() {
    document.getElementById("name").innerHTML = 'Hello, ' + localStorage.name;
    $('#lending').hide()
    $('#project').hide()
    $('#home').show()
    $('#personal').show()
    retrievePersonal()
}

function signout() {
    localStorage.clear()
    $('#lending').show()
    $('#home').hide()
}