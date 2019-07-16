function projectAllTask(projectId) { //maksudnya list
    // console.log('all project task')
    usersList()
        .then((allList) => {
            // console.log(allList, 'ini all task')
            let projectTask = 0
            $('.addTaskForm').hide()
            $('.editTaskForm').hide()
            $('.addTaskForm2').empty()
            allList.userList.forEach(list => {
                // console.log(list, 'ini list======')
                if (list.projectId === projectId) {
                    projectTask += 1
                    $('.addTaskForm2').append(`
                    <div class="projectAllTaskCard"> 
                        <div class="card">
                            <div class="card-content">
                                <p class="title projectEachTask" style="crusor: pointer;">
                                    <a onclick="showTask('${list._id}')">${list.name}</a>
                                </p>
                                <div id="thisEachProjectTask" class="thisEachProjectTask${list._id}" style="display: none">
                                </div>
                            </div>
                            <footer class="card-footer">
                                <p class="card-footer-item">
                                    <a>Edit</a>
                                </p>
                                <p class="card-footer-item">
                                    <a>Delete</a>
                                </p>
                            </footer>
                        </div>
                    </div>
                    `)
                }
            })
            $('#projectDetailedRightRight').empty()
            $('#projectDetailedRightRight').append(`
            <div class="topOfProject">
                <h2 class="title is-3">${projectTask}</h2>
                <p> Task(s) </p>
            </div>
            `)
        })
}

$('.projectEachTask').click(() => {
    $('#thisEachProjectTask').toggle()
})

function projectAllMembers(projectId) {
    console.log('all project members')
}

