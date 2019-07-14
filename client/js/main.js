const baseUrl = 'http://localhost:3000'

$(document).ready(function() {

    if (localStorage.token) {
        isLogin()
    } else {
        $('#signinForm').show()
        $('#signout').hide()
        $('#main').hide()
        $('#signupForm').hide()
        $('#addTodo').hide()
        $('#addForm').hide()
        $('#editForm').hide()       
    }
    
    $('#signinSubmit').click(function() {
        event.preventDefault()
        let emailItem = $('#emailSignin').val()
        let passwordItem = $('#passwordSignin').val()

        $.ajax({
            url: `${baseUrl}/users/login`,
            type: 'post',
            data: {
                email: emailItem,
                password: passwordItem
            }
        })
        .done(data => {
            localStorage.setItem(`id`, data.userId)
            localStorage.setItem(`token`, data.token)
            localStorage.setItem(`name`, data.name)
            isLogin()
        })
        .fail(error => {
            console.log(error)
        })
    })
    
    $('#signupSubmit').click(function() {
        event.preventDefault()  
        let nameItem = $('#nameSignup').val()
        let emailItem = $('#emailSignup').val()
        let passwordItem = $('#passwordSignup').val()

        $.ajax({
            url: `${baseUrl}/users/register`,
            type: 'post',
            data: {
                username: nameItem,
                email: emailItem,
                password: passwordItem
            }
        })
        .done(data => {
            console.log('SUKSES REGISTER')
        })
        .fail(error => {
            console.log(error)
        })
    })

    $('#signout').click(function() {
        event.preventDefault()
        $('#signinForm').show()
        $('#main').hide()
        $('#signout').hide()
        $('#gsignin').show()    
        $('#addTodo').hide()
        localStorage.removeItem('token')
        localStorage.removeItem('name')
        signOut()        
    })

    $('#signupBtn').click(function() {
        $('#signupForm').show()
        $('#signinForm').hide()
        $('#gsignin').show()
        
    })

    $('#signinBtn').click(function() {
        $('#signupForm').hide()
        $('#signinForm').show()
        $('#gsignin').show()
    })

    
})

function onSignIn(googleUser) {
    const idToken= googleUser.getAuthResponse().id_token
    $.ajax({
        url: `${baseUrl}/users/glogin`,
        type: 'POST',
        data: {
           idToken
        }
    })
    .done(function(data){
        localStorage.setItem('token', data.token)
        localStorage.setItem('name', data.username)
        isLogin()
    })
    .fail(function(err){
        console.log(err)
    })
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    }); 
    localStorage.removeItem("token")
    localStorage.removeItem("name")
    $('#signinForm').show()

}
function isLogin() {
    $('#main').empty()
    $('#main').show()
    retrieveTodo()
    $('#editForm').hide()
    $('#signupForm').hide()
    $('#signinForm').hide()
    $('#addTodo').show()
    $('#signout').show()
    $('#addForm').hide()
}


