
function checkLogin(isLogin) {
    if (isLogin) {
        $('#beforeLogin').hide()
        $('#afterLogin').show()
    } else {
        $('#beforeLogin').show()
        $('#afterLogin').hide()
    }
}