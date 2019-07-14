const baseUrl = 'http://localhost:3000'
let projectId

$(document).ready(function() {
    if (localStorage.getItem('access_token')) {
        isLogin()
    } else {
        lendingPage()
    }

    $('#signin-btn').on('click', function(event) {
        event.preventDefault()
        signIn()
    })
    
    $('#signup-btn').on('click', function(event) {
        event.preventDefault()
        signUp()
    })

    $('#signout-btn').on('click', function(event) {
        event.preventDefault()
        signout()
    })
    
    $('#personal-btn').on('click', function(event) {
        event.preventDefault()
        gotoPersonal()
    })

    $('#project-btn').on('click', function(event) {
        event.preventDefault()
        gotoProject()
    })

    $('#addtodo-btn').on('click', function(event) {
        event.preventDefault()
        gotoPersonal()
    })

    $('#addtodo-submit').on('click', function(event) {
        event.preventDefault()
        addPersonalTodo()
    })

    $('#projecttodo-submit').on('click', function(event) {
        event.preventDefault()
        addProjectTodo(projectId)
    })

    $('#addproject-btn').on('click', function(event) {
        event.preventDefault()
        gotoProject()
    })

    $('#addproject-submit').on('click', function(event) {
        event.preventDefault()
        addProject()
    })
})