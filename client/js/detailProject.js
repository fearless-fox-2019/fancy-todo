function appendLeadingZeroes(n) {
    if(n <= 9){
      return "0" + n;
    }
    return n
}

function detailProject(project, nameColumn) {

    $(`#${project._id}${nameColumn}`).on('click', function(event) {
        event.preventDefault()
        console.log(project.admin)

        $(`#projectDetail .detailProject`).empty()
        $(`#projectDetail .detailProject`).append(`
            <div class="card" style="width: auto; height: auto; top: 24px">
                <div class="card-body">
                    <h5 class="card-title">Name: ${project.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Admin: ${project.admin.email}</h6><br>
                    <div class="container">
                        <div class="row">
                            <div class="col-6">
                                <p class="card-text">Member: </p>
                                <ul class="list-group" id="memberList">
                    
                                </ul>
                            </div>
                            <div class="col-6">
                                <p class="card-text">Todos: </p>
                                <ul class="list-group" id="todoList">
            
                                </ul>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="container">
                        <div class="d-flex row justify-content-between">
                            <div class="col-6">
                                <button data-toggle="collapse" data-target="#formMemberCollapse" type="button" id="addMember" class="btn btn-primary" style="margin-left: auto; margin-right: auto; background: #E9ECEF; color: black; border: #E9ECEF;">Add member</button>
                            </div>
                            <div class="col-6">
                                <button data-toggle="collapse" data-target="#formTodoCollapse" type="button" id="addTodo" class="btn btn-primary" style="margin-left: auto; margin-right: auto; background: #E9ECEF; color: black; border: #E9ECEF; position: absolute;">Add todo</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div id="formMemberCollapse" class="collapse" style="margin-top: 4px; margin-left: auto; margin-right: auto">
                                    <form id="formMember">
                                        <div class="form-group">
                                            <label for="emailNewMember">Email address:</label>
                                            <input type="email" class="form-control" id="emailNewMember">
                                        </div> 
                                        <button type="submit" class="btn btn-primary" style="margin-left: auto; margin-right: auto; background: #E9ECEF; color: black; border: #E9ECEF;">Submit</button>
                                    </form>
                                </div>
                            </div>
                            <div class="col-6">
                                <div id="formTodoCollapse" class="collapse" style="margin-top: 4px; margin-left: auto; margin-right: auto">
                                    <form id="formTodo">
                                        <div class="form-group">
                                            <label for="nameTodo">Todo name: </label>
                                            <input type="text" class="form-control" id="nameTodo">
                                            <label for="descriptionTodo">Todo description: </label>
                                            <input type="text" class="form-control" id="descriptionTodo">
                                        </div> 
                                        <div class="form-group">
                                        <label for="due_date">Due: </label>
                                        <input class="form-control" type="date" value="${new Date().getFullYear}-${new Date().getMonth}-${new Date().getDay}" id="due_date">
                                        </div>
                                        <button type="submit" class="btn btn-primary" style="margin-left: auto; margin-right: auto; background: #E9ECEF; color: black; border: #E9ECEF;">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
        
        for (var i=0; i<project.members.length; i++) {
            $('#memberList').append(`
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${project.members[i].email}
                </li>
            `)
        }

        $.ajax({
            method: 'get',
            url: `http://localhost:3000/todos/${project._id}`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done( (todos) => {
            todos.forEach( (todo) => {
                todo.due_date = new Date(todo.due_date)
                let formatted_date = todo.due_date.getFullYear() + "-" + appendLeadingZeroes(todo.due_date.getMonth() + 1) + "-" + appendLeadingZeroes(todo.due_date.getDate())
                if (todo.status == false) {
                    $('#todoList').append(`
                    <li id="listgroup${todo._id}" class="list-group-item d-flex justify-content-left align-items-center">
                        <a id="${todo._id}">
                            <span id="iconcheck${todo._id}"><i class="far fa-square"></i></span>
                            <span style="margin-left: 10px; margin-bottom: 4px"> ${todo.name}, <small>Due: ${formatted_date}</small></span> <a id="delete${todo._id}" style="right: 15px; position: absolute"><i class="fas fa-times"></i></a>
                        </a>
                    </li>
                    `)
                } else {
                    $('#todoList').append(`
                    <li id="listgroup${todo._id}" class="list-group-item d-flex justify-content-left align-items-center">
                        <a id="${todo._id}">
                            <span id="iconcheck${todo._id}"><i class="far fa-check-square"></i></span>
                            <span style="margin-left: 10px; margin-bottom: 4px"> ${todo.name}, <small>Due: ${formatted_date}</small></span> <a id="delete${todo._id}" style="right: 15px; position: absolute"><i class="fas fa-times"></i></a>
                        </a>
                    </li>
                    `)
                }

                $(`#${todo._id}`).on('click', function(event) {
                    event.preventDefault()
                    if (todo.status == false) {
                        todo.status = true
                    } else {
                        todo.status = false
                    }
                    console.log(todo.status)
                    $.ajax({
                        url: `http://localhost:3000/todos/${todo._id}`,
                        method: 'patch',
                        data: {
                            status: todo.status
                        },
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    })
                    .done( (response) => {
                        console.log(response)
                        $(`#iconcheck${response._id}`).empty()

                        if (response.status) {
                            $(`#iconcheck${response._id}`).append(`
                                <i class="far fa-check-square"></i>
                            `)  
                        } else {
                            $(`#iconcheck${response._id}`).append(`
                                <i class="far fa-square"></i>
                            `) 
                        }                      
                    })
                    .fail( (err) => {
                        console.log(err)
                        $('#toastInfo').empty()
                        $('#toastInfo').append(`
                            <div class="toast-header">
                                <strong class="mr-auto text-primary">Update todo error</strong>
                                <small class="text-muted">a seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                            </div>
                            <div class="toast-body">
                                Failed changing todo information
                            </div>
                        `)
                        $('#toastInfo').toast({
                            delay: 5000
                        })
                        $('#toastInfo').toast('show')
                    })
                })

                $(`#delete${todo._id}`).on('click', function(event) {
                    $.ajax({
                        method: 'delete',
                        url: `http://localhost:3000/todos/${todo._id}`,
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    })
                    .done( (response) => {
                        console.log(response)
                        $(`#listgroup${todo._id}`).remove()
                    })
                    .fail( (err) => {
                        console.log(err)
                        $('#toastInfo').empty()
                        $('#toastInfo').append(`
                            <div class="toast-header">
                                <strong class="mr-auto text-primary">Delete failed</strong>
                                <small class="text-muted">a seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                            </div>
                            <div class="toast-body">
                                Error occured while deleting todo
                            </div>
                        `)
                        $('#toastInfo').toast({
                            delay: 5000
                        })
                        $('#toastInfo').toast('show')
                    })
                })
            })
        })
        .fail( (err) => {
            console.log(err)
            $('#toastInfo').empty()
            $('#toastInfo').append(`
                <div class="toast-header">
                    <strong class="mr-auto text-primary">Fetch error</strong>
                    <small class="text-muted">a seconds ago</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                </div>
                <div class="toast-body">
                    Failed getting todo information
                </div>
            `)
            $('#toastInfo').toast({
                delay: 5000
            })
            $('#toastInfo').toast('show')
        })

        $('#formMember').on('submit', function(event) {
            event.preventDefault()
            $.ajax({
                method: 'patch',
                url: `http://localhost:3000/projects/member/${project._id}/${$('#emailNewMember').val()}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done( (response) => {
                console.log(response)
                $('#toastInfo').empty()
                $('toastInfo').append(`
                    <div class="toast-header">
                    <strong class="mr-auto text-primary">Success</strong>
                    <small class="text-muted">a seconds ago</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                    </div>
                    <div class="toast-body">
                    ${$('#emailNewMember').val()} added to project ${project.name}
                    </div>
                `)
                $('toastInfo').toast({
                    delay: 5000
                })
                $('toastInfo').toast('show')
                $('#memberList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${$('#emailNewMember').val()}
                    </li>
                `)
            })
            .fail( (err) => {
                console.log(err)
                $('#toastInfo').empty()
                $('#toastInfo').append(`
                    <div class="toast-header">
                        <strong class="mr-auto text-primary">Failed</strong>
                        <small class="text-muted">a seconds ago</small>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                    </div>
                    <div class="toast-body">
                        Error occured while trying to add member to project
                    </div>
                `)
                $('#toastInfo').toast({
                    delay: 5000
                })
                $('#toastInfo').toast('show')
            })
        })

        $('#formTodo').on('submit', function(event) {
            event.preventDefault()
            $.ajax({
                method: 'post',
                url: `http://localhost:3000/todos/${project._id}`,
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    name: $('#nameTodo').val(),
                    description: $('#descriptionTodo').val(),
                    due_date: $('#due_date').val()
                }
            })
            .done( (response) => {
                console.log(response)
                response.info.due_date = new Date(response.info.due_date)
                let formatted_date = response.info.due_date.getFullYear() + "-" + appendLeadingZeroes(response.info.due_date.getMonth() + 1) + "-" + appendLeadingZeroes(response.info.due_date.getDate())
                $('#toastInfo').empty()
                $('toastInfo').append(`
                    <div class="toast-header">
                    <strong class="mr-auto text-primary">Success</strong>
                    <small class="text-muted">a seconds ago</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                    </div>
                    <div class="toast-body">
                    ${$('#nameTodo').val()} added to project ${project.name}
                    </div>
                `)
                $('toastInfo').toast({
                    delay: 5000
                })
                $('toastInfo').toast('show')
                $('#todoList').append(`
                    <li id="listgroup${response.info._id}" class="list-group-item d-flex justify-content-left align-items-center">
                        <a id="${response.info._id}">
                            <span id="iconcheck${response.info._id}"><i class="far fa-square"></i></span>
                            <span style="margin-left: 10px; margin-bottom: 4px"> ${response.info.name}, <small>Due: ${formatted_date}</small></span> <a id="delete${response.info._id}" style="right: 15px; position: absolute"><i class="fas fa-times"></i></a>
                        </a>
                    </li>
                `)
                $(`#${response.info._id}`).on('click', function(event) {
                    event.preventDefault()
                    let status
                    if (response.info.status == false) {
                        status = true
                    } else {
                        status = false
                    }
                    $.ajax({
                        url: `http://localhost:3000/todos/${response.info._id}`,
                        method: 'patch',
                        data: {
                            status: status
                        },
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    })
                    .done( (response) => {
                        console.log(response)
                        $(`#iconcheck${response._id}`).empty()

                        if (response.status) {
                            $(`#iconcheck${response._id}`).append(`
                                <i class="far fa-check-square"></i>
                            `)  
                        } else {
                            $(`#iconcheck${response._id}`).append(`
                                <i class="far fa-square"></i>
                            `) 
                        } 
                    })
                    .fail( (err) => {
                        console.log(err)
                        $('#toastInfo').empty()
                        $('#toastInfo').append(`
                            <div class="toast-header">
                                <strong class="mr-auto text-primary">Update todo error</strong>
                                <small class="text-muted">a seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                            </div>
                            <div class="toast-body">
                                Failed changing todo information
                            </div>
                        `)
                        $('#toastInfo').toast({
                            delay: 5000
                        })
                        $('#toastInfo').toast('show')
                    })
                })

                $(`#delete${response.info._id}`).on('click', function(event) {
                    $.ajax({
                        method: 'delete',
                        url: `http://localhost:3000/todos/${response.info._id}`,
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    })
                    .done( (response) => {
                        console.log(response)
                        $(`#listgroup${response.info._id}`).remove()
                    })
                    .fail( (err) => {
                        console.log(err)
                        $('#toastInfo').empty()
                        $('#toastInfo').append(`
                            <div class="toast-header">
                                <strong class="mr-auto text-primary">Delete failed</strong>
                                <small class="text-muted">a seconds ago</small>
                                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                            </div>
                            <div class="toast-body">
                                Error occured while deleting todo
                            </div>
                        `)
                        $('#toastInfo').toast({
                            delay: 5000
                        })
                        $('#toastInfo').toast('show')
                    })
                })
            })
            .fail( (err) => {
                console.log(err)
                $('#toastInfo').empty()
                $('#toastInfo').append(`
                    <div class="toast-header">
                        <strong class="mr-auto text-primary">Failed</strong>
                        <small class="text-muted">a seconds ago</small>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                    </div>
                    <div class="toast-body">
                        Error occured while trying to add todo to project
                    </div>
                `)
                $('#toastInfo').toast({
                    delay: 5000
                })
                $('#toastInfo').toast('show')
            })
        })
    })
}