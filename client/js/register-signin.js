const Url = axios.create({
  baseUrl : 'http://localhost:3000',
})

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
    console.log(err);
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
    console.log(errorMsg);
  })
}