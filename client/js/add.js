function addPersonalTodo() {
    let titleItem = $('#titleAdd').val()
    let descriptionItem = $('#descriptionAdd').val()
    let duedateItem = $('#datepickerAdd').val()
    $.ajax({
        url: `${baseUrl}/todos`,
        type: 'POST',
        headers: {
            access_token : localStorage.getItem('access_token')
        },
        data: {
            title: titleItem,
            description: descriptionItem,
            duedate: duedateItem
        }
    })
    .done(data => {
        retrievePersonal()
        console.log(data);
    })
    .fail(error => {
        console.log(error)
    })
}

function addProject() {
    let nameItem = $('#nameProject').val()
    $.ajax({
        url: `${baseUrl}/projects`,
        type: 'POST',
        headers: {
            access_token : localStorage.getItem('access_token')
        },
        data: {
            name: nameItem
        }
    })
    .done(data => {
        retrieveProject()
    })
    .fail(error => {
        console.log(error)
    })
}

function addProjectTodo(id) {
    let titleItem = $('#titleProject').val()
    let descriptionItem = $('#descriptionProject').val()
    let duedateItem = $('#datepickerProject').val()
    $.ajax({
        url: `${baseUrl}/todos`,
        type: 'POST',
        headers: {
            access_token : localStorage.getItem('access_token')
        },
        data: {
            title: titleItem,
            description: descriptionItem,
            duedate: duedateItem,
            projectId: id
        }
    })
    .done(data => {
        return $.ajax({
            url: `${baseUrl}/projects/todo/${projectId}/${data._id}`,
            type: 'PATCH',
            headers: {
                access_token : localStorage.getItem('access_token')
            }
        })
        .done(data => {
            projectDetail(data._id)
        })
    })
    .fail(error => {
        console.log(error)
    })
}