const dropdowns = document.querySelectorAll('.dropdown-trigger')
for (let i = 0; i < dropdowns.length; i++) {
  M.Dropdown.init(dropdowns[i]);
}
if (!localStorage.getItem('token')) {
  $("#signout").hide()
  $("#signIn").hide()
  $("#register").show()
}else{
  $("#signout").show()
  $("#signIn").hide()
  $("#register").hide()
}

function getSignin () {
  $("#register").hide()
  $("#signIn").show()
}

function getRegister() {
  $("#register").show()
  $("#signIn").hide()
}

$("#sign-in-btn").click(function () {
  event.preventDefault();
  let username = $('#username').val()
  let password = $('#password').val()
  $.post("http://localhost:3000/users/signin", {
    username,
    password
  })
    .done(function (data) {
      Swal.fire({ type: 'success', title: `Login Success`, showConfirmButton: false })
      localStorage.setItem('token', data.token)
      setTimeout(function () {
        location.reload();
      }, 2000);
    })
    .fail(err => {
      Swal.fire({ type: 'error', title: `${err.responseJSON.err}` })
    })
})

$("#register-btn").click(function () {
  event.preventDefault();
  let username = $('#username1').val()
  let password = $('#password1').val()
  let email = $('#email1').val()
  console.log(email);
  $.post("http://localhost:3000/users/signup", {
    username,
    password,
    email
  })
    .done(function (data) {
      console.log(data);
      Swal.fire({ type: 'success', title: `Register Success`, showConfirmButton: false })
      setTimeout(function () {
        location.reload();
      }, 2000);
    })
    .fail(err => {
      console.log(err);
      Swal.fire({ type: 'error', title: `${err.responseJSON.err}` })
    })
})
