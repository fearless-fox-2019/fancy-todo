function appendToMidUp() {
    fetchUserData()
        .then(userData => {
            console.log(userData, 'Mendapatkan user data yang sedang login')
            $('.midUpLeft').empty()
            $('.midUpLeft').append(`
            <figure class="image is-128x128" style="margin: 20px 35px 40px 30px; cursor: pointer">
                <img class=" avatarImage" onclick="toHome()" src="${userData.avatar}">
            </figure>
            <span><h1 class="title is-1 bigData">${userData.username}</h1>
            <p style="margin: -5px 0px 10px 5px;">${userData.email}</p></span>
            `)
            return usersTask()
        })
        .then(userstask => {
            let totalTask = userstask.userTask.length
            // console.log(userstask.userTask.length)
            $('.midUpRight1').empty()
            $('.midUpRight1').append(`
                <h1 class="title is-1 bigData" style="font-size: 100px; margin: 10px auto 0px auto;">${totalTask}</h1>
                <p style=" margin: 0px auto 20px auto;"><strong>Task (s)</strong></p>
            `)
        })
        .catch(err => console.log({
            err,
            messaga: 'gagal menginject ke bagian tengah atas'
        }))
}

function appendToMidBotRight(lists) {
    fetchAll()
        .then(promisedAll => {
            let tasks = promisedAll[0].userTask
            let lists = promisedAll[1].userList
            let projects = promisedAll[2].memberOf

            $('.midDownRightTitle').empty()
            $('.midDownRightTitle').append(`
            <h1 class="title is-3" style="">List of Task</h1> <hr>
            `)
            $('.midDownRightBody').empty()
            lists.forEach(list => {
                // console.log(list, 'ini yang ada project idnya')
                if (!list.projectId) {
                    $('.midDownRightBody').append(`
                    <div class="card myTaskCard">
                        <div class="card-content cardcontentMyTask">
                            <div class="content">
                                <h1 class="title is-4 titleMyTask" onclick="getDetail('${list._id}')">${list.name}</h1>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <a onclick="updateListMyTask('${list._id}')" class="card-footer-item">Edit</a>
                            <a onclick="deleteListMyTask('${list._id}')" class="card-footer-item">Delete</a>
                        </footer>
                    </div>  
                `)
                }
            });
        })
        .catch(err => console.log({
            err,
            message: `gagal memeasangkan ke list of task user`
        }))
}

function getDetail(listId) {
    console.log(listId, 'Mendapatkan detail dari list yang ada di mid bot right, dengan mengirimkan list id untuk dibaca detailnya')
    let userList
    let userListTask = []

    usersList()
        .then(results => {
            console.log(results.userList, 'hasil dari mengambil semua')

            results.userList.forEach(result => {
                if (result._id === listId) {
                    userList = result
                }
            })
            return usersTask()
        })
        .then((tasks) => {
            console.log(tasks, 'Berisi semua task yang diambil')

            tasks.userTask.forEach(task => {
                if (task.listId === listId.toString()) {
                    userListTask.push(task)
                }
            })
            console.log(userListTask, 'ini baru bisaaaa')

            $('.midDownLeft').empty()
            $('.midDownLeft').append(`
            <div class="detailList">
                <h1 class="title is-2">${userList.name}</h1> <hr>
            </div>
            `)

            userListTask.forEach(list => {
                // console.log(list, 'Masing-masing list user')
                if (list.status === 'true') {
                    list.status = 'Done'
                } else if (list.status === 'false'){
                    list.status = 'Undone'
                }
                console.log(list,'==================')
                $('.midDownLeft').append(`
                    <div class="box boxDetailTask" >
                        <article class="media">
                            <div class="media-content">
                                <div class="content">
                                    <div style="display: flex">
                                        <h3 class="title is-5 myDetailTaskTitle" >
                                            ${list.name} 
                                        </h3>
                                        <span style="margin-left: auto; ">
                                            <i onclick="editTaskMyTask('${list._id}')" class="fas fa-pencil-alt" style="crusor: pointer;"></i>
                                        </span> 
                                        <button class="delete" style="margin: 0; margin-left: 10px; crusor: pointer;" onclick="deleteTaskMyTask('${list._id}')"></button>
                                    </div>
                                    <p> 
                                        ${list.description}
                                    </p>
                                    <p>
                                        <i class="fas fa-check-circle Done${list._id}" id="statusDone" onclick="updateStatus('${list._id},${list.status}')" style="color: green;"></i>
                                        <i class="fas fa-times-circle unDone${list._id}" id="statusUnDone" onclick="updateStatus('${list._id},${list.status}')" style="color: red"></i>   
                                        ${list.status} | dueDate: ${moment(list.duedate).format('MMMM Do YYYY')} 
                                    </p> 
                                </div>
                            </div>
                        </article>
                    </div>
            `)
                if (list.status === 'Done') {
                    $('.unDone'+list._id).hide()
                    $('.Done'+list._id).show()
                } else {
                    $('.Done'+list._id).hide()
                    $('.unDone'+list._id).show()
                }
                
            })
        })
        .catch(err => {
            console.log({
                err,
                message: `Cannot get Detailed Data`
            })
        })
}

