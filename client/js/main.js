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
    console.log('test done');
    console.log(data);
    if (data.picture) {

    }
    $('#user-profile-info').append(
      `<h2>Hello, ${data.name}</h2>
      <h5>@${data.username}<h5>`
    )
  })
  .fail((err) => {
    console.log(err);
  })
}

