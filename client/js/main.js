$(document).ready(function () {

    homeBase()
    registerButton()
    loginPage()
    loginPost()
    todoPage()
    todoPost()
    home()
    done()
    deleteTodo()
    search()

})

if (localStorage.getItem('token')) {

    $('a.home-switch').removeClass('homebase').addClass('home')
    $('.user-name').append(`${localStorage.name}`)

    $('.logout').show()
    $('.todo-btn').show()

    $('.user-page').show()
    $('.login-btn').hide()
    $('.register-form').hide()

    getMyTodo()
}

function homeBase() {
    $('.homebase').click(function (event) {
        event.preventDefault()
        // console.log('masuk homebase <<<<<<<<<<<<<')
        $('.register-form').empty()
        $('.register-form').append(
            `
            <div class="banner-inner">
                <h1 class="center">Welcome to Fancy Todo</h1>
                <h2>Get a quick register and manage your todo now</h2>
                <form action="">
                    <table>
                        <tr>
                            <td>Name</td>
                            <td><input type="text" name="name" id="name" placeholder="Input your username" required>
                            </td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td><input type="text" name="email" id="email" placeholder="Input your email" required></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input type="password" name="password" id="password" placeholder="Input your password"
                                    required>
                            </td>
                        </tr>
                    </table>
                    <a href="" class="btn-form btn">Register</a>
                </form>
                <br>
                <h2>Login with Google Account</h2>
                <div class="g-signin2 signin" data-onsuccess="onSignIn"></div>
                <script src="https://apis.google.com/js/platform.js" async defer></script>
            </div>
            `
        )

        $('.login-form').hide()
        $('.register-form').show()
    })
}

function registerButton() {
    $(document).on('click', '.btn-form', function (event) {
        event.preventDefault()

        $.ajax({
                method: 'POST',
                url: `${baseURL}/users/register`,
                data: {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    password: $('#password').val()
                }
            })
            .done(response => {
                // console.log(response)
                $('.info').empty()
                $('.info').append(
                    `
                    <span class="message">${response}<span>
                    `
                )
                $('.message').show(300, function () {
                    setTimeout(() => {
                        $('.message').hide(300)
                    }, 1500);
                })
            })
            .fail(err => {
                console.log(err)
                let errors = err.responseJSON.message.split('User validation failed: ')[1].split(',')

                $('.info').empty()

                for (let i = 0; i < errors.length; i++) {
                    $('.info').append(
                        `
                        <span class="error">${errors[i].split(': ')[1]}<span>
                        `
                    )
                    $('.error').show(300, function () {
                        setTimeout(() => {
                            $('.error').hide(300)
                        }, 1200);
                    })
                }
            })
    })
}

function loginPage() {
    $('.login-btn').click(function (event) {
        event.preventDefault()

        $.ajax({
                method: 'GET',
                url: `${baseURL}/users/login`
            })
            .done(response => {
                // console.log(response)
                $('.register-form').hide()
                // $('.todo-form').hide()

                $('.login-form').remove()
                $('.container').append(
                    `
                <div class="banner-outer login-form">
                <div class="banner-inner">
                <h1>Login</h1>
                <form class="login-value" action="">
                        <table>
                            <tr>
                                <td>Email</td>
                                <td><input type="text" name="email" id="email" placeholder="Input your email" required></td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td><input type="password" name="password" id="password" placeholder="Input your password"
                                        required>
                                </td>
                            </tr>
                        </table>
                    <a href="#" class="login-post btn">Login</a>
                </form>
                </div>
                </div>
                `
                )
            })
            .fail(err => {
                console.log(err)
            })

    })
}

function loginPost() {
    $('.container').on('click', '.login-post', function (event) {
        event.preventDefault()

        let result = {}
        $.each($('.login-value').serializeArray(), function () {
            result[this.name] = this.value
        })

        $.ajax({
                method: 'POST',
                url: `${baseURL}/users/login`,
                data: result
            })
            .done(response => {
                localStorage.setItem('token', response.token)
                localStorage.setItem('name', response.username)

                $('.welcome').append(`${localStorage.getItem('name')}`)
                $('a.home-switch').removeClass('homebase').addClass('home')

                $('.logout').show()
                $('.todo-btn').show()
                $('.user-page').show()
                $('.goto').show()
                $('.welcome-title').show()

                $('.login-btn').hide()
                $('.register-form').hide()
                $('.login-form').hide()
                $('.todos').hide()

            })
            .fail(err => {
                console.log(err)
                $('.info').empty()
                $('.info').append(
                    `
                    <span class="error">${err.responseText}<span>
                    `
                )
                $('.error').show(300, function () {
                    setTimeout(() => {
                        $('.error').hide(300)
                    }, 1200);
                })
            })
    })
}

function todoPage() {
    $('.todo-btn').click(function (event) {
        event.preventDefault()

        $('.user-page').hide()
        $('.todo-form').show()
    })
}

