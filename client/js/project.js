function showProjectPage() {
    $('#mytodos').hide()
    $('#sign-in-form').hide()
    $('#project-page').fadeIn()
    $('#project-list-page').hide()
    $('#view-project-list').removeClass('active')
}

function fetchMyProjects() {
    $('#project-list').empty()

    $
        .ajax({
            url: 'http://localhost:3000/projects/',
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(projects => {
            console.log(projects)

            let raw = ``

            projects.forEach(project => {
                raw += `
                <div class="four wide column">
                <div class="ui card piled segment animated jackInTheBox">
                  <div class="content">
                    <div class="header">
                      ${project.name}
                      <i class="right floated trash small grey icon" onclick="deleteProject('${project._id}')"></i>
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="ui sub header">Detail</h4>
                    <div class="ui feed">
                      <div class="event">
                        <div class="content">
                          <div class="summary"><a>Master: </a>${project.master.name}</div>
                        </div>
                      </div>
                      <div class="event">
                        <div class="content">
                          <div class="summary"><a>Members: </a> ${project.members.length}</div>
                        </div>
                      </div>
                      <div class="event">
                        <div class="content">
                          <div class="summary"><a>Todos: </a>${project.todos.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="extra content">
                    <button class="ui button" onclick="projectPage('${project._id}')">Go to Project</button>
                  </div>
                </div>
              </div>
                `
            })

            $('#project-list').append(raw)
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function addNewProject() {
    event.preventDefault()

    const name = $('#new-project-name').val()

    $
        .ajax({
            url: 'http://localhost:3000/projects/',
            method: 'POST',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                name
            }
        })
        .done(projects => {
            console.log(projects)
            fetchMyProjects()
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function deleteProject(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $
                    .ajax({
                        url: `http://localhost:3000/projects/${id}`,
                        method: 'DELETE',
                        headers: {
                            accesstoken: localStorage.getItem('accesstoken')
                        }
                    })
                    .done(response => {
                        fetchMyProjects()
                        swal("Project deleted!", {
                            icon: "success",
                        })
                    })
                    .fail((jqXHR, textstatus) => {
                        swal(jqXHR.responseJSON.message)
                    })
            }
        })
}

function projectPage(id) {
    showProjectPage()

    $('#todos-incomplete-project').empty()
    $('#todos-complete-project').empty()
    $('#todos-all-project').empty()
    $('#project-todo-form').empty()
    $('#project-members').empty()
    $('#add-member-form').empty()

    console.log(id, 'projects iddddddd')

    $
        .ajax({
            url: `http://localhost:3000/projects/${id}`,
            method: 'GET',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(response => {
            $('#project-name').text(response.name)
            console.log(response)

            const options = { weekday: 'short', month: 'long', day: 'numeric' }

            let rawAll = ``
            let rawCom = ``
            let rawIn = ``

            response.todos.forEach(todo => {
                if (todo.status) {
                    rawCom += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large green icon" onclick="updateTodoProject('${todo._id}', ${!todo.status}, '${id}')"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodoProject('${todo._id}', '${id}')">
                            <i class="trash icon"></i>
                        </span>
                    
                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                        </div>
                    </div>
                    `
                } else {
                    rawIn += `
                    <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large grey icon" onclick="updateTodoProject('${todo._id}', ${!todo.status}, '${id}')"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodoProject('${todo._id}', '${id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                    </div>
                    </div>
                    `
                }
                rawAll += `
                <div class="four wide column">
                    <div class="ui link card animated flipInX">
                    <div class="content">
                    <i class="right floated check large ${todo.status ? "green" : "grey"} icon" onclick="updateTodoProject('${todo._id}', ${!todo.status}, '${id}')"></i>
                    <div class="header">${todo.name}</div>
                        <div class="description">
                            <p>${todo.description}</p>
                        </div>
                    </div>
                    <div class="extra content">
                        <span class="left floated trash" onclick="deleteTodoProject('${todo._id}', '${id}')">
                            <i class="trash icon"></i>
                        </span>

                        <span class="right floated clock outline">
                        <i class="clock_outline icon"></i>
                        Due date: ${new Date(todo.due_date).toLocaleDateString('en', options)}
                        </span>
                        </div>
                    </div>
                </div>
                `
            })

            let rawForm = `
            <div class="ui icon header">Add New Todo</div>
          <div class="content">
            <form class="ui form">
              <div class="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  id="new-todo-name-project"
                />
              </div>
              <div class="field">
                <label>Description</label>
                <textarea
                  type="text"
                  name="last-name"
                  id="new-todo-desc-project"
                  rows="3"
                ></textarea>
              </div>
              <div class="field">
                <label>Due Date</label>
                <div class="ui calendar" id="project_date_calendar">
                  <div class="ui input left icon">
                    <i class="calendar icon"></i>
                    <input
                      type="text"
                      placeholder="Date"
                      id="new-todo-due-date-project"
                      readonly="readonly"
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="actions">
            <div class="ui red cancel button">
              <i class="remove icon"></i>
              Cancel
            </div>
            <div class="ui green ok button" onclick="addTodoProject('${id}')">
              <i class="checkmark icon"></i>
              Create Todo
            </div>
          </div>
            ` 

            let rawMembers = `
            <tr class="center aligned">
                  <td>${response.master.name} (master)</td>
                </tr>
            `

            response.members.forEach(member => {
                rawMembers += `
                <tr class="center aligned">
                  <td>${member.name}</td>
                </tr>
                `
            })

            let rawMemberForm = `
            <div class="ui red cancel button">
              <i class="remove icon"></i>
              Cancel
            </div>
            <div class="ui blue ok button" onclick="addMember('${id}')">
              <i class="checkmark icon"></i>
              Add Member
            </div>
            `

            $('#todos-all-project').append(rawAll)
            $('#todos-incomplete-project').append(rawIn)
            $('#todos-complete-project').append(rawCom)
            $('#project-members').append(rawMembers)
            $('#add-member-form').append(rawMemberForm)
            $('#project-todo-form').append(rawForm)

            $('#add-member-button').on('click', () => {
                $('.ui.tiny.modal.addmember').modal('show')
            })

            $('#add-todo-project-button').on('click', () => {
                const today = new Date
        
                resetNewTodoForm()
        
                $('#project-todo-form').modal('show')
                $('#project_date_calendar').calendar({
                    type: 'date',
                    minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
                })
            })
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function addTodoProject(id) {

    const name = $('#new-todo-name-project').val()
    const description = $('#new-todo-desc-project').val() || null
    const due_date = $('#new-todo-due-date-project').val() || null

    console.log(name, description, due_date)
    $
        .ajax({
            url: `http://localhost:3000/projects/${id}/add-todo`,
            method: 'PUT',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                name, description, due_date
            }
        })
        .done(response => {
            projectPage(id)
            fetchMyProjects()
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function updateTodoProject(todoId, status, projectId) {
    event.preventDefault()

    $
        .ajax({
            url: `http://localhost:3000/projects/${projectId}/${todoId}`,
            method: 'PATCH',
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            },
            data: {
                status: status
            }
        })
        .done(response => {
            projectPage(projectId)
            fetchMyProjects()
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}

function deleteTodoProject(todoId, projectId) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $
                    .ajax({
                        url: `http://localhost:3000/projects/${projectId}/${todoId}`,
                        method: 'DELETE',
                        headers: {
                            accesstoken: localStorage.getItem('accesstoken')
                        }
                    })
                    .done(response => {
                        projectPage(projectId)
                        fetchMyProjects()

                        swal("Todo deleted!", {
                            icon: "success",
                        })
                    })
                    .fail((jqXHR, textstatus) => {
                        swal(jqXHR.responseJSON.message)
                    })
            }
        })
}

function addMember(projectId) {
    const newMemberEmail = $('#newMember').val()
    console.log(projectId)
    $
        .ajax({
            url: `http://localhost:3000/projects/${projectId}/add-member`,
            method: 'PUT',
            data: {
                email: newMemberEmail
            },
            headers: {
                accesstoken: localStorage.getItem('accesstoken')
            }
        })
        .done(response => {
            console.log(response)

            projectPage(projectId)
            fetchMyProjects()
        })
        .fail((jqXHR, textstatus) => {
            swal(jqXHR.responseJSON.message)
        })
}