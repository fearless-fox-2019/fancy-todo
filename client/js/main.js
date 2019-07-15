const baseUrl = 'http://localhost:3000/fancy-todo'

function show(el) {
    $(el).show()
}

function hide(el) {
    $(el).hide()
}

function isLogin(){
    return localStorage.getItem('token')? true :false
}

$(document).ready(function(){
    if (isLogin()) {
        changeDisplay(false, ['.form-login', '.form-register', '#nav-login', '#nav-register'])
        changeDisplay(true, ['.user-dashboard', '#nav-logout', '#nav-userlogin'])
    }else {
        changeDisplay(true, '.form-login')
        changeDisplay(false, ['.user-dashboard','.form-register', '#nav-logout', '#nav-userlogin'])
    }

    //=================login=======================================
    $('#nav-login').click(function(e){
        e.preventDefault()
        changeDisplay(true, '.form-login')
        changeDisplay(false, ['.user-dashboard', '.form-register'])
    })

    $(document).on('click','#submit-login',function(e){
        e.preventDefault()
        
        let email = $('#email').val()
        let password = $('#password').val()
        $.ajax({
            url: `${baseUrl}/users/login`,
            method: 'POST',
            data: {email, password}
        })
        .done(function({token, payload}){
            localStorage.setItem('token', token)
            localStorage.setItem('data', JSON.stringify(payload))
            $('#userlogin').html(payload.username)
            $('.welcome').append(
                '<h3> Welcome to fancy todo</h3>'
            )
            changeDisplay(false, ['.form-login','.form-register', '#nav-register', '#nav-login', '.form-todo', '.list-todos'])
            changeDisplay(true, ['.user-dashboard', '#nav-logout', '#nav-userlogin'])
        })
        .fail(function(err){
            $('.form-login').append(
                ` 
                <div class="row">
                    <div class="col col-lg mt-3">
                        <div class="alert alert-danger" role="alert">
                            ${err.responseJSON.message}
                        </div>
                    </div>
                </div>`
            )
        })

    })

    //===============register===========================
    $('#nav-register').click(function(e){
        changeDisplay(true, '.form-register')
        changeDisplay(false, ['.form-login', '.user-dashboard'])
    })

    $(document).on('click','#submit-register',function(e){
        e.preventDefault()
        let input = {
            username : $('#username').val(),
            email : $('#email-register').val(),
            password : $('#password-register').val()
        }
        $.ajax({
            url: `${baseUrl}/users/register`,
            method: 'POST',
            data: input
        })
        .done(function({message}){
            $('.form-register').append(
                `
                <div class="row">
                    <div class="col col-md-4 mt-3">
                        <div class="alert alert-success" role="alert">
                            ${message}
                        </div>
                    </div>
                </div>`
            )
        })
        .fail(function(err){
            console.log(err)

            $('.messages').empty()
            $('.messages').append(
                `
                <div class="row">
                    <div class="col col-lg mt-3">
                        <div class="alert alert-danger" role="alert">
                            ${err.responseJSON.detail}
                        </div>
                    </div>
                </div>
              `
            )
        })
    })

    //=================list-todo==========================
    $(document).on('click','#side-list-todo',function(e) {
        e.preventDefault()
        changeDisplay(true, '.list-todos')
        changeDisplay(false, '.form-todo')
        listTodo()
    })

    //==========create new todo===============
    $('#side-create-new').click(function(e) {
        e.preventDefault()
        changeDisplay(false, '.list-todos')
        changeDisplay(true, '.form-todo')
    })

    $('#submit-todo').click(function(e) {
        e.preventDefault()
        let {id} = JSON.parse(localStorage.getItem('data'))
        let token = localStorage.getItem('token')
        let input = {
            title: $('#title').val(),
            description: $('#description').val(),
            due_date: $('#due_date').val()
        }
        $.ajax({
            url: `${baseUrl}/todos/${id}/create`,
            method: 'POST',
            data: input,
            headers: {token}
        })
        .done(function({message}) {
            $('.form-todo').append(
                `
                <div class="row">
                    <div class="col col-md-4 mt-3">
                        <div class="alert alert-success" role="alert">
                            ${message}
                        </div>
                    </div>
                </div>
              `
            )
        })
        .fail(function(err) {
            console.log(err)
        })
    })

    //=================delete todo====================
    $(document).on('click','.delete-todo',function(e){
        e.preventDefault()
        let todo_id = $(this).attr("id")
        let {id} = localStorage.getItem('data')
        let token = localStorage.getItem('token')
        $.ajax({
            url: `${baseUrl}/todos/delete/${todo_id}`,
            method: 'DELETE',
            headers: {token}
        })
        .done(function(data) {
            listTodo()
            $('.pop-up').append(
                `<div class="row">
                <div class="col col-lg mt-3">
                    <div class="alert alert-success" role="alert">
                        ${data.message}
                    </div>
                </div>
            </div>`
            )
            setTimeout(function(){
                $('.pop-up').empty()
            },2000)
        })
        .fail(function(err) {
            console.log(err)
            $('.pop-up').append(
                `<div class="row">
                <div class="col col-lg mt-3">
                    <div class="alert alert-danger" role="alert">
                        ${err.responseJSON.detail}
                    </div>
                </div>
            </div>`
            )
            setTimeout(function(){
                $('.pop-up').empty()
            },2000)
        })
    })

    // =================update todo===========================
    $(document).on('click', '.complete-todo', function(e) {
        e.preventDefault()
        let token = localStorage.getItem('token')
        let {id} = JSON.parse(localStorage.getItem('data'))
        let todo_id = $(this).attr("id")
        let cek_status = $(`#${id}`).html()
        let status = cek_status == 'completed'?  false: true
        console.log(id)
        let data = {
            status
        }
        $.ajax({
            url: `${baseUrl}/todos/update/${todo_id}`,
            method: 'PATCH',
            data,
            headers: {token}
        })
        .done(function(data) {
                listTodo()
                $('.pop-up').append(
                    `<div class="row">
                    <div class="col col-lg mt-3">
                        <div class="alert alert-success" role="alert">
                            ${data.message}
                        </div>
                    </div>
                </div>`
                )
                setTimeout(function(){
                    $('.pop-up').empty()
                },2000)
                
        })
        .fail(function(err){
                $('.pop-up').append(
                    `<div class="row">
                    <div class="col col-lg mt-3">
                        <div class="alert alert-danger" role="alert">
                            ${err.responseJSON.detail}
                        </div>
                    </div>
                </div>`
                )
                setTimeout(function(){
                    $('.pop-up').empty()
                },2000)
        })
    })

    //============search==============
    $(document).on('click', '#btn-search', function(e) {
        e.preventDefault()
        let input = $('#search').val()

        $.ajax({
            url: `${baseUrl}/todos/search?`,
            method: 'GET',
            data: {input}
        })
        .done(function(data) {
            $('tbody').empty()
            data.forEach((todo, idx) => {
                let status =todo.status? 'completed': 'uncompleted'
                let buttonTitle = todo.status? 'uncomplete': 'complete'
                let buttonType = todo.status? 'warning': 'success'
                let date = new Date(todo.due_date)
                $('tbody').append(
                    `
                    <tr>
                     <th scope="row">${idx + 1}</th>
                     <td>${todo.title}</td>
                     <td>${todo.description}</td>
                     <td id="${todo._id}">${status}</td>
                     <td>${date.toLocaleDateString()}</td>
                     <td>
                         <div class="d-flex flex-column">
                             <div class="p2">
                                     <button class="btn btn-${buttonType} btn-block mb-2 complete-todo" id="${todo._id}">${buttonTitle}</button>
                             </div>
                             <div class="p2">
                                 <button class="btn btn-danger btn-block mb-2 delete-todo" id="${todo._id}">delete</button>
                             </div>
                         </div>
                     </td>
                    </tr>`
                )
            })
        })
        .fail(function(err) {
            console.log(err)
        })
    })

    //==================filter======================
    $(document).on('click', '#filter', function(e) {
        e.preventDefault()
        let selected = $('#filter>option:selected').text();
        let {id} = JSON.parse(localStorage.getItem('data'))
        console.log(id)
        let token = localStorage.getItem('token')
        $.ajax({
            url: `${baseUrl}/todos/${id}/filterby/${selected.split(' ').join('')}`,
            method: 'GET',
            data: {id},
            headers: {token}
        })
        .done(function(data) {
            console.log(data)
        })
        .fail(function(err) {
            console.log(err)
        })
    })
})

