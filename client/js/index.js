const baseUrl='http://localhost:3000'
let currentProjectId= ''

$( document ).ready(function() {
    console.log( "ready!" );

    isLogin()

    $('.modal').modal()

    $('#toLogin').click(function(event){
        event.preventDefault()
        $('#loginPage').show()
        $('#registerPage').hide()
    })

    $('#toRegister').click(function(event){
        event.preventDefault()
        $('#loginPage').hide()
        $('#registerPage').show()
    })

    $('#formRegister').submit(function (event) {
        event.preventDefault()
        let newUser = {
          name: $('#nameRegis').val(),
          email: $('#emailRegis').val(),
          password: $('#passwordRegis').val()
        }
        console.log(newUser, 'new User')
         register(newUser)
    })
    
    $('#formLogin').submit(function (event) {
        event.preventDefault()
        let loginOption = {
          email: $('#email').val(),
          password: $('#password').val()
        }
        console.log('masuk login')
        console.log( $('#email').val())
         login(loginOption)
    })

    $('#logout').click(function(event){
        event.preventDefault()
        logout()
    })

    $('#toAddProject-btn').on('click',function(){
      fetchAllUser()
    })

    $('#addProject-btn').on('click', function(event){
      event.preventDefault()
      addProject()
    })


});

function isLogin(){
    if(localStorage.token){
        hasToken()
    }else{
        noToken()
    }
}

function noToken(){
    $('#landingPage').show()
    $('#loginPage').show()
    $('#registerPage').hide()
    $('#contentPage').hide()
}

function hasToken(){
    $('#landingPage').hide()
    $('#contentPage').show()
    $('#today').empty()
    $('#today').append(`${new Date().toLocaleDateString('en-US',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
    $('#loggedName').empty()
    $('#loggedName').append(`Welcome, ${localStorage.name}`)
    fetchProject()

}
