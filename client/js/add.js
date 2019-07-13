function addTaskForm() {
    console.log('hello world from TaskFrom')
}

// function addListForm() {
//     console.log('hello world from TaskFrom')
// }

function addProjectForm() {
    console.log('hello world from projectsFrom')
    let name = $('#addProjectName').val()
    let description = $('#addProjectDescription').val()

    $.ajax({
        url: `${baseUrl}/projects`,
        type: 'POST',
        data: { name, description },
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(created => {
            console.log(created)
            timeline()
        })
        .fail(err => {
            console.log(err)

        })
}