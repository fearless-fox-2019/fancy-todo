var sidenav = M.Sidenav.getInstance($('.sidenav'));
$(document).ready(function(){
  $('.modal').modal();
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('.datepicker').datepicker();
  $('#your-todo').click(function(event) {
    event.preventDefault()
    state = 'user'
    fetchTodo()
    $('.sidenav').sidenav('close')
    changeDisplay(false, ['#project-name', '.menu-project'])
  })
  $('#new-todo').submit(function(event) {
    event.preventDefault()
    let input = {
      name : $('#i-new-name').val(),
      description: $('#i-new-description').val(),
      date: $('#i-new-date').val()
    }
    if(state == 'user') {
      selectedProject = null
    }
    createTodoUser(input, state, selectedProject)
    .then(result => {
      M.toast({html: 'Todo created !'})
      if(state == 'user') {
        fetchTodo()
      } else {
        getTodoProject(selectedProject._id)
      }
      $('#i-new-name').val('')
      $('#i-new-description').val('')
      $('#i-new-date').val('')
      $('.modal').modal('close')
    })
    .catch(err => {
      console.log(err)
      M.toast({html: err.responseJSON.message})
    })
  })

  $('#create-project-form').submit(function(event) {
    event.preventDefault()
    let input = {
      name : $('#i-new-name-project').val()
    }
    createNewProject(input)
    .then(result => {
      getProjectList()
      M.toast({html: 'Project created !'})
      $('.modal').modal('close')
    })
    .catch(err => {
      console.log(err)
      M.toast({html: err})
    })
  })
});