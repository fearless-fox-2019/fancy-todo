let isLogin = localStorage.getItem('token') ? true : false
let loggedUser = ''
let state = 'user'
function setPage(show, hide) {
  $(show).show()
  $(hide).hide()
}
function changeDisplay(type, element) {
  if(Array.isArray(element)) {
    element.forEach(el => {
      if(type) {
        $(el).show()
      } else {
        $(el).hide()
      }
    });
  } else {
    if(type) {
      $(element).show()
    } else {
      $(element).hide()
    }
  }
}

$(document).ready(function() {
  changeDisplay(false, ['#project-name', '.menu-project'])
  if(isLogin) {
    loginState()
    getProjectList()
  } else {
    changeDisplay(true, ['#outside', '.login-false'])
    changeDisplay(false, ['#inside', '.login-true', '#sidebar'])
  }

  changeDisplay(false, '#movie-detail-container')

  $('#login-form').submit(function(event) {
    event.preventDefault()
    let input = {
      email: $('#i-login-email').val(),
      password: $('#i-login-password').val()
    }
    loginRegister('login', input)
    .then(result => {
      $('#i-login-email').val('')
      $('#i-login-password').val('')
      localStorage.setItem('token', result.token)
      loggedUser = result.payload
      localStorage.setItem('user', JSON.stringify(result.payload))
      loginState()
      getProjectList()
    })
    .catch(err => {
      console.log(err.responseJSON)
      M.toast({html: err.responseJSON.message})
    })
  })

  $('#register-form').submit(function(event) {
    event.preventDefault()
    let input = {
      email: $('#i-register-email').val(),
      password: $('#i-register-password').val()
    }
    loginRegister('register', input)
    .then(result => {
      M.toast({html: 'Successfully created an account !'})
      $('#i-register-email').val('')
      $('#i-register-password').val('')
    })
    .catch(err => {    
      console.log(err)
      M.toast({html: err.responseJSON.message})
    })
  })

  $('#nav-logout').click(function(event){ 
    event.preventDefault()
    localStorage.clear()
    M.toast({html: 'Signed Out'})
    changeDisplay(true, ['#outside', '.login-false'])
    changeDisplay(false, ['#inside', '.login-true'])
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    $('#todo-list').empty()
    $('#project-list').empty()
  })
})


function onSignIn(googleUser) {
  googleSignIn(googleUser)
  .done(data => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.payload))
    loggedUser = data.payload
    changeDisplay(true, ['#inside', '.login-true'])
    changeDisplay(false, ['#outside', '.login-false'])
    $('#username').html(data.payload.email)
    loginState()
    getProjectList()
  })
  .fail(err => {console.log(err.message)})
}