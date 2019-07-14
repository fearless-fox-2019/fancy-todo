function onSignIn(googleUser) {
  gapi.auth2.getAuthInstance().signOut()
  let profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  let id_token = googleUser.getAuthResponse().id_token

  axios.post('http://localhost:3000/users/signinGoogle',{
    id_token,
    username : profile.getName(),
    profpic : profile.getImageUrl()
  })
  .then((data)=>{
    localStorage.setItem('token',data.data.token)
    Swal.fire({ type: 'success', title: `Login Success`, showConfirmButton: false })
    setTimeout(function () {
      location.reload();
    }, 2000);
  })
  .catch((err)=>{
    console.log(err);
  })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    location.reload()
  });
}
