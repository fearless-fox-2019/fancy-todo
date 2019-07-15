let loggedUserProject
let selectedProject
function appendList(projects) {
  $('#project-list').empty()
  projects.forEach(project => {
    $('#project-list').append(`
    <li id="${project._id}" class="item-project"> &nbsp;  &nbsp;  ${project.name}</li>
    `)
  });
}
function appendMembers(project) {
  $('#members-list').empty()
  $('#owner-text').html('Owner: ' + project.owner.email)
  $('#members-list').prepend(`
    <p style="text-align: center; padding: 5px 0;">Members in project ${project.name}</p>
  `)
  project.members.forEach(user => {
    $('#members-list').append(`
      <li class="collection-item">
      ${user.email}
        <div class="logo-kick" id="${user._id}">
          <i class="fas fa-times logo-kick" id="${user._id}"></i>
        </div>
      </li>
    `)
  })
}
function eventProject() {
  $('.item-project').click(function(event) {
    event.preventDefault()
    state = 'project'
    let id = this.id
    selectedProject = loggedUserProject.filter(project => project._id === id)[0]
    getTodoProject(id)
    appendMembers(selectedProject)
    kick()
    changeDisplay(true, ['#project-name', '.menu-project'])
    $('#project-name').html( 'Project: ' + selectedProject.name)
    $('.sidenav').sidenav('close');
  })

  $('#addmember-btn').click(function(event) {
    event.preventDefault()
    let email = $('#i-email-addmember').val()
    addMember(selectedProject._id, email)
    .then(result => {
      return $.ajax({
        method: 'POST',
        url: `${url}projects/add/${selectedProject._id}`,
        data: {
          users: result._id
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
    })
    .then(result => {
      M.toast({html: 'Member added'})
      appendMembers(selectedProject)
    })
    .catch(err => {
      console.log(err)
      M.toast({html: err.responseJSON.message})
    })
  })

  $('#edit-name-btn').click(function(event) {
    event.preventDefault()
    $('#edit-name-form').empty()
    $('#edit-name-form').append(`
    <div class="modal-content">
      <form id="edit-name">
        <div class="input-field">
          <input placeholder="Name" id="i-edit-name-project" value="${selectedProject.name}" type="text" class="active">
          <label for="i-edit-name-project">Name</label>
        </div>
        <input type="submit" value="Edit" class="btn">
      </form>
    </div>
    `)

    $('#edit-name').submit(function(event) {
      event.preventDefault()
      let input = {
        name: $('#i-edit-name-project').val()
      }
      editName(selectedProject._id, input)
      .then(result => {
        M.toast({html: 'Project name edited!'})
        getTodoProject(selectedProject._id)
        $('.modal').modal('close')
        $('#project-name').html( 'Project: ' + result.name)
      })
      .catch(err => {
        console.log(err)
        M.toast({html: err.responseJSON.message})
      })
    })
  })
}

function kick() {
  $('.logo-kick').click(function(event) {
    let userId = this.id
    if(userId == loggedUser._id) {
      M.toast({html: "You cannot kick yourself"})
    } else {
      let input = {
        user: userId
      }
      kickMember(selectedProject._id, input)
      .then(result => {
        M.toast({html: 'Member kicked !'})
      })
      .catch(err =>  {
        console.log(err)
        M.toast({html: err.responseJSON.message})
      })
    }
  })
}

function getProjectList() {
  fetchProjectList()
  .then(projects => {
    loggedUserProject = projects
    appendList(projects)
    eventProject()
  })
  .catch(err => {
    M.toast({html: err.responseJSON.message})
  })
}