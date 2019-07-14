function searchTask() {
  event.preventDefault()
  $('#all-task').empty()
  const search = $('#search-val').val();
  $.ajax(`http://localhost:3000/todos/find?name=${search}`, {
    method :  'GET',
    headers : {
      token : localStorage.getItem('token'),
    },
  })
  .done((data) => {
    if (data.length == 0) {
      Swal.fire({
        type: 'error',
        title: 'Couldn\'nt find any Task',
        text: `There are no matchhing task with ${search}`,
      })
    } else {
      Swal.fire({
        type: 'success',
        title: 'Found !',
        text: `Found matchhing task with ${search}`,
      })
    }
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
  })
  .fail((err) => {
    Swal.fire({
      type: 'error',
      title: 'Something Bad Happened',
      text: err.responseJSON.message,
    })
  })
}