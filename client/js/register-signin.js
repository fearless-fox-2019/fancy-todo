$(document).ready(function(){
  $('.tabs').tabs();
});

// Show & Hide Register Tabs
$('#register-form').toggle(function() {
  $('#signin-form').hide()
})

$('#signin-form').toggle(function() {
  $('#signin-form').show()
  $('#register-form').hide()
})
////////////////

function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  gapi.auth2.getAuthInstance().signOut()
  const profile = googleUser.getBasicProfile();
  const id_token = googleUser.getAuthResponse().id_token;
  $.post('http://localhost:3000/users/signin-google', {
    token : id_token
  })
  .done((token) => {
    console.log(token);
    localStorage.setItem('token', token)
    $('#start').hide()
    $('#dashboard').show()
    getInfo()
  })
  .fail((err) => {
    if (err.status == 404) {
      Swal.fire({
        type: 'error',
        title: 'Email Not Found',
        text: 'Perhaps you want to register ?',
      })
    } else {
      Swal.fire({
        type: 'error',
        title: 'Something Bad Happened...',
        text: err.statusText,
      })
    }
    console.log(err);
  })
}

function onFailure(error) {
  Swal.fire({
    type: 'error',
    title: 'Something Bad Happened...',
    text: err.statusText,
  })
}

// Sign In 
function onSignIn() {
  event.preventDefault()
  const input = $('#signin-form :input').serializeArray()
  let data = input.reduce((acc, val) => {
    if (acc[val.name] == undefined) {
      acc[val.name] = val.value
    }
    return acc
  }, {})

  $.post(`http://localhost:3000/users/signin`, data)
  .done((token) => {
    localStorage.setItem('token', token)
    $('#start').hide()
    $('#dashboard').show()
    getInfo()
  })
  .fail((err) => {
    Swal.fire({
      type: 'error',
      title: 'You Shall Not Pass !',
      text: err.responseJSON.message,
    })
  })
}

// Register
function onRegister() {
  $(document).ready()
  event.preventDefault()
  const input = $('#register-form :input').serializeArray()
  let data = input.reduce((acc, val) => {
    if (acc[val.name] == undefined) {
      acc[val.name] = val.value
    }
    return acc
  }, {})
  $.post(`http://localhost:3000/users/register`, data)
  .done((token) => {
    localStorage.setItem('token', token)
    $('#start').hide()
    $('#dashboard').show()
  })
  .fail((err) => {
    let errorMsg = err.responseJSON.message.split(':').slice(2)
    Swal.fire({
      type: 'error',
      title: 'Error x_x',
      text: errorMsg,
    })
  })
}