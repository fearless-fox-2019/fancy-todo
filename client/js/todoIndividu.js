let baseUrl = 'http://localhost:3000'


function showTodo() {
    $('#modalCreate').show()
    $('#modalProject').hide()
    $('#modaltodoProject').hide()
    $('#homeProject').hide()
    $('#projectDetail').hide()
    $.ajax({
        method: "GET",
        url: `${baseUrl}/todos`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (resp) {
            $('.hello').empty()
            $('.hello').append(`<p style="text-align:left; color: #ee6e73;">Welcome back, ${localStorage.getItem('username')}!<br>what are we gonna do today?</p>`)
            $("#todolist").empty()
            resp.forEach(data => {
                $("#todolist").append(`
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
        })
        .fail(function (err) {
            console.log(err);

        })
}


function updateStatusTodo() {
    $('.badge-warning').click(function () {
        event.preventDefault()

        swal.fire({
            title: 'Are you sure?',
            text: "Your todo will be set to complete",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, I already done!'
        })
            .then((result) => {
                if (result.value) {
                    updatestatus(this.id)
                } else {
                    swal.fire({
                        title: "cancel todo",
                        type: "success"
                    });
                }
            });
    })
}

function updatestatus(id) {
    $.ajax({
        method: "PATCH",
        url: `${baseUrl}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            id
        }
    })
        .done(function (todo) {
            Swal.fire(
                'Completed!',
                'Your todo is now completed.',
                'success'
            )
            showTodo()
        })
        .fail(function (err) {
            console.log(err);

        })
}

function deleteTodos() {
    $('.deleteTodo').on("click", function () {
        event.preventDefault()

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
                    removeTodo(this.id)
                } else {
                    swal.fire({
                        title: "cancel remove todo",
                        type: "success"
                    });
                }
            });
    })

}
function removeTodo(id) {
    event.preventDefault()

    $.ajax({
        method: "DELETE",
        url: `${baseUrl}/todos/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(function (todo) {
            Swal.fire(
                'Deleted!',
                'Your todo has been deleted.',
                'success'
            )
            showTodo()
        })
        .fail(function (err) {
            console.log(err);

        })
}

function editTodos() {
    $('.editTodo').on("click", function () {
        event.preventDefault()
        $.ajax({
            method: "GET",
            url: `${baseUrl}/todos/${this.id}`,
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(function (data) {
                let now = new Date(data.due_date)
                $('#title1').val(data.name)
                $('#description1').val(data.description)
                $('#duedate1').val(now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2))
                $('#uid').val(data._id)
            })
            .fail(function (err) {
                console.log(err);

            })
    })
}

function submitTodo() {
    //create
    $('#submitAdd').click(function () {
        event.preventDefault()
        let name = $('#title').val()
        let desc = $('#description').val()
        let due_date = $('#duedate').val()

        if (name != '' && desc != '' && due_date != '') {
            $.ajax({
                method: "POST",
                url: `${baseUrl}/todos/`,
                headers: {
                    token: localStorage.getItem('token')
                },
                data: {
                    name,
                    desc,
                    due_date
                }
            })
                .done(resp => {
                    $('#addTodoModal').modal('hide')
                    swal.fire({
                        type: "success",
                        title: "todo is in your list now"
                    })
                    showTodo()
                    $('#title').val('')
                    $('#description').val('')
                    $('#duedate').val('')

                })
                .fail((err, jqXHR, textStatus) => {
                    console.log(err.responseJSON)
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

function submitUpdate() {
    //update
    $('#submitEdit').click(function () {
        let name = $('#title1').val()
        let desc = $('#description1').val()
        let due_date = $('#duedate1').val()
        let id = $('#uid').val()

        $.ajax({
            method: "PUT",
            url: `${baseUrl}/todos/${id}`,
            headers: {
                token: localStorage.getItem('token')
            },
            data: {
                id,
                name,
                desc,
                due_date
            }
        })
            .done(function () {
                $('#editTodoModal').modal('hide')
                swal.fire({
                    type: "success",
                    title: "todo is changing"
                })
                showTodo()
            })
            .fail(function (err) {
                console.log(err);
            })
    })

}

function search() {
    $('#searching').keypress(function () {
        let search = $('#searching').val()
        console.log(search);
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == 13) {
            event.preventDefault()
            $.ajax({
                method: "GET",
                url: `${baseUrl}/todos/search/${search}`,
                headers: {
                    token: localStorage.getItem('token')
                }
            })
                .done(resp => {
                    $('#searching').val('')
                    $('#todolist').empty()
                    if(resp.length <= 0){
                        $("#todolist").append(`<h4>Todo Not Found</h4>`)
                    }
                    resp.forEach(data => {
                        $("#todolist").append(`
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
                    <small>${(moment(data.due_date).endOf('day').fromNow() === undefined ? 'expired' : moment(data.due_date).endOf('day').fromNow())}</small>
                </div>
            </a>
                `)
                    });
                })
                .fail((jqXHR, textStatus) => {
                    console.log(textStatus)
                    swal({
                        title: "Internal Server Error"
                    })
                })
        }
        event.stopPropagation();
    })

}

$(document).ready(function () {
    $('#mytodo').click(function (event) {
        event.preventDefault()
        showTodo()
    })
    submitTodo()
    submitUpdate()
    search()
});