function OwnProject() {
    $.ajax({
        method: "GET",
        url: `${baseUrl}/projects/my`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(resp => {
            console.log(resp);
            $('#ownProject').empty()
            if (resp.length <= 0) {
                $('#ownProject').append(`
                <ul class="list-group">
                    <li class="list-group-item list-group-item-light">No Owning Project</li>
                </ul>
                `)
            } else {
                resp.forEach(data => {
                    $('#ownProject').append(`
            <ul class="list-group">
            <div class="d-flex flex-column">
                        <div d-flex flex-row>
                           <span class="deleteProject" id="${data._id}"> <i class="fa fa-lg fa-trash trash-icon" aria-hidden="true"></i> </span>| 
                           <span class="editproject" id="${data._id}" data-toggle="modal" data-target="#editTodoModal2" data-whatever="@mdo"><i class="fa fa-lg fa-pencil pencil-icon" aria-hidden="true"></i></span> 
                        </div>
                        
                    </div>
                <li class="list-group-item list-group-item-action list-group-item-warning listGroup" id="${data._id}">${data.name}
                    
                </li>
                    
            </ul>
            `)
                });
                editProject()
                deleteProject()
            }
            $('.listGroup').click(function (event) {
                event.preventDefault()
                detail(this.id)
            })
        })
        .fail(err => {
            console.log(err);

        })
}

function invitingProject() {
    $.ajax({
        method: "GET",
        url: `${baseUrl}/projects/group`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(resp => {
            console.log(resp, 'invi');

            $('#collabProject').empty()
            if (resp.length <= 0) {
                $('#collabProject').append(`
                <ul class="list-group">
                    <li class="list-group-item swal.fire({
                        type: "error",
                        title: err.responseJSON.message
                    })list-group-item-light">No Inviting Project</li>
                </ul>
                `)
            } else {
                resp.forEach(data => {
                    $('#collabProject').append(`
            <ul class="list-group">
                <li class="list-group-item list-group-item-action list-group-item-danger listCollab" id="${data._id}">${data.name}</li>
            </ul>
            `)
                });
            }
            $('.listCollab').click(function (event) {
                event.preventDefault()
                detail(this.id)
            })
        })
        .fail(err => {
            console.log(err);

        })
}
function projectmenu() {
    $('#projectDetail').hide()
    $('#homeProject').show()
    $('#modaltodoProject').hide()
    $('#ownProject').empty()
    $('#collabProject').empty()
    $('#projectDesc').empty()
    $('#todoproject').empty()
    OwnProject()
    invitingProject()
}

function detail(id) {
    $.ajax({
        method: "GET",
        url: `${baseUrl}/projects/detail/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(resp => {
            console.log(resp, '====');

            $('#homeProject').hide()
            $('#modaltodoProject').show()
            $('#projectDetail').show()
            $('#projectDesc').empty()
            $('#projectDesc').append(`
        <li class="list-group-item">
        Project Name: 
        <b>
           ${resp.name}</b>
        </li>
        <li class="list-group-item">Description: <b>${resp.description}</b></li>
        <li class="list-group-item">
        add members
        <form class="form-inline">
                    <div class="md-form my-0">
                        <input class="form-control mr-sm-2" type="text" placeholder="enter email" id="searchUser"
                            aria-label="Search">
                        <i class="fa fa-lg fa-user" aria-hidden="true"></i>
                    </div>
                </form>
        </li>
        <li class="list-group-item"><b>Members:<br></b>
        <div id="listmembers">
        
        </div>
        <div id="listuser"></div>
        <li class="list-group-item">Created By: <b>${resp.user_id.username}</b></li>
        
        `)
            resp.members.forEach(data => {
                $('#listmembers').append(`
            
            ${data.username}
            <span class="deleteMember" id="${data._id}"> <i class="fa fa-lg fa-times-circle trash-icon" aria-hidden="true"></i> </span>
            <br> 
        </li>
            `)
            });
            addMember(resp._id)
            createTodo(resp._id)
            displaytodo(resp._id)
            pullMember(id)
        })
        .fail(err => {
            swal.fire({
                type: "error",
                title: err.responseJSON.message
            })
            console.log(err);

        })
}

function displaytodo(id) {
    $.ajax({
        method: "GET",
        url: `${baseUrl}/projects/detail/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(resp => {
            $('#todoproject').empty()
            if (resp.todos.length <= 0) {
                $('#todoproject').append(`<p style="color: #ee6e73">what todo in this project? Create a new One!</p>`)
            } else {
                resp.todos.forEach(data => {
                    $('#todoproject').append(`
                <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${data.name} <span id="${data._id}" class="badge badge-pill badge-warning">${(data.status == false ? 'set to complete' : 'completed')}</span></h5>
                    <div class="d-flex flex-column">
                        <small>${moment(data.createdAt).startOf('hour').fromNow()}</small>
                        <div d-flex flex-row>
                           <span class="deleteTodo" id="${data._id}"> <i class="fa fa-lg fa-trash trash-icon" aria-hidden="true"></i> </span>| 
                           <span class="editTodo" id="${data._id}" data-toggle="modal" data-target="#editTodoModal" data-whatever="@mdo"><i class="fa fa-lg fa-pencil pencil-icon" aria-hidden="true"></i></span> 
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-column"> 
                    <p class="mb-1">${data.description}</p>
                    <span class="speakTodo" id="${data._id}" onclick='responsiveVoice.speak("${data.description}");'> <i class="fa fa-volume-up fa-lg volume-icon" aria-hidden="true"></i> </span>
                    <small>${(moment(data.due_date).endOf('day').fromNow() === undefined ? 'expired' : moment(data.due_date).endOf('day').fromNow())}</small>
                </div>
            </a>
            `)
                });
                deleteTodos()
                editTodos()
                updateStatusTodo()
            }
        })
        .fail(err => {
            console.log(err);

        })

}

function editProject() {
    $('.editproject').click(function (event) {
        event.preventDefault()

        $.ajax({
            method: "GET",
            url: `${baseUrl}/projects/one/${this.id}`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(function (data) {
                $('#namePr').val(data.name)
                $('#descriptionPr').val(data.description)
                $('#pid').val(data._id)
            })
            .fail(function (err) {
                console.log(err);

            })
    })
}

function addMember(idProject) {
    $('#searchUser').keypress(function (event) {
        let search = $('#searchUser').val()
        console.log(search);

        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == 13) {
            event.preventDefault()
            console.log(search, '======');

            $.ajax({
                method: 'GET',
                url: `${baseUrl}/users/find?email=${search}`
            })
                .done(resp => {
                    $('#listuser').empty()
                    $('#searchUser').val('')
                    if (resp == null) {
                        $('#listuser').append(`
                    <p style="color: red;">email not found</p>
                `)
                    }
                    else {
                        $('#listuser').append(`
                <li class="list-group-item">${resp.username}
                <button class="btn btn-outline-danger" id='addMember-btn'>add</button>
                </li>
                `)
                    }
                    pushMember(idProject, resp)
                })
                .fail(err => {
                    swal.fire({
                        type: "error",
                        title: err.responseJSON.message
                    })
                })
        }
        event.stopPropagation();
    })
}

function pushMember(idproject, user) {
    $('#addMember-btn').click(function () {
        $.ajax({
            method: 'PATCH',
            url: `${baseUrl}/projects/${idproject}/invite`,
            data: {
                userid: user._id
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done((data) => {
                detail(idproject)
                sendEmailto(idproject,user)
                //emailer
                swal.fire({
                    type: "success",
                    title: `Email notification is sending to ${user.email}`
                })
            })
            .fail(err => {
            
                swal.fire({
                    type: "error",
                    title: err.responseJSON.message
                })
            })

    })
}

function pullMember(idproject) {
    $('.deleteMember').click(function (e) {
        e.preventDefault()
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
            .then((result) => {
                if (result.value) {
                    removeMember(idproject,this.id)
                } else {
                    swal.fire({
                        title: "cancel remove member",
                        type: "success"
                    });
                }
            });
        
    })
}

function removeMember(idproject,id){
    $.ajax({
        method: 'PATCH',
        url: `${baseUrl}/projects/${idproject}/remove`,
        data: {
            userid: id
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((data) => {
            detail(idproject)
            
        })
        .fail(err => {
        
            swal.fire({
                type: "error",
                title: err.responseJSON.message
            })
        })
}

function sendEmailto(idProject,user){
    console.log('permisi');
    
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/projects/send/${idProject}/${user.email}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(resp => {
        console.log('masukEMAIL');
                
    })
    .fail(err => {
        console.log(err);
        
    })
}

function createTodo(id) {
    $('#submitAddTdoProject').click(function (e) {
        e.preventDefault()
        let name = $('#title2').val()
        let desc = $('#description2').val()
        let due_date = $('#duedate2').val()

        if (name != '' && desc != '' && due_date != '') {
            $.ajax({
                method: 'PUT',
                url: `${baseUrl}/projects/${id}`,
                data: {
                    name,
                    desc,
                    due_date
                },
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .done(resp => {
                    $('#addTodoModal2').modal('hide')
                    swal.fire({
                        type: "success",
                        title: "todo is in your project now"
                    })
                    displaytodo(id)
                    $('#title2').val('')
                    $('#description2').val('')
                    $('#duedate2').val('')
                })
                .fail(err => {
                    todo
                    swal.fire({
                        type: "error",
                        title: err.responseJSON.message
                    })
                })
        } else {
            swal.fire({
                type: "error",
                title: "please complete the form"
            })
        }
    })
}

function deleteProject() {
    $('.deleteProject').click(function (e) {
        e.preventDefault()
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
            .then((result) => {
                if (result.value) {
                    removeProject(this.id)
                } else {
                    swal.fire({
                        title: "cancel remove project",
                        type: "success"
                    });
                }
            });
    })
}

function removeProject(id) {
    event.preventDefault()

    $.ajax({
        method: "DELETE",
        url: `${baseUrl}/projects/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (todo) {
            Swal.fire(
                'Deleted!',
                'Your project has been deleted.',
                'success'
            )
            projectmenu()
        })
        .fail(function (err) {
            console.log(err);

        })
}

function createProject() {
    $('#submitaddProject').click(function (event) {
        event.preventDefault()
        console.log('masuk create');

        $.ajax({
            method: 'POST',
            url: `${baseUrl}/projects/`,
            data: {
                name: $('#nameP').val(),
                description: $('#descriptionP').val()
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(resp => {
                $('#addTodoModal3').modal('hide')
                swal.fire({
                    type: "success",
                    title: "Now Add Some Members to your project"
                })
                detail(resp._id)
                // projectmenu()
                $('#nameP').val('')
                $('#descriptionP').val('')
            })
            .fail(err => {
                console.log(err);
                swal.fire({
                    type: "error",
                    title: err.responseJSON.message
                })

            })
    })
}

function submitUpdateProject() {
    //update
    $('#submiteditProject').click(function () {
        let name = $('#namePr').val()
        let desc = $('#descriptionPr').val()
        let id = $('#pid').val()
        $.ajax({
            method: "PATCH",
            url: `${baseUrl}/projects/${id}/edit`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                name,
                desc
            }
        })
            .done(function () {
                $('#editTodoModal2').modal('hide')
                swal.fire({
                    type: "success",
                    title: "project is updating"
                })
                projectmenu()
            })
            .fail(function (err) {
                swal.fire({
                    type: "error",
                    title: err.responseJSON.message
                })
            })
    })

}


$(document).ready(function () {
    $('#myproject').click(function (event) {
        event.preventDefault()
        $('#todolist').empty()
        $('.hello').empty()
        $('#modalCreate').hide()
        $('#modalProject').show()
        projectmenu()
        createProject()
        submitUpdateProject()
    })
});