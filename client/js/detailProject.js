function detailProject(project, nameColumn) {

    $(`#${project._id}${nameColumn}`).on('click', function(event) {
        event.preventDefault()

        $(`#projectDetail .detailProject`).empty()
        $(`#projectDetail .detailProject`).append(`
            <div class="card" style="width: auto; top: 1px">
                <div class="card-body">
                    <h5 class="card-title">Name: ${project.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Admin: ${project.admin}</h6>
                    <p class="card-text">Member: </p>
                    <br>
                    <ul class="list-group" id="memberList">
        
                    </ul>
                    <br><br>
                    <p class="card-text">Todos: </p>
                    <ul class="list-group" id="todoList">

                    </ul>
                </div>
            </div>
        `)
        for (var i=0; i<project.members.length; i++) {
            $('#memberList').append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${project.member[i].email}
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
                if (todo.status == false) {
                    $('#todoList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        [ ] ${todo.name}
                    </li>
                    `)
                } else {
                    $('#todoList').append(`
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        [x] ${todo.name}
                    </li>
                    `)
                }
                
            })
        })
        .fail( (err) => {
            console.log(err)
            alert('error')
        })
    })
}