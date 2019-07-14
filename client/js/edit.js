function editTodo(id) {
    let titleItem = $('#titleEdit').val()
    let descriptionItem = $('#descriptionEdit').val()
    let statusItem = $('#status').val()
    $.ajax({
        url: `${baseUrl}/todos/${id}`,
        type: 'PATCH',
        data: {
            title: titleItem,
            description: descriptionItem,
            status: statusItem
        },
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(data => {
        retrieveProject()
        retrievePersonal()
    })
    .fail(err => {
        console.log(err)
    })
}

function deleteTodo(id) {
    $.ajax({
        url: `${baseUrl}/todos/${id}`,
        type: 'DELETE',
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(data => {
        projectDetail(projectId)
        retrievePersonal()
    })
    .fail(err => {
        console.log(err)
    })
}

function deleteProject(id) {
    $.ajax({
        url: `${baseUrl}/projects/${id}`,
        type: 'DELETE',
        headers: {
            access_token : localStorage.getItem('access_token')
        }
    })
    .done(data => {
        retrieveProject()
        projectDetail(id)
    })
    .fail(err => {
        console.log(err)
    })
}