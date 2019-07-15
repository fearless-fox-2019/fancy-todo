let isLogin = false

$(document).ready(function(){

  checkLogin(isLogin)

  if (localStorage.getItem('token')) {
    $.ajax({
      method: 'get',
      url: 'http://localhost:3000/todos/test',
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .done( function(responses) {
      console.log(responses)
      isLogin=true
      checkLogin(isLogin)
      afterLogin()
    })
    .fail( function(error) {
      isLogin=false
      checkLogin(isLogin)
    })
  }

  $('#formLogin').submit(function(event){
    event.preventDefault()

    let payload = {
      email: $('#email').val(),
      password: $('#password').val()
    }

    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/users/signin',
      data: payload,
    })
    .done(function(data) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
      isLogin = true
      checkLogin(isLogin)
      afterLogin()
      $('#toastInfo').empty()
      $('#toastInfo').append(`
        <div class="toast-header">
          <strong class="mr-auto text-primary">Welcome!</strong>
          <small class="text-muted">a seconds ago</small>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
        </div>
        <div class="toast-body">
          ${data.email}
        </div>
      `)
      $('#toastInfo').toast({
        delay: 5000
      })
      $('#toastInfo').toast('show')
    })
    .fail(function(err) {
      console.log(err)
      $('#toastInfo').empty()
      $('#toastInfo').append(`
        <div class="toast-header">
          <strong class="mr-auto text-primary">Login failed</strong>
          <small class="text-muted">a seconds ago</small>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
        </div>
        <div class="toast-body">
          email: ${payload.email}
        </div>
      `)
      $('#toastInfo').toast({
        delay: 5000
      })
      $('#toastInfo').toast('show')
    })
  })

  $('#formRegister').submit(function(event){
    event.preventDefault()

    let payload = {
      email: $('#emailRegister').val(),
      password: $('#passwordRegister').val()
    }
    
    $.ajax({
      method: 'post',
      url: 'http://localhost:3000/users/signup',
      data: payload
    })
    .done(function(response){
      $('#toastInfo').empty()
      $('toastInfo').append(`
        <div class="toast-header">
          <strong class="mr-auto text-primary">Registration success</strong>
          <small class="text-muted">a seconds ago</small>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
        </div>
        <div class="toast-body">
          email: ${response.email}
        </div>
      `)
      $('toastInfo').toast({
        delay: 5000
      })
      $('toastInfo').toast('show')
      $('#formregister').modal('hide')
    })
    .fail(function(err){
        $('#toastInfo').empty()
        $('toastInfo').append(`
          <div class="toast-header">
            <strong class="mr-auto text-primary">Registration failed</strong>
            <small class="text-muted">a seconds ago</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
          </div>
          <div class="toast-body">
            email: ${payload.email}
          </div>
        `)
        $('toastInfo').toast({
          delay: 5000
        })
        $('toastInfo').toast('show')
    })
    $('#formregister').modal('hide')
  })

});