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
                    <button data-toggle="collapse" data-target="formMemberCollapse" type="button" id="addMember" class="btn btn-primary" style="margin-left: auto; margin-right: auto; background: #E9ECEF; color: black; border: #E9ECEF; left: 22px">Add member</button>

                    <div id="formMemberCollapse" class="collapse" style="margin-top: 5px">
                        <form id="formMember">
                            <div class="form-group">
                                <label for="emailNewMember">Email address:</label>
                                <input type="email" class="form-control" id="emailNewMember">
                            </div> 
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>
                    </div> 
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
                $('#toastInfo').empty()
                $('#toastInfo').append(`
                    <div class="toast-header">
                        <strong class="mr-auto text-primary">Success add member</strong>
                        <small class="text-muted">a seconds ago</small>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                    </div>
                    <div class="toast-body">
                        ${$('#emailNewMember').val()}
                    </div>
                `)
                $('#toastInfo').toast({
                    delay: 5000
                })
                $('#toastInfo').toast('show')
            })
            .fail( (err) => {
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
    })
}