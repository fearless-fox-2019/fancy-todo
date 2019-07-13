function onSignOut() {
  $('#user-ava').empty()
  localStorage.removeItem('token')
  $('#start').show()
  $('#dashboard').hide()
}