function projectAllDetail(projectId) {
    $.ajax({
            url: baseUrl + '/projects/' + projectId,
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(success => {
            $('#projectDetailed').empty()
            $('#projectDetailed').append(`
            <div class="topOfProject">
                <h1 class="title is-1" style="color: black">${success.name}</h1>
                <div class="subtitleorganizerproject" >
                    <h1 class="subtitle is-6" style="color: black; margin: 0px;">${success.description}</h1>
                    <h1 class="subtitle is-6" style="color: black"><a onclick="projectAddTaskForm('${success._id}')">Add Task +</a></h1>
                </div>
            </div>
            `)
            $('#projectDetailedRight').empty()
            $('#projectDetailedRight').append(`
            <div class="topOfProject">
                <h2 class="title is-3">${success.members.length}</h2>
                <p> Members </p>
            </div>
            `)
            $('#projectAllmember').empty()
            $('#projectAllmember').append(`
            <div class="memberForm">
                <div class="field has-addons">
                    <div class="control">
                        <input id="memberAdded" class="input" type="text" placeholder="Add a Member">
                    </div>
                    <div class="control">
                        <a class="button is-info" onclick="addAmember('${projectId}')">
                        add
                        </a>
                    </div>
                </div>  
            </div>
            <h2 class="title is-2"> Members.</h2>
            `)
            success.members.forEach(el => {

                $('#projectAllmember').append(`
                <div class="box">
                    <article class="media">
                    <div class="media-left">
                        <figure class="image is-64x64">
                        <img src="${el.avatar}" alt="Image">
                        </figure>
                    </div>
                    <div class="media-content">
                    <div class="content">
                        <p>
                        <strong>${el.username}</strong> <br> <small>${el.email}</small>
                        </p>
                    </div>
                    </article>
                    </div>
                `)
            })
        })
        .fail(er => {
            console.log(er)
        })
}
function addAmember(projectId){
    let member = $('#memberAdded').val()
    console.log(member)

$.ajax({
    url: `${baseUrl}/users/getByName/${member}`,
    type: 'GET',
    headers: {
        token : localStorage.getItem('token')
    }
})
    .done(result => {
        console.log(result)
        $.ajax({
            url: `${baseUrl}/projects/addMember/${projectId}`,
            type: 'PATCH',
            data: {
                memberId: result._id
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(success => {
                projectAllDetail(projectId)
            })
            .catch(err => console.log(err))
    })

}
function projectShowAddForm(){
    $('.memberForm').toggle()
}

function projectAddTaskForm(projectId) {
    let dateNow = new Date()
    let todayDate = `${ dateNow.getFullYear().toString() }-0${ (dateNow.getMonth() + 1 ).toString() }-${ dateNow.getDate().toString() }`

    $('.addTaskForm').toggle()
    $('.addTaskForm2').toggle()
    $('.addTaskForm').append(`
    <div class="columns">
        <div class="column" id="addTaskProject">
            <h1 class="title is-5">Add New Task</h1>

            <div class="field">
                <label class="label">Task title</label>
                <div class="control">
                    <input class="input" id="addTaskProjectTitle" type="text" placeholder="Task title">
                </div>
            </div>
            
            <div class="field">
                <label class="label">Task Description</label>
                <div class="control">
                    <textarea class="textarea" id="addTaskProjectDescription"
                        placeholder="Textarea"></textarea>
                </div>
            </div>
            
            <div class="field">
                <label class="label">Due Date</label>
                <div class="control" id="addTaskProjectDueDate">
                <input type="date" id="datepicker2" min=${todayDate}>
                </div>
            </div>
            
            <div class="field">
                <label class="label">Subject</label>
                <div class="control">
                    <div class="select">
                        <select id="addTaskProjectListOption">
                            <option>Select list</option>
                        </select>
                    </div>
                </div>
            
                <span style="margin-left: 10px;">
                    <small>
                        <a onclick="addListFormProject()">
                            Add new list
                        </a>
                    </small>
                </span>
            </div>
            
            <div class="field" id="newListparentProject">
                <label class="label">List Name</label>
                    <div class="control">
                        <input class="input" id="addTaskProjectNewList" type="text" placeholder="Text input">
                    </div>
            </div>


            <div class="field is-grouped">
                <div class="control">
                    <button class="button is-link" onclick="addTaskFormProject('${projectId}')">Submit</button>
                </div>
            </div>
        </div>
    </div>
    `)
    // $('.addTaskForm').hide()
    $('#newListparentProject').hide()
    fillOptionProject()
}

function fillOptionProject() {
    usersList()
        .then(result => {
            result.userList.forEach(el => {
                console.log(el, 'each element')
                $('#addTaskProjectListOption').append(`
                    <option>${el.name}</option>
                `)
            })
        })
        .catch(err => {
            console.log(err)
        })
}
function addListFormProject() {
    console.log('addTask fromMyTask')
    $('#newListparentProject').toggle()
}

function addTaskFormProject(projectId) {
    // console.log('input data')
    let title = $('#addTaskProjectTitle').val()
    let description = $('#addTaskProjectDescription').val()
    let duedate = $("#datepicker2").datepicker({
        minDate: -20,
        maxDate: "+1M +10D"
    }).val()
    let list = $('#addTaskProjectListOption').val()
    let newLists = $('#addTaskProjectNewList').val()

    let newTask = {
        name: title,
        description: description,
        listId: '',
        duedate,

    }
    // console.log(newTask, 'ini new Task')
    if (list === 'Select list' || list === null) {
        // console.log('Create new List path.')
        let newList = {
            name: newLists,
            projectId
        }
        createNewList(newList)
            .then(newList => {
                // console.log(newList, 'Hasil kembalian dari membuat List baru')
                newTask.listId = newList._id
                return createNewTask(newTask)
            })
            .then(createdTask => {
                // console.log(createdTask, 'Hasil dari membuat task baru setelah membuat list baru')
                timeline()
                $('#addTaskProjectTitle').val('')
                $('#addTaskProjectDescription').val('')
                // $("#datepicker").val('')
                $("#datepicker2").datepicker({
                    minDate: -20,
                    maxDate: "+1M +10D"
                }).val('')
                $('#addTaskProjectListOption').val('')
                $('#addTaskProjectNewList').val('')
                $('#midDownLeft').empty()
                $('.addTaskForm').hide()
                projectAllTask()
            })
            .catch(err => console.log(err))
    } else {
        // console.log('Menggunakan List yang sudah Ada')

        findAlist(list)
            .then(foundList => {
                // console.log(foundList, 'Hasil pencarian dari list yang dipilih')
                newTask.listId = foundList._id
                return createNewTask(newTask)
            })
            .then(createdTask => {
                // console.log(createdTask, 'Hasil membuat task Baru dari menggunakan list yang sudah ada')
                $('.addTaskForm').hide()
                projectAllTask()
            })
            .catch(err => console.log({
                err,
                message: `Error karena membuat task dengan list yang sudah ada`
            }))
    }
}

function showTask(listId) {
    $('.thisEachProjectTask'+listId).toggle()
    $.ajax({
        url: `${baseUrl}/tasks/list/${listId}`,
        type: 'GET',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((allUsertasks) => {
            $('.thisEachProjectTask'+listId).empty()
            allUsertasks.forEach(task => {
                $(`.thisEachProjectTask${listId}`).append(`
               <div class="StatusAndName">
                    <i class="fas fa-check-circle " style="color: green; margin-right: 10px;"></i>
                    <p>${task.name}</p> 
               </div>
                `)
            })
        })
        .fail((err) => {
            console.log(err)
        })
}