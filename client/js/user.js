

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

        $('#nameRegis').val(''),
        $('#emailRegis').val(''),
        $('#passwordRegis').val('')
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

    $('#email').val(''),
    $('#password').val('')
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
          $('#projectList').empty()
          $('#todoList').empty()
          $('#finishedList').empty()
          $('#myTodoList').empty()
          $('#myFinishedTodoList').empty()

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