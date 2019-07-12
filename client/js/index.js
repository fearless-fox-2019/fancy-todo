const baseUrl='http://localhost:3000'

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

}


function register(newUser){
    $.ajax({
        url: `${baseUrl}/users/register`,
        method: 'post',
        dataType: 'json',
        data: newUser
        })
    .done(function(success){
        console.log(success)
        let loginOption = {
            email : newUser.email,
            password: newUser.password
        }
        login(loginOption)
        })
    .fail(function(jqXHR,error){
        console.log('error register')
        console.log(error)
        })
}

function login (input) {
    $.ajax({
      url: `${baseUrl}/users/login`,
      method: 'post',
      dataType: 'json',
      data: input
    })
    .done(function(user){
    console.log(user)
    localStorage.setItem('token', user.token)
    localStorage.setItem('name', user.name)
    localStorage.setItem('userId', user.userId)
    hasToken()
    })
    .fail(function(jqXHR, error){
        console.log('error login')
        console.log(error)
    })
  }

function onSignIn(googleUser) {
  // console.log('masuk google sign in')
    const idToken= googleUser.getAuthResponse().id_token
     $.ajax({
        url: `${baseUrl}/users/loginGoogle`,
        method: 'post',
        dataType: 'json',
        data:{idToken}
     })
     .done(function(user){
        localStorage.setItem('token', user.token)
        localStorage.setItem('name', user.name)
        localStorage.setItem('userId', user.userId)
        hasToken()
     })
     .fail(function(jqXHR, err){
        console.log('error sign in google');
        console.log(err)
     })
  }

function logout() {
    Swal.fire({
      title: 'Are you sure to sign out?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    })
    .then((result) => {
      if (result.value) {
          localStorage.clear()
          noToken()
        //sign out google
        const auth2 = gapi.auth2.getAuthInstance();
  
        auth2.signOut()
        .then(function(){
          console.log('User signed out')
          noToken()
        })
        .catch(function(err){
          console.log(err)
        })
        
      }
    })
    
  }

function fetchAllUser(){
  console.log('masuk fetch user')
   $.ajax({
     url: `${baseUrl}/users`,
     method: 'get',
     headers:{
       token: localStorage.token
     }
   })
   .done(users =>{
    $('#userList').empty()
     console.log(users)
      if(users.length<1){
        $('#userList').append(`
            <h5>No User Can Be Invite</h5>
        `)
      }else{
        users.forEach(user => {
          if(user._id != localStorage.userId)
          $('#userList').append(`
              <div class="col s12">
              <label>
                  <input type="checkbox" value="${user._id}" name="user"/>
                  <span>${user.name}</span>
              </label>
              </div>
          `)
        });
      }
   })
   .fail(err =>{
     console.log('masuk error fetch user')
     console.log(err)
   })
}

function addProject(){
  let name=$('#nameProject').val()
  let desc= $('#descProject').val()
  let members = []
    $.each($("input[name='user']:checked"),function(){
        members.push($(this).val())
    })
    members.push(localStorage.userId)


  let newProject= {
    name: name,
    description: desc,
    members: members
  }

  console.log(newProject)

  $.ajax({
    url: `${baseUrl}/projects`,
    method: 'post',
    data: {
      name: name,
      description: desc,
      members: members
    },
    headers:{
      token: localStorage.token
    }
  })
  .done(response =>{
    $('#nameProject').val('')
    $('#descProject').val('')
    $('#addProjectModal').hide()
    
    Swal.fire({
      position: 'center',
      type: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  })
  .fail(err =>{
    console.log('error add project')
    console.log(err)
        
  })
  

}
