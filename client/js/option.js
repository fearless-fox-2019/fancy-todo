function option () {
  $('.delete-btn').click(function(event) {
    event.preventDefault()
    let id = $(this).closest('td').attr('id')
    deleteUserTodo(id, state)
    .then(result => {
      M.toast({html: 'Todo Deleted'})
      if(state == 'user') {
        fetchTodo()
      } else {
        getTodoProject(selectedProject._id)
      }
    })
    .catch(err => {
      M.toast({html: err.responseJSON.message})
    })
  })

  $('.edit-btn').click(function(event) {
    event.preventDefault()
    $('#edit-modal-container').empty()
    let id = $(this).closest('td').attr('id')
    findTodo(id)
    .then(todo => {
      todo.due_date = new Date(todo.due_date).toString().split(' ').slice(0, 4).join(' ')
      $('#edit-modal-container').append(`
      <div class="modal-content">
        <form id="edit-todo">
          <div class="input-field">
            <input  id="i-edit-name" type="text" value="${todo.name}" class="active">
            <label for="i-edit-name">Name</label>
          </div>
          <div class="input-field">
            <textarea name="description" id="i-edit-description" class="materialize-textarea active"></textarea>
            <label for="i-edit-description">Description</label>
          </div>
          <div class="input-field">
            <input  id="i-edit-date" type="text" class="datepicker active" value="${todo.due_date}">
            <label for="i-edit-date">Due Date</label>
          </div>
          <input type="submit" value="Edit" class="btn">
        </form>
      </div>
      `)
      $('#i-edit-description').val(todo.description);
      M.updateTextFields();
      $('#i-edit-date').datepicker();
      $('#i-edit-date').datepicker('setDate', new Date(todo.due_date));

      $('#edit-todo').submit(function(event) {
        event.preventDefault()
        let input ={
          name: $('#i-edit-name').val(),
          description: $('#i-edit-description').val(),
          date: $('#i-edit-date').val()
        }
        editUserTodo(id, input, state)
        .then(result => {
          if(state == 'user') {
            fetchTodo()
          } else {
            getTodoProject(selectedProject._id)
          }
          $('.modal').modal('close')
        })
        .catch(err => {
          M.toast({html: err.responseJSON.message})
        })
      })
    })
    .catch(err => {
      M.toast({html: err.responseJSON.message})
    })
  })

  $('.done-btn').click(function(event) {
    let id = $(this).closest('td').attr('id')
    updateStatusTodoUser(id, state)
    .then(result => {
      M.toast({html: 'Nice !'})
      if(state == 'user') {
        fetchTodo()
      } else {
        getTodoProject(selectedProject._id)
      }
    })
    .catch(err => {
      M.toast({html: err.responseJSON.message})
    })
  })
}