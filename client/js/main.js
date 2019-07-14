$('#project-list-page').hide()

if (localStorage.getItem('accesstoken')) {
    $('#sign-in-form').hide()
    $('#mytodos').show()
    $('nav').show()
    $('#project-page').hide()
} else {
    $('#sign-in-form').show()
    $('#mytodos').hide()
    $('nav').hide()
    $('#project-page').hide()
}

$(document).ready(function () {
    if (localStorage.getItem('accesstoken')) {
        fetchMyTodos()
        fetchMyProjects()
    }

    $('#view-project-list').on('click', () => {
        $('#project-list-page').show()
        $('#mytodos').hide()
        $('#view-project-list').addClass('active')
        $('#project-page').hide()
    })

    $('#view-mytodos').on('click', () => {
        $('#project-list-page').hide()
        $('#mytodos').show()
        $('#view-project-list').removeClass('active')
        $('#project-page').hide()
    })

    $('#sign-up-form').hide()

    $('#sign-up-show').on('click', () => {
        $('#sign-in-form').fadeToggle(() => {
            $('#sign-up-form').fadeIn()
        })
    })

    $('#sign-in-show').on('click', () => {
        $('#sign-up-form').fadeToggle(() => {
            $('#sign-in-form').fadeIn()
        })
    })

    $('.check').on('click', event => {
        $(event.target).toggleClass('green')
        $(event.target).toggleClass('grey')

    })

    $('.menu .item').tab()

    $('#add-todo-button').on('click', () => {
        const today = new Date

        resetNewTodoForm()

        $('#todo-form').modal('show')
        
        $('#date_calendar').calendar({
            type: 'date',
            minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        })
    })
    
    $('#add-project-button').on('click', () => {
        resetNewTodoForm()
        $('#new-project-name').val('')
        $('.ui.tiny.modal.project').modal('show')
    })

    $('#view-members-button').on('click', () => {
        $('.ui.tiny.modal.members').modal('show')
    })

    $('#add-member-button').on('click', () => {
        $('.ui.tiny.modal.addmember').modal('show')
    })
})

function resetNewTodoForm() {
    $('#new-todo-name').val('')
    $('#new-todo-desc').val('')
    $('#date_calendar').calendar('clear')
}

function resetLoginForm() {
    $('#email-login').val('')
    $('#password-login').val('')
}

function register() {
    event.preventDefault()

    const name = $('#name-register').val()
    const email = $('#email-register').val()
    const password = $('#password-register').val()

    $
        .ajax({
            url: `http://localhost:3000/users/register`,
            method: 'POST',
            data: {
                name, email, password
            }
        })
        .done(response => {
            $('#sign-up-form').fadeToggle(() => {
                $('#sign-in-form').fadeIn()
            })
        })
        .fail((jqXHR, textstatus) => {
            console.log(jqXHR)
        })
}

function login() {
    event.preventDefault()

    const email = $('#email-login').val()
    const password = $('#password-login').val()

    $
        .ajax({
            url: `http://localhost:3000/users/login`,
            method: 'post',
            data: {
                email, password
            }
        })
        .done(response => {
            localStorage.setItem('accesstoken', response.accesstoken)

            postLogin()
            resetLoginForm()
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function onSignIn(googleUser) {
    event.preventDefault()
    const id_token = googleUser.getAuthResponse().id_token

    $
        .ajax({
            url: 'http://localhost:3000/users/google-login',
            method: 'post',
            data: {
                token: id_token
            }
        })
        .done((response) => {
            localStorage.setItem('accesstoken', response.accesstoken)

            postLogin()
        })
        .fail((jqXHR, textstatus) => {
            console.log(jqXHR)
        })

}

function logout() {
    const auth2 = gapi.auth2.getAuthInstance()
    if (auth2) {
        auth2
            .signOut()
            .then(function () {
                localStorage.clear()

                prelogin()
            })
            .catch(err => {
                localStorage.clear()
                console.log(err)
            })
    } else {
        localStorage.clear()
    }
}

function prelogin() {
    $('#mytodos').hide()
    $('#project-list-page').hide()
    $('#project-page').hide()
    $('#sign-in-form').fadeIn()
    $('nav').hide()
}

function postLogin() {
    fetchMyProjects()
    $('#project-page').hide()
    $('#mytodos').fadeIn()
    $('#sign-in-form').hide()
    $('nav').fadeIn()

    $('#add-todo-button').on('click', () => {
        const today = new Date

        resetNewTodoForm()

        $('#todo-form').modal('show')
        $('#date_calendar').calendar({
            type: 'date',
            minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        })
    })

}