

function appendTodo(todos) {
  $('#todo-list').empty()
  todos.forEach(todo => {
    todo.due_date = new Date(todo.due_date).toString().split(' ').slice(0, 4).join(' ')
    if(!todo.status) {
      $('#todo-list').append(`
      <tr>
        <td>${todo.name}</td>
        <td>${todo.description}</td>
        <td>${todo.due_date}</td>
        <td class="option-todo" id="${todo._id}"><p class="btn green lighten-2 done-btn">Done</p> <p class="btn  light-blue darken-2 edit-btn modal-trigger" data-target="edit-modal-container">Edit</p><p class="btn red accent-2 delete-btn">Delete</p></td>
      </tr>
      `)
    }
  });
}

function appendDone(todos) {
  $('#done-list').empty()
  todos.forEach(todo => {
    if(todo.status) {
      $('#done-list').append(`
        <tr>
          <td>${todo.name}</td>
          <td>${todo.description}</td>
        </tr>
      `)
    }
  });
}


function loginState() {
  fetchUserTodo()
  .then(todos => {
    M.toast({html: 'mantap sudah login gan !!!'})
    changeDisplay(true, ['#inside', '.login-true', '#sidebar'])
    changeDisplay(false, ['#outside', '.login-false'])
    let user = JSON.parse(localStorage.getItem('user'))
    loggedUser = user
    $('#username').html(user.email)
    todos = todos
    appendTodo(todos)
    appendDone(todos)
    option()
  })
  .catch(err =>{
    console.log(err)
    M.toast({html: err.message})
  })
}


function fetchTodo() {
  fetchUserTodo()
  .then(todos => {
    appendTodo(todos)
    appendDone(todos)
    option()
  })
  .catch(err =>{
    console.log(err)
    M.toast({html: err.message})
  })
}

function getTodoProject(id) {
  fetchProjectTodo(id)
  .then(todos => {
    appendTodo(todos)
    appendDone(todos)
    option()
  })
  .catch(err => {
    console.log(err)
    M.toast({html: err.responseJSON.message})
  })
}