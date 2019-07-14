function onSignOut() {
  localStorage.removeItem('token')
  $('#start').show()
  $('#dashboard').hide()
  $('#user-ava').attr('src', './images/default.jpg')
  $('#all-task').empty()
}