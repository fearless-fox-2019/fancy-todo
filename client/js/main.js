function checkLogin(){
    if (localStorage.getItem("token") !== null) {
        $('#navbar').show()
        $('#todolist').show()
        $('#modalCreate').show()
        $("#loginForm").hide()
        $("#regisForm").hide()
        
        showTodo()
    } else {
        $('#navbar').hide()
        $('#todolist').hide()
        $('#modalCreate').hide()
        $('#modalProject').hide()
        $("#loginForm").show()
        $("#regisForm").hide()
        $('#modaltodoProject').hide()
        $('#ownProject').empty()
        $('#collabProject').empty()
        $('#projectDesc').empty()
        $('#projectDetail').hide()
        $('#homeProject').hide()
        
    }

}


$(document).ready(function(){
    checkLogin()
})