function updateStatus(input){
console.log(input)
let data = input.split(',')
console.log(data)
let status
if(data[1] === 'Undone'){
    status = true
}
else {
    status = false
}
    $.ajax({
        url: baseUrl+'/tasks/'+data[0],
        type: 'PATCH',
        data: {
            status
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(()=> {
        console.log('berhasil')
    })
    .fail(()=> {
        console.log('tidak berhasil')
    })
}

function addTaskMidBotLeft() {
    let dateNow = new Date()
    let todayDate = `${ dateNow.getFullYear().toString() }-0${ (dateNow.getMonth() + 1 ).toString() }-${ dateNow.getDate().toString() }`
    console.log(todayDate)

    $('.midDownLeft').empty()
    $('.midDownLeft').append(`
        <div class="columns">
            <div class="column" id="addTaskinMyTask">
                <h1 class="title is-5">Add New Task</h1>
                <div class="field">
                    <label class="label">Task title</label>
                    <div class="control">
                        <input class="input" id="addTaskMyTaskTitle" type="text" placeholder="Task title">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Task Description</label>
                    <div class="control">
                        <textarea class="textarea" id="addTaskMyTaskDescription"
                            placeholder="Textarea"></textarea>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Due Date</label>
                    <div class="control" id="addTaskMyTaskDueDate">
                    <input type="date" id="datepicker2" min=${todayDate}>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Subject</label>
                    <div class="control">
                        <div class="select">
                            <select id="addTaskMyTaskListOption">
                                <option>Select list</option>
                            </select>
                        </div>
                    </div>
                    <span style="margin-left: 10px;">
                        <small>
                            <a onclick="addListFormMyTask()">
                                Add new list
                            </a>
                        </small>
                    </span>
                </div>
                <div class="field" id="newListparentMyTask">
                    <label class="label">List Name</label>
                        <div class="control">
                            <input class="input" id="addTaskMyTaskNewList" type="text" placeholder="Text input">
                        </div>
                </div>


                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" onclick="addTaskFormMyTask()">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `)
    $('#newListparentMyTask').hide()
    fillOption()
    // dueDateGenerator()
}

function fillOption() {
    usersList()
        .then(result => {
            result.userList.forEach(el => {
                console.log(el, 'each element')
                $('#addTaskMyTaskListOption').append(`
                    <option>${el.name}</option>
                `)
            })
        })
        .catch(err => {
            console.log(err)
        })
}

function addListFormMyTask() {
    console.log('addTask fromMyTask')
    $('#newListparentMyTask').toggle()
}

function addTaskFormMyTask() {
    let title = $('#addTaskMyTaskTitle').val()
    let description = $('#addTaskMyTaskDescription').val()
    // let duedate = $("#datepicker").val()
    let duedate = $("#datepicker2").datepicker({
        minDate: -20,
        maxDate: "+1M +10D"
    }).val()
    let list = $('#addTaskMyTaskListOption').val()
    let newLists = $('#addTaskMyTaskNewList').val()

    let newTask = {
        name: title,
        description: description,
        listId: '',
        duedate
    }
    console.log(newTask, 'ini new Task')
    if (list === 'Select list' || list === null) {
        console.log('Create new List path.')
        let newList = {
            name: newLists
        }
        createNewList(newList)
            .then(newList => {
                console.log(newList, 'Hasil kembalian dari membuat List baru')
                newTask.listId = newList._id
                return createNewTask(newTask)
            })
            .then(createdTask => {
                console.log(createdTask, 'Hasil dari membuat task baru setelah membuat list baru')
                appendToMidBotRight()
                timeline()
                $('#addTaskMyTaskTitle').val('')
                $('#addTaskMyTaskDescription').val('')
                // $("#datepicker").val('')
                $("#datepicker2").datepicker({
                    minDate: -20,
                    maxDate: "+1M +10D"
                }).val('')
                $('#addTaskMyTaskListOption').val('')
                $('#addTaskMyTaskNewList').val('')
                $('#midDownLeft').empty()

            })
            .catch(err => console.log(err))
    } else {
        console.log('Menggunakan List yang sudah Ada')

        findAlist(list)
            .then(foundList => {
                console.log(foundList, 'Hasil pencarian dari list yang dipilih')
                newTask.listId = foundList._id
                return createNewTask(newTask)
            })
            .then(createdTask => {
                console.log(createdTask, 'Hasil membuat task Baru dari menggunakan list yang sudah ada')
                appendIdentity()
            })
            .catch(err => console.log({
                err,
                message: `Error karena membuat task dengan list yang sudah ada`
            }))
    }
}

function addProjectMidBotLeft() {
    $('.midDownLeft').empty()
    $('.midDownLeft').append(`
        <div class="column" id="addProject">
            <h1 class="title is-5">Add New Project</h1>
            <div class="field">
                <label class="label">Name</label>
                <div class="control">
                    <input class="input" type="text" placeholder="Name of project" id="addProjectName">
                </div>
            </div>

            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                    <textarea class="textarea" placeholder="Description of Project here"
                        id="addProjectDescription"></textarea>
                </div>
            </div>

            <div class="field is-grouped">
                <div class="control">
                    <button class="button is-link" onclick="addProjectForm()">Submit</button>
                </div>
            </div>
        </div>
    `)
}

function myProjects() {
    fetchUserData()
        .then(userData => {
            return usersProject()
        })
        .then((userProjects) => {
            // console.log(userProjects,'-=-=-=-=-=-=')
            let projects = userProjects.memberOf
            console.log(projects)
            $('.mtleft').empty()
            $('.mtleft').append(`
            <h1 class="title is-2">My Projects.</h1> <hr style="margin-right: 10px; margin-bottom: 50px;">
            `)

            projects.forEach(project => {
                console.log(project.name, '=-=-=-=-=')
                $('.mtleft').append(`
                <h1 class="subtitle is-4">
                        <a style="crusor: pointer;" onclick="toProject('${project._id}')">${project.name}</a>
                </h1>
                `)

            })
        })
}

function updateListMyTask(listId) {
    console.log(listId)
    let dateNow = new Date()
    let todayDate = `${ dateNow.getFullYear().toString() }-0${ (dateNow.getMonth() + 1 ).toString() }-${ dateNow.getDate().toString() }`

    $('.midDownLeft').empty()
    $('.midDownLeft').append(`
        <div class="columns">
            <div class="column" id="addTask">
                <h1 class="title is-5">Edit List</h1>
                <div class="field">
                    <label class="label">List TItle</label>
                    <div class="control">
                        <input class="input" id="updateTaskFormTitle" type="text" placeholder="Task title">
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" onclick="updateListMyTask2('${listId}')">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `)
}

function updateListMyTask2(listId) {
    console.log(listId, 'ibi list id')
    let name = $('#updateTaskFormTitle').val()

    $.ajax({
            url: baseUrl + '/todolists/updatelist/' + listId,
            type: 'PATCH',
            data: {
                name
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            console.log(result)
            toMyTask()
        })
        .fail(err => {
            console.log(err)
        })
}

function deleteListMyTask(listId) {
    console.log(listId)
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
    $.ajax({
            url: baseUrl + '/todolists/' + listId,
            type: 'DELETE',
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            console.log(result)
            $('.midDownLeft').empty()
            toMyTask()
        })
        .fail(err => {
            console.log(err)
        })
}

function editTaskMyTask(taskId) {
    console.log('editaskmytask', taskId)
    $('.detailList').append(`
        <div class="MyTaskUpdateForm">
            <div class="field">
                <label class="label">Task title</label>
                <div class="control">
                    <input class="input" id="titleUpdateMyTask" type="text" placeholder="New title">
                </div>
            </div>
                
            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                    <input class="textarea" id="descriptionUpdateMyTask" type="textarea" placeholder="Text input">
                </div>
            </div>
                
            <div class="field is-grouped">
                <div class="control">
                    <button class="button is-link" onclick="updatMyTaskTask('${taskId}')">Submit</button>
                </div>
                <div class="control">
                    <button class="button is-text" id="cancelUpdate">Cancel</button>
                </div>
            </div>
        </div>
    `)
}

$('#cancelUpdate').click(() => {
    $('.MyTaskUpdateForm').toggle()
})

function updatMyTaskTask(taskId) {
    let title = $('#titleUpdateMyTask').val()
    let description = $('#descriptionUpdateMyTask').val()

    $.ajax({
            url: baseUrl + '/tasks/' + taskId,
            type: 'PATCH',
            data: {
                name: title,
                description: description
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(result => {
            console.log(result)
            $('.MyTaskUpdateForm').toggle()
        })
        .catch(err => {
            console.log(err)
        })
}

function deleteTaskMyTask(taskId) {
    console.log('deletetaskmytask', taskId)
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                    url: baseUrl + `/tasks/` + taskId,
                    type: 'DELETE',
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })
                .done(result => {
                    console.log(result, 'berhasil delete')
                    toMyTask()
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                    )
                })
                .fail(err => {
                    console.log(err)
                })

        }
    })


}