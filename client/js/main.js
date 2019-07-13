if (localStorage.token) {
  $('#start').hide()
  $('#dashboard').show()
  getInfo()
}

function getInfo() {
  $('#user-profile-info').empty()
  $.post(`http://localhost:3000/users/dashboard`, {
    token : localStorage.token
  })
  .done((data) => {
    if (data.picture) {
      console.log(data.picture);
      $('#user-ava').attr('src', data.picture)
    }
    $('#user-profile-info').append(
      `<h2><span>Hello,</span><br> ${data.name}</h2>
      <h5>@${data.username}<h5>`
    )
  })
  .fail((err) => {
    console.log(err);
  })
}

function createTask() {
  
}

$('#create-todo').click(function() {
  $('#all-task').hide()
  $('#create-task').show()
})
