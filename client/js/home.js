function addTaskButton() {
    console.log('daritask')
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
    console.log('dariproject')
    $('#addTask').hide()
    $('#addList').hide()
    $('#addProject').toggle()
}

function timeline() {
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
    fetchAll().then(result => {
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
        // console.log(todayDate)

        $.ajax({
                url: `${baseUrl}/users/userData`,
                type: 'GET',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(data => {
                // console.log(data)

                $('.identity').empty()
                $('.identity').append(`
                <figure class="image is-128x128" style="margin: -40px 35px 40px 30px;">
                    <img class="is-rounded avatarImage" src="${data.avatar}">
                </figure>`)
                $('.identity').append(`
            <h1 class="title is-5">Welcome ${data.username}, <br> you have done <span style="color: red">${taskDone.length}</span> task before <br> and there <span style="color: green">${taskUndone.length}</span> task that need to be done. <br> what do you want to do today?</h1>
            `)
                // $('#taskDueDate').empty()
                // $('#taskDueDate').append(`
                // <input type="date" id="datepicker" min=${todayDate}>
                // `)
                dueDateGenerator()

                // $('#listOption').empty()
                // $('#timelineHome').empty()
                lists.forEach(list => {
                    // console.log(list)
                    if (list.projectId === null) {
                        $('#listOption').append(`
                        <option >${list.name}</option>
                        `)
                    }
                    if (data._id === list.creator) {
                        $('#timelineHome').append(`
                    <div class="box boxHome">
                        <article class="media mediaHome">
                            <div class="media-content">
                                <div class="content">
                                    <p s-size-4 style="margin-bottom: 0px; font-size: 35px;">
                                        <strong i>${list.name}</strong>
                                    </p>
                                    <p is-size-7>
                                        <small >Createdby: ${data.username}</small>
                                        <br>
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                    `)
                    }

                })
            })
            .fail(err => {
                console.log(err)
            })
    }).catch(err => {
        console.log(err)
    })
}