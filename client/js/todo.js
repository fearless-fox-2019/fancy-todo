function fetchMyTodos() {
    $('#mytodos-incomplete').empty();
    $('#mytodos-complete').empty();
    $('#mytodos-all').empty();
    $('#project-list').empty();

    $
        .ajax({
            url: 'http://localhost:3000/todos/',
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(todos => {
            console.log(todos)
            const options = { weekday: 'short', month: 'long', day: 'numeric' };

            let rawPro = ``;
            let rawAll = ``;
            let rawCom = ``;
            let rawIn = ``;

            todos.forEach(todo => {
                if (todo.status) {
                    rawCom += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large green icon" onclick="updateStatus('${todo._id}', ${!todo.status})"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodo('${todo._id}')">
                            <i class="trash icon"></i>
                        </span>
                        <span class="left floated trash" onclick="editTodo('${todo._id}')">
                            <i class="edit icon"></i>
                        </span>

                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                        </div>
                    </div>
                    `
                } else {
                    rawIn += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large grey icon" onclick="updateStatus('${todo._id}', ${!todo.status})"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodo('${todo._id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="left floated trash" onclick="editTodo('${todo._id}')">
                            <i class="edit icon"></i>
                        </span>
                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                    </div>
                    </div>
                    `
                }
                rawAll += `
                <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large ${todo.status ? "green" : "grey"} icon" onclick="updateStatus('${todo._id}', ${!todo.status})"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodo('${todo._id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="left floated trash" onclick="editTodo('${todo._id}')">
                            <i class="edit icon"></i>
                        </span>
                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                    </div>
                </div>
                `
            })

            $('#mytodos-all').append(rawAll)
            $('#mytodos-incomplete').append(rawIn)
            $('#mytodos-complete').append(rawCom)
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function addTodo() {

    const name = $('#new-todo-name').val()
    const description = $('#new-todo-desc').val() || null
    const due_date = $('#new-todo-due-date').val() || null

    console.log(name, description, due_date)
    $
        .ajax({
            url: 'http://localhost:3000/todos/',
            method: 'POST',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                name, description, due_date
            }
        })
        .done(response => {
            fetchMyTodos()
            fetchMyProjects()

        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function updateTodo(id) {

    const name = $('#edit-todo-name').val()
    const description = $('#edit-todo-desc').val() || null
    const due_date = $('#edit-todo-due-date').val() || null
    
    event.preventDefault()

    $
        .ajax({
            url: `http://localhost:3000/todos/${id}`,
            method: 'PATCH',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data : {
                name, description, due_date
            }
        })
        .done(response => {
            fetchMyTodos()
            fetchMyProjects()

        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function updateStatus(id, status){
    event.preventDefault();

    $
        .ajax({
            url: `http://localhost:3000/todos/${id}`,
            method: 'PATCH',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                status: status
            }
        })
        .done(response => {
            fetchMyTodos();
            fetchMyProjects();

        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function editTodo(id) {
    console.log('masuk edit')
    $
        .ajax({
            url: `http://localhost:3000/todos/${id}`,
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(response => {
            localStorage.setItem('idTodo', id)
            $('#edit-form').modal('show')
            console.log(response)
            const today = new Date

            $('#edit-todo-name').val(response.name)
            $('#edit-todo-desc').val(response.description)
            $('#date_calendar_edit').calendar({
                type: 'date',
                minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            })
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function deleteTodo(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $
                    .ajax({
                        url: `http://localhost:3000/todos/${id}`,
                        method: 'delete',
                        headers: {
                            accesstoken: localStorage.getItem('accesstoken')
                        }
                    })
                    .done(response => {
                        fetchMyTodos()
                        fetchMyProjects()

                        swal("Todo deleted!", {
                            icon: "success",
                        })
                    })
                    .fail((jqXHR, textstatus) => {
                        swal(jqXHR.responseJSON.message)
                    })
            }
        })
}