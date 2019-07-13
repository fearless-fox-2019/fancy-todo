function onSignOut() {
  localStorage.removeItem('token')
  $('#start').show()
  $('#dashboard').hide()
}