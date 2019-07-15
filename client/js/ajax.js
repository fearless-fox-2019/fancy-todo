const url = 'http://localhost:3000/api/'

function loginRegister(type, input) {
  return $.ajax({
    method: 'POST',
    url: `${url}users/${type}`,
    data: input
  })
}

function googleSignIn(googleUser) {
  const { id_token } = googleUser.getAuthResponse()
  return $.ajax({
    method: 'POST',
    url: `${url}users/login/google`,
    data: {
      id_token
    }
  })
}

function fetchUserTodo () {
  return $.ajax({
    method: 'GET',
    url: `${url}todos/user`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

function createTodoUser (input, type, project) {
  if(type === 'project') {
    return $.ajax({
      method: 'POST',
      url: `${url}todos/${type}/${project._id}`,
      data: input,
      headers: {
        token: localStorage.getItem('token')
      }
    })
  } else {
    return $.ajax({
      method: 'POST',
      url: `${url}todos/${type}`,
      data: input,
      headers: {
        token: localStorage.getItem('token')
      }
    })
  }
}

function deleteUserTodo (id, type) {
  return $.ajax({
    method: 'DELETE',
    url: `${url}todos/${type}/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

function findTodo (id) {
  return $.ajax({
    method: 'GET',
    url: `${url}todos/user/${id}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

function editUserTodo (id, input, type) {
  return $.ajax({
    method: 'PUT',
    url: `${url}todos/${type}/${id}`,
    data : input,
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

function updateStatusTodoUser (id, type) {
  return $.ajax({
    method: 'PATCH',
    url: `${url}todos/${type}/status/${id}`,
    headers: {
      token : localStorage.getItem('token')
    }
  })
}

function createNewProject (input) {
  return $.ajax({
    method: 'POST',
    url: `${url}projects`,
    data : input,
    headers : {
      token : localStorage.getItem('token')
    }
  })
}

function fetchProjectList () {
  return $.ajax({
    method: 'GET',
    url: `${url}projects`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

function fetchProjectTodo (projectId) {
  return $.ajax({
    method: 'GET',
    url: `${url}todos/project/${projectId}`,
    headers : {
      token : localStorage.getItem('token')
    }
  })
}

function createTodoProject(projectId, input) {
  return $.ajax({
    method: 'POST',
    url: `${url}todos/project/${projectId}`,
    data: input,
    headers : {
      token: localStorage.getItem('token')
    }
  })
}

function addMember(projectId, input) {
  return $.ajax({
    method: 'GET',
    url: `${url}users/${input}`,
    headers: {
      token: localStorage.getItem('token')
    }
  })
}

function editName(projectId, input) {
  return $.ajax({
    method: 'PATCH',
    url: `${url}projects/editname/${projectId}`,
    data: input,
    headers : {
      token: localStorage.getItem('token')
    }
  })
}

function kickMember(projectId, input) {
  return $.ajax({
    method: 'PATCH',
    url: `${url}projects/kickmember/${projectId}`,
    data: input,
    headers : {
      token: localStorage.getItem('token')
    }
  })
}

