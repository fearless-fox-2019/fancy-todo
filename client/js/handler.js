$(document).ready(function () {
  checkSignIn()

})


function checkSignIn() {
  if (localStorage.token) {
    $("#getting-started").hide();
    $("#home").show();
    getUserTodo()
  } else {
    $("#getting-started").show();
    $("#home").hide();
  }
}


function createTodo() {
  let todoDescription = $('textarea[name="todo-description"]').val()
  console.log(localStorage.getItem('_id'));

  let date = new Date($('#due_date').val())
  $.ajax({
      url: 'http://localhost:3000/todos/create',
      method: 'POST',
      data: {
        title: $('#todo-title').val(),
        description: todoDescription,
        due_date: date.toISOString(),
        user_id: localStorage.getItem('user_id')
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
    .done((newTodo) => {
      // console.log(newTodo);

      // $(`#todo-title`).val('')
      // $(`#todo-description`).empty()

      getUserTodo()
    })
    .fail(err => {
      console.log(err);

    })
}


function getUserTodo() {
  let {
    id
  } = JSON.parse(localStorage.getItem('data'))
  $.ajax({
      url: 'http://localhost:3000/todos/all',
      method: 'GET',
      headers: {
        token: localStorage.getItem('token'),
        id: id
      }
    })
    .done(userTodo => {
      // console.log(headers);
      // console.log('masuk sini');

      console.log(userTodo);

      $('#todos').empty()
      userTodo.forEach(el => {
        let status = !el.status ?
          `<div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="defaultUnchecked${el._id}" onclick="taskChecked('${el._id}')">
          <label class="custom-control-label" for="defaultUnchecked${el._id}">done</label>` :
          `<div class="custom-control custom-checkbox">
          <input type="checkbox" class="custom-control-input" id="defaultCheckedDisabled2" checked disabled>
          <label class="custom-control-label" for="defaultCheckedDisabled2">done</label>
        </div>`

        let button = !el.status ?
          `<div class="text-center">
          <a href="" class="btn btn-default btn-rounded mb-4" id="buttonTask${el._id}" data-toggle="modal" data-target="#modalUpdateTask${el._id}">Edit</a>
        </div>` :
          `<div class="text-center">
          <a href="" class="btn btn-default btn-rounded mb-4" id="buttonTask${el._id}" data-toggle="modal" data-target="#modalUpdateTask${el._id} disabled">Edit</a>
        </div>`

        $('#todos').append(`
        <tr>
          <td>${el.title}</td>
          <td>${el.description}</td>
          <td>${status}</td>
          <td>${el.due_date.slice(0, 10)}<td>
          <div class="modal fade" id="modalUpdateTask${el._id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header text-center">
                <h4 class="modal-title w-100 font-weight-bold">Write to us</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body mx-3">
                <div class="md-form mb-5">
                  <i class="fas fa-user prefix grey-text"></i>
                  <input type="text" id="update-title${el._id}" class="form-control validate" value="${el.title}">
                </div>
                <div class="md-form mb-5">
                  <i class="fas fa-user prefix grey-text"></i>
                  <input type="date" id="update-duedate${el._id}" class="form-control validate" value="${el.due_date.slice(0, 10)}">
                </div>
                <div class="md-form">
                  <i class="fas fa-pencil prefix grey-text"></i>
                  <textarea type="text" id="update-description${el._id}" class="md-textarea form-control" rows="4">${el.description}</textarea>
                </div>
      
              </div>
              <div class="modal-footer d-flex justify-content-center">
                <button class="btn btn-unique" onclick="updateTask('${el._id}')">Send <i class="fas fa-paper-plane-o ml-1"></i></button>
              </div>
            </div>
          </div>
        </div>
        ${button}
          </td>
          <td><button type="button" class="btn btn-danger" onclick="removeTask('${el._id}')">remove</button></td>
        </tr>
        `)
      })
    })
    .fail(err => {
      console.log(err)
    })
}


function onSignIn(googleUser) {

  if (!localStorage.getItem('token')) {
    const id_token = googleUser.getAuthResponse().id_token
    // console.log('masuk')
    $.ajax({
        url: 'http://localhost:3000/g-signin',
        method: 'POST',
        data: {
          token: id_token
        }
      })
      .done(response => {
        // console.log(response);
        
        localStorage.setItem('token', response.token)
        // console.log(localStorage.token)
        checkSignIn()

      })
      .fail(err => {
        console.log(err)
      })
  }
}





$("#btn-register").click(function () {
  $("#form-register").show();
  $("#form-signin").hide();
});

$("#btn-login").click(function () {
  $("#form-signin").show();
  $("#form-register").hide();
});