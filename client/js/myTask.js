function appendToMidUp() {
    fetchUserData()
        .then(userData => {
            console.log(userData, 'from userdata')
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
        .catch(err => console.log(err))
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
        .catch(err => console.log(err))
}

function getDetail(listId) {
    console.log(listId, 'ini harusnya satu buah list yang dikirim')
    let userList
    let userlisttask = []
    usersList()
        .then(results => {
            // console.log(results.userList)
            results.userList.forEach(result => {
                if (result._id === listId) {
                    console.log(result)
                    userList = result
                }
            })
            // console.log(userList,'hiyahiyahiya')
            return usersTask()
        })
        .then((tasks) => {
            // console.log(tasks,'ini usertask kedia')
            // console.log(userList,'ini user list')
            tasks.userTask.forEach(task => {
                // console.log(task,'jbsdavjkbs')
                if (task.listId === listId.toString()) {
                    // console.log(task.listId, 'ini task yang dicatri')
                    userlisttask.push(task)
                }
            })
            console.log(userlisttask, 'ini baru bisaaaa')

            $('.midDownLeft').empty()
            $('.midDownLeft').append(`
            <div class="detailList">
                <h1 class="title is-2">${userList.name}</h1> <hr>
            </div>
            `)
            console.log(userlisttask, )
            userlisttask.forEach(list => {
                console.log(list, 'inilist')
                if (list.status === 'true') {
                    list.status = 'Done'
                } else {
                    list.status = 'Undone'
                }
                $('.midDownLeft').append(`
                <div class="detailList">
                    <div class="box boxDetailTask" >
                        <article class="media">
                            <div class="media-content">
                                <div class="content">
                                    <h3 class="title is-5 myDetailTaskTitle"><span><i onclick="editTaskMyTask()" class="fas fa-pencil-alt"></i></span> ${list.name} </h3>
                                    <p> ${list.description}</p>
                                    <p><i class="fas fa-check-circle statusDone" style="color: green;"></i>
                                    <i class="fas fa-times-circle statusUnDone" style="color: red"></i>   
                                     ${list.status} | dueDate: ${moment(list.duedate).format('MMMM Do YYYY')} </p> 
                                    <p>  </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            `)
                if (list.status === 'Done') {
                    $('.statusDone').show()
                    $('.statusUnDone').hide()
                } else {
                    $('.statusDone').hide()
                    $('.statusUnDone').show()
                }
            })
        })
}


function addTaskMidBotLeft() {
    let dateNow = new Date()
    let todayDate = `${ dateNow.getFullYear().toString() }-0${ (dateNow.getMonth() + 1 ).toString() }-${ dateNow.getDate().toString() }`

    $('.midDownLeft').empty()
    $('.midDownLeft').append(`
        <div class="columns">
            <div class="column" id="addTask">
                <h1 class="title is-5">Add New Task</h1>
                <div class="field">
                    <label class="label">Task title</label>
                    <div class="control">
                        <input class="input" id="addTaskFormTitle" type="text" placeholder="Task title">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Task Description</label>
                    <div class="control">
                        <textarea class="textarea" id="addTaskFormTitleDescription"
                            placeholder="Textarea"></textarea>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Due Date</label>
                    <div class="control" id="taskDueDate">
                        <input type="date" id="datepicker" min=${todayDate}>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Subject</label>
                    <div class="control">
                        <div class="select">
                            <select id="listOption">
                                <option>Select list</option>
                            </select>
                        </div>
                    </div>
                    <span style="margin-left: 10px;"><small><a onclick="addListForm()">Add new
                                list</a></small></span>
                </div>
                <div class="field" id="newListparent">
                    <label class="label">List Name</label>
                    <div class="control">
                        <input class="input" id="addNewList" type="text" placeholder="Text input">
                    </div>
                </div>


                <div class="field is-grouped">
                    <div class="control">
                        <button class="button is-link" onclick="addTaskForm()">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    `)
    // dueDateGenerator()
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
                        <a style="crusor: pointer;" onclick="toProject()">${project.name}</a>
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
            $('.midDownLeft').empty()
            toMyTask()
        })
        .fail(err => {
            console.log(err)
        })
}

function deleteListMyTask(listId) {
    console.log(listId)
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

function editTaskMyTask() {
    console.log('editaskmytask')
}