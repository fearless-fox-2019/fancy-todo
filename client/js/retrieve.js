function retrieveProject() {
    $.ajax({
        url: `${baseUrl}/projects`,
        type: 'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(projects => {
        $('#project-list').empty()
        $.each(projects, function(i, project) {
            $('#project-list').append(`
                <div style="border-bottom: solid black 1px;">
                    <p onclick="projectDetail('${project._id}')" class="pointer"> ${project.name} </p>
                    <button class="btn btn-danger" onclick="deleteProject('${project._id}')" style="margin-bottom: 5%; margin-top: -5%; width: 100%;"> Delete </button>
                </div>
            `)
        })
    })
    .fail(error => {
        console.log(error)
    })
}

function projectDetail(id) {
    // Retrieve Project
    $.ajax({
        url: `${baseUrl}/projects/${id}`,
        type: 'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(project => {
        $('#project-member').empty()
        $('#project-todo').empty()
        $('#addprojecttodo-btn').empty()
        // Button add todo
        projectId = project._id
        $('#addprojecttodo-btn').append(`
            <span class="col-3" />
            <button onclick="retrieveUserNotMember('${projectId}')" class="btn btn-dark col-4" data-toggle="modal" data-target="#addmember-modal"> Add Project's Member </button>
            <span class="col-1" />
            <button class="btn btn-dark col-4" data-toggle="modal" data-target="#addtodoProject"> Create Project Todo </button>
        `)

        // Show Member
        $.each(project.members, function(i, member) {
            $('#project-member').append(`
                <li> ${member.name} </li>
            `)
        })

        // Show Todo
        $.each(project.todos, function(i, todo) {
            $('#project-todo').append(`
                Title: ${todo.title} <br>
                Desc :${todo.description} <br>
                Duedate: ${todo.duedate} <br>
                <button class="btn btn-dark" onclick="gotoEdit('${todo.title}','${todo.description}','${todo._id}','${todo.status}')" data-toggle="modal" data-target="#edit-modal"> Edit </button>
                <button class="btn btn-danger" onclick="deleteTodo('${todo._id}')"> Delete </button>
                <hr>
            `)
        })
    })
    .fail(error => {
        console.log(error)
    })

}

function retrieveUserNotMember(id) {
    $.ajax({
        url: `${baseUrl}/projects/user/${id}`,
        type: 'GET',
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(users => {
            $('#addmemberProject').html(`
            <div class="modal fade" id="addmember-modal"> 
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <!-- Modal Header -->
                        <div class="modal-header">
                            <h4 class="modal-title" style="margin-left: 1%"> Add New Member </h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <!-- Modal body --> 
                        <div class="modal-body">
                            <div id="user" style="margin-left:1%; margin-right: 1%;">
            `)                  
            $.each(users, function(i, user) {
            $('#user').append(`
                                <h6>${user.name}<button onclick="sendEmail('${user._id}')" class="btn btn-dark" style="margin-left: 65%;"> Add to Project </button></h6><hr>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `)
        })
    })
    .fail(error => {
        console.log(error)
    })
}

function sendEmail(userId) {
    $.ajax({
        url: `${baseUrl}/projects/email/${projectId}/${userId}`,
        type: 'POST',
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(data => {
        retrieveProject()
    })
    .fail(err => {
        console.log(err)
    })
}

function retrievePersonal() {
    $.ajax({
        url: `${baseUrl}/todos`,
        type: 'GET',
        headers: {
            access_token: localStorage.access_token
        }
    })
    .done(todos => {
        $('#main-personal').empty()
        let arr = []
        $.each(todos, function(i, todo) {
            if (!todo.projectId && todo.userId == localStorage.userId) {
                arr.push(todo)
            }
        })

        $.each(arr, function(i, todo) {
            $('#main-personal').append(`
                <div class="col-10">
                    <h3> ${todo.title} </h3>
                    <h5> Description: ${todo.description} </h5>
                    <h6> Due Date : ${todo.duedate} </h6>
                    <hr>
                </div>
                <div class="col-2">
                    <button class="btn btn-dark" style="width: 100%;" onclick="gotoEdit('${todo.title}','${todo.description}','${todo._id}','${todo.status}')" data-toggle="modal" data-target="#edit-modal"> Edit </button>
                    <button class="btn btn-danger" style="margin-top:8%; width: 100%;" onclick="deleteTodo('${todo._id}')"> Delete </button>
                </div>
            `)
        })
    })
    .fail(error => {
        console.log(error)
    })
}
