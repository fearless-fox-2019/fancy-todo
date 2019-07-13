function addTaskButton() {
    console.log('daritask')
    $('#addTask').toggle()
    $('#addList').hide()
    $('#addProject').hide()
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

        $.ajax({
                url: `${baseUrl}/users/userData`,
                type: 'GET',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(data => {
                console.log(data)
                $('.identity').empty()
                $('.identity').append(`
            <h1 class="title is-5">Welcome ${data.username}, <br> you have done <span style="color: red">${taskDone.length}</span> task before <br> and there <span style="color: green">${taskUndone.length}</span> task that need to be done. <br> what do you want to do today?</h1>
            `)

                lists.forEach(list => {
                    console.log(list)
                    $('#timelineHome').append(`
                <div class="box boxHome">
                    <article class="media mediaHome">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong>${list.name}</strong>
                                    <br>
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
                `)
                })
            })
            .fail(err => {
                console.log(err)
            })
    }).catch(err => {
        console.log(err)
    })
}