function todoPost() {
    $('.todo-post').click(function (event) {
        event.preventDefault()

        let result = {}
        $.each($('.todo-value').serializeArray(), function () {
            result[this.name] = this.value
        })

        $.ajax({
                method: 'POST',
                url: `${baseURL}/todos/add`,
                data: result,
                headers: {
                    'token': localStorage.getItem('token')
                }
            })
            .done(response => {
                console.log('Successfuly created a Todo!')
                $('.info').empty()
                $('.info').append(`<span class="message">${response}</span>`)
                $('.info').show(300, function () {
                    setTimeout(() => {
                        $('.info').hide(300)
                    }, 1500);
                })
            })
            .fail(err => {
                console.log(err.responseJSON.message.split('Todo validation failed: '), 'error dari create todo<<<<<<<<')
                $('.info').empty()
                let errors = err.responseJSON.message.split('Todo validation failed: ')[1].split(',')
                for (let i = 0; i < errors.length; i++) {
                    $('.info').append(
                        `
                        <span class="error">${errors[i].split(': ')[1]}<span>
                        `
                    )
                    $('.error').show(300, function () {
                        setTimeout(() => {
                            $('.error').hide(300)
                        }, 1200);
                    })
                }
            })
    })
}

function home() {
    $(document).on('click', '.home', function (event) {
        event.preventDefault()

        $('.todos-list').empty()

        getMyTodo()

        $('.user-name').empty()
        $('.user-name').append(`${localStorage.name}`)

        $('.todo-form').hide()
        $('.login-btn').hide()
        $('.register-form').hide()
        $('.goto').hide()
        $('.welcome-title').hide()

        $('.logout').show()
        $('.todo-btn').show()
        $('.user-page').show()
        $('.todos').show()
    })
}

function done() {
    $(document).on('click', '.finish', function (event) {
        event.preventDefault()
        let todoId = $(this).attr('class').split(' ')[1]

        $.ajax({
                method: 'PATCH',
                url: `${baseURL}/todos/${todoId}/update`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(response => {
                console.log(response)
                $('.todos-list').empty()
                getMyTodo()
            })
            .fail(err => {
                console.log(err)
            })
    })
}

function deleteTodo() {
    $(document).on('click', '.delete', function (event) {
        event.preventDefault()
        let todoId = $(this).attr('class').split(' ')[1]

        $.ajax({
                type: 'DELETE',
                url: `${baseURL}/todos/${todoId}/delete`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(response => {
                console.log(response)
                $('.todos-list').empty()
                getMyTodo()
            })
            .fail(err => {
                console.log(err)
            })
    })
}

function search() {
    $(document).on('click', '.search', function (event) {
        event.preventDefault()

        let search = $('#search').val()
        console.log(search)
        $.ajax({
                method: 'GET',
                url: `${baseURL}/todos/search?name=${search}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(response => {
                // console.log(response)
                $('.todos-list').empty()
                for (let i = 0; i < response.length; i++) {
                    $('.todos-list').append(
                        `
                        <li class="todo-card">
                            <table style="text-align: left" class="card-table">
                                <tr>
                                    <td>Name</td>
                                    <td>: <span style="font-weight: bold;">${response[i].name}</span></td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>: ${response[i].description}</td>
                                </tr>
                                <tr>
                                    <td>Status</td>
                                    <td>: <span class="${response[i].status}">${response[i].status}</span></td>
                                </tr>
                                <tr>
                                    <td>Due Date</td>
                                    <td>: ${response[i].due_date}</td>
                                </tr>
                            </table>
                            <a href="#" class="finish ${response[i]._id} btn">Done</a>
                            <a href="#" class="delete ${response[i]._id} btn">Delete</a> 
                        </li>
                        `
                    )
                }
            })
            .fail(err => {
                console.log(err)
            })

    })
}

// ======================================= helpers

function getMyTodo() {
    $.ajax({
            method: 'GET',
            url: `${baseURL}/users/todos`,
            headers: {
                'token': localStorage.getItem('token')
            }
        })
        .done(response => {
            let todos = response.todos
            for (let i = 0; i < todos.length; i++) {
                $('.todos-list').append(
                    `
                <li class="todo-card">
                    <table style="text-align: left" class="card-table">
                        <tr>
                            <td>Name</td>
                            <td>: <span style="font-weight: bold;">${todos[i].name}</span></td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>: ${todos[i].description}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td>: <span class="${todos[i].status}">${todos[i].status}</span></td>
                        </tr>
                        <tr>
                            <td>Due Date</td>
                            <td>: ${todos[i].due_date}</td>
                        </tr>
                    </table>
                    <a href="#" class="finish ${todos[i]._id} btn">Done</a>
                    <a href="#" class="delete ${todos[i]._id} btn">Delete</a> 
                </li>
                `
                )
            }
        })
        .fail(err => {
            console.log(err)
        })
}