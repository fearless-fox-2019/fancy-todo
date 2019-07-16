function addTaskButton() {
    console.log('Tombol untuk memunculkan add Task. dan menghide lainnya')
    $('#addTask').toggle()
    $('#addList').hide()
    $('#addProject').hide()

    $('#newListparent').hide()
}
// function addListButton() {
//     console.log('darilist')
//     $('#addTask').hide()
//     $('#addList').toggle()
//     $('#addProject').hide()
// }
function addProjectButton() {
    $('#addProject').append(`
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
    `)


    console.log('Tombol untuk memunculkan add Task. dan menghide lainnya')
    $('#addTask').hide()
    $('#addList').hide()
    $('#addProject').toggle()
}

function timeline() {
    console.log('Tombol untuk memunculkan Timeline. dan menghide lainnya')
    $('#addTask').hide()
    $('#addList').hide()
    $('#addProject').hide()
    $('#timelineHome').show()
}

function dueDateGenerator() {
    let dateNow = new Date()
    let todayDate = `${ dateNow.getFullYear().toString() }-0${ (dateNow.getMonth() + 1 ).toString() }-${ dateNow.getDate().toString() }`

    $('#taskDueDate').empty()
    $('#taskDueDate').append(`
            <input type="date" id="datepicker" min=${todayDate}>
    `)
}

function appendIdentity() {
    console.log('menginject ke div identity')
    $('#timelineHome').empty()
    $('#timelineHome').append(`
        <h3 class="title is-4 activityHome">My Activity</h3>
    `)

    fetchAll()
        .then(result => {
            let taskDone = []
            let taskUndone = []
            let lists = result[1].userList

            result[0].userTask.forEach(element => {
                if (element.status === 'false') {
                    taskUndone.push(element)
                } else {
                    taskDone.push(element)
                }
            });

            $.ajax({
                    url: `${baseUrl}/users/userData`,
                    type: 'GET',
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })
                .done(data => {
                    console.log(data, 'berhasil mendapatkan data dari user yang login')

                    $('.identity').empty()
                    $('.identity').append(`
                    <figure class="image is-128x128" style="margin: -40px 35px 40px 30px;">
                        <img class="is-rounded avatarImage animated bounce infinite delay-2s" src="${data.avatar}">
                    </figure>`)
                    $('.identity').append(`
                    <h1 class="title is-5">Welcome ${data.username}, <br> 
                    what do you want to do today?<br>
                    you have done <span style="color: green">${taskDone.length}</span> task<br> 
                    and there <span style="color: red">${taskUndone.length}</span> task that need to be done.</h1>
                    `)

                    dueDateGenerator()

                    lists.forEach(list => {
                        // memasukkan option ke pilihan list
                        console.log(list, 'ini list yang keluar')
                        if (list.projectId === null) {
                            $('#listOption').append(`
                            <option >${list.name}</option>
                            `)
                        }
                        // mengeluarkanproject yang dibuat
                        if (data._id === list.creator) {
                            console.log(list, 'ini dalah total list')
                            $('#timelineHome').append(`
                            <div class="box boxHome">
                                <article class="media mediaHome">
                                    <div class="media-content">
                                        <div class="content">
                                            <p s-size-4 style="margin-bottom: 0px; font-size: 35px;">
                                                <strong i>${list.name}</strong>
                                            </p>
                                            <p is-size-7>
                                                <small >Createdby: ${data.username}</small> <br>
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                            `)}
                    })
                })
                .fail(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        })
}