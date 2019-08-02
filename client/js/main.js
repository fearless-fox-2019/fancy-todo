if (localStorage.token) {
  $('#start').hide()
  $('#dashboard').show()
}

$(document).ready(function() {
  getInfo()
})

function getInfo() {
  $('#user-profile-info').empty()
  $.ajax(`http://34.87.60.115/users/dashboard`, {
    method : 'GET',
    headers : {
      token : localStorage.getItem('token')
    }
  })
  .done((data) => {
    if (data.picture) {
      $('#user-ava').attr('src', data.picture)
    }
    $('#user-profile-info').append(
      `<h2><span>Hello,</span><br>${data.fullname || data.name}</h2>
      <h5>@${data.username}<h5>`
    )
  })
  .fail((err) => {
    console.log(err);
  })
}

function getTasks() {
  event.preventDefault()
  $('#all-task').show()
  $('#search-bar').show()
  $('#completed-task').hide()
  $('#create-task').hide()
  $('#pending-task').hide()
  $('#all-task').empty()
  $.ajax({
    url :'http://34.87.60.115/todos/all',
    method : 'GET',
    headers : {
      token : localStorage.getItem('token')
    }
  })
  .done((data) => {
    data.forEach((val) => {
      let cardtodo  = `
      <div class="col s3 todo" style="margin-left: 35px; margin-top: 20px;">
        <div class="content-todo">
          <h3>${val.name}</h3>
          <div class="todo-status" id="todo-${val._id}"> 
            <h5 style="color: ${(val.isFinished === true) ? 'green' : 'red'}">${(val.isFinished === true) ? 'Done' : 'Pending'}</h5>
            ${(val.isFinished === true) ? 
              `<p style="margin-left: 7.5px;" class="due">Completed ${moment(val.updatedAt.split('T')[0]).fromNow()}</p>` :
              `<p style="margin-left: 7.5px;" class="due">Due In ${moment(val.dueDate.split('T')[0]).fromNow()}</p>`
            }
          </div>
          <p>${val.description}</p>
        </div>
      </div>
      `
      $('#all-task').append(cardtodo)
    })
    console.log(data);
  })
  .fail((err) => {
    console.log(err);
  })
}

function renderForm() {
  $('#all-task').hide()
  $('#completed-task').hide()
  $('#pending-task').hide()
  $('#search-bar').hide()
  $('#create-task').show()
}

function createTask() {
  const input = $('#create-task :input').serializeArray()
  let data = input.reduce((acc, val) => {
    if (acc[val.name] == undefined) {
      (val.name == 'date') ? acc[val.name] = new Date(val.value) : acc[val.name] = val.value
    }
    return acc
  }, {})
  $.ajax(`http://34.87.60.115/todos/create`, {
    method : 'POST',
    data : data,
    headers :  {
      token : localStorage.getItem('token')
    }
  })
  .done((data) => {
    Swal.fire(
      'Task Created',
      `Success Created Task : ${data.name}`,
      'success'
    )  
  })
  .fail((err) => {
    Swal.fire(
      'Something Happened',
      err.responseJSON.message,
      'error'
    )  
  })
}

function completeTask(input) {
  $.ajax({
    url : `http://34.87.60.115/todos/complete`,
    method : 'PATCH',
    headers : {
      token : localStorage.getItem('token'),
      id : input
    }
  })
  .done((data) => {
    getPending()
    Swal.fire(
      'You Have Finished This Task !',
      data.name,
      'success'
    )
    console.log(data);
  })
  .fail((err) => {
    getPending()
    Swal.fire(
      'Something Happened',
      err.responseJSON.message,
      'error'
    )  
  })
}

function uncompleteTask() {

}

function deleteTask(input) {
  $.ajax({
    url : `http://34.87.60.115/todos/delete`,
    method : 'DELETE',
    headers : {
      token : localStorage.getItem('token'),
      id : input
    }
  })
  .done((data) => {
    getComplete()
    Swal.fire(
      'Task Deleted !',
      'Success Delete this Task',
      'success'
    )
    console.log(data);
  })
  .fail((err) => {
    getPending()
    Swal.fire(
      'Something Happened',
      err.responseJSON.message,
      'error'
    )  
  })
  console.log(input);
}

function getPending() {
  event.preventDefault();
  $('#all-task').hide()
  $('#search-bar').hide()
  $('#completed-task').hide()
  $('#create-task').hide()
  $('#pending-task').show()
  $('#pending-task').empty()
  $.ajax({
    url :'http://34.87.60.115/todos/pending',
    method : 'GET',
    headers : {
      token : localStorage.getItem('token')
    }
  })
  .done((data) => {
    data.forEach((val) => {
      let cardtodo  = `
      <div class="col s3 todo" style="margin-left: 35px; margin-top: 10px; margin-top: 20px;">
        <div class="content-todo">
          <h3>${val.name}</h3>
          <div class="todo-status" id="todo-${val._id}">
            <h5 style="color: red">Pending</h5>
            ${(val.isFinished === true) ? 
              `<p style="margin-left: 7.5px;" class="due">Completed ${moment(val.updatedAt.split('T')[0]).fromNow()}</p>` :
              `<p style="margin-left: 7.5px;" class="due">Due In ${moment(val.dueDate.split('T')[0]).fromNow()}</p>`
            }
          </div>
          <p>${val.description}</p>
        </div>
        <div class="center-align">
          <a class="waves-effect waves-light btn" onclick="completeTask('${val._id}')">Mark as Complete</a>
        </div>
      </div>
      `
      $('#pending-task').append(cardtodo)
    })
    console.log(data);
  })
  .fail((err) => {
    console.log(err);
  })
}

function getComplete() {
  event.preventDefault();
  $('#all-task').hide()
  $('#create-task').hide()
  $('#pending-task').hide()
  $('#completed-task').show()
  $('#completed-task').empty()
  $('#search-bar').hide()
  $.ajax({
    url :'http://34.87.60.115/todos/completed',
    method : 'GET',
    headers : {
      token : localStorage.getItem('token')
    }
  })
  .done((data) => {
    data.forEach((val) => {
      let cardtodo  = `
      <div class="col s3 todo" style="margin-left: 35px; margin-top: 20px;">
        <div class="content-todo">
          <h3>${val.name}</h3>
          <div class="todo-status" id="todo-${val._id}">
            <h5 style="color: green">Done</h5>
            ${(val.isFinished === true) ? 
              `<p style="margin-left: 7.5px;" class="due">Completed ${moment(val.updatedAt.split('T')[0]).fromNow()}</p>` :
              `<p style="margin-left: 7.5px;" class="due">Due In ${moment(val.dueDate.split('T')[0]).fromNow()}</p>`
            }
          </div>
          <p>${val.description}</p>
        </div>

        <div class="center-align">
          <a class="waves-effect waves-light btn" onclick="deleteTask('${val._id}')">Delete Task</a>
        </div>
      </div>
      `
      $('#completed-task').append(cardtodo)
    })
    console.log(data);
  })
  .fail((err) => {
    console.log(err);
  })
}