function changeDisplay(change, elements) {
    if (Array.isArray(elements)) {
        elements.forEach(el => {
            if (change) {
                show(el)
            }else {
                hide(el)
            }
        })
    }else {
        if (change) {
            show(elements)
        }else {
            hide(elements)
        }
    }
}

function listTodo() {
    let token = localStorage.getItem('token')
        $.ajax({
            url: `${baseUrl}/todos/list-todo`,
            method: 'GET',
            headers: {token}
        })
        .done(function(todos) {
            $('tbody').empty()
           todos.forEach((todo, idx) => {
               let status =todo.status? 'completed': 'uncompleted'
               let buttonTitle = todo.status? 'uncomplete': 'complete'
               let buttonType = todo.status? 'warning': 'success'
               let date = new Date(todo.due_date)
               $('tbody').append(
                   `
                   <tr>
                    <th scope="row">${idx + 1}</th>
                    <td>${todo.title}</td>
                    <td>${todo.description}</td>
                    <td id="${todo._id}">${status}</td>
                    <td>${date.toLocaleDateString()}</td>
                    <td>
                        <div class="d-flex flex-column">
                            <div class="p2">
                                    <button class="btn btn-${buttonType} btn-block mb-2 complete-todo" id="${todo._id}">${buttonTitle}</button>
                            </div>
                            <div class="p2">
                                <button class="btn btn-danger btn-block mb-2 delete-todo" id="${todo._id}">delete</button>
                            </div>
                        </div>
                    </td>
                   </tr>`
               )
           })
        })
        .fail(function(err) {
            console.log(err)
        })
}