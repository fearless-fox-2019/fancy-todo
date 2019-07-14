const baseUrl='http://localhost:3000'
let currentProjectId= ''

$( document ).ready(function() {
    console.log( "ready!" );

    isLogin()

    $('.modal').modal()

    $('#toLogin').click(function(event){
        event.preventDefault()
        $('#loginPage').show()
        $('#registerPage').hide()
    })

    $('#toRegister').click(function(event){
        event.preventDefault()
        $('#loginPage').hide()
        $('#registerPage').show()
    })

    $('#formRegister').submit(function (event) {
        event.preventDefault()
        let newUser = {
          name: $('#nameRegis').val(),
          email: $('#emailRegis').val(),
          password: $('#passwordRegis').val()
        }
        console.log(newUser, 'new User')
         register(newUser)
    })
    
    $('#formLogin').submit(function (event) {
        event.preventDefault()
        let loginOption = {
          email: $('#email').val(),
          password: $('#password').val()
        }
        console.log('masuk login')
        console.log( $('#email').val())
         login(loginOption)
    })

    $('#logout').click(function(event){
        event.preventDefault()
        logout()
    })

    $('#toAddProject-btn').on('click',function(){
      fetchAllUser()
    })

    $('#addProject-btn').on('click', function(event){
      event.preventDefault()
      addProject()
    })


});

function isLogin(){
    if(localStorage.token){
        hasToken()
    }else{
        noToken()
    }
}

function noToken(){
    $('#landingPage').show()
    $('#loginPage').show()
    $('#registerPage').hide()
    $('#contentPage').hide()
}

function hasToken(){
    $('#landingPage').hide()
    $('#contentPage').show()
    $('#today').empty()
    $('#today').append(`${new Date().toLocaleDateString('en-US',
                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)
    $('#loggedName').empty()
    $('#loggedName').append(`Welcome, ${localStorage.name}`)
    fetchProject()

}


function register(newUser){
    $.ajax({
        url: `${baseUrl}/users/register`,
        method: 'post',
        dataType: 'json',
        data: newUser
        })
    .done(function(success){
        console.log(success)
        let loginOption = {
            email : newUser.email,
            password: newUser.password
        }
        login(loginOption)

        $('#nameRegis').val(''),
        $('#emailRegis').val(''),
        $('#passwordRegis').val('')
        })
    .fail(function(jqXHR,error){
        console.log('error register')
        console.log(error)
        })
}

function login (input) {
    $.ajax({
      url: `${baseUrl}/users/login`,
      method: 'post',
      dataType: 'json',
      data: input
    })
    .done(function(user){
    console.log(user)
    localStorage.setItem('token', user.token)
    localStorage.setItem('name', user.name)
    localStorage.setItem('userId', user.userId)
    hasToken()

    $('#email').val(''),
    $('#password').val('')
    })
    .fail(function(jqXHR, error){
        console.log('error login')
        console.log(error)
    })
  }

function onSignIn(googleUser) {
  // console.log('masuk google sign in')
    const idToken= googleUser.getAuthResponse().id_token
     $.ajax({
        url: `${baseUrl}/users/loginGoogle`,
        method: 'post',
        dataType: 'json',
        data:{idToken}
     })
     .done(function(user){
        localStorage.setItem('token', user.token)
        localStorage.setItem('name', user.name)
        localStorage.setItem('userId', user.userId)
        hasToken()
     })
     .fail(function(jqXHR, err){
        console.log('error sign in google');
        console.log(err)
     })
  }

function logout() {
    Swal.fire({
      title: 'Are you sure to sign out?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    })
    .then((result) => {
      if (result.value) {
          localStorage.clear()
          noToken()
        //sign out google
        const auth2 = gapi.auth2.getAuthInstance();
  
        auth2.signOut()
        .then(function(){
          console.log('User signed out')
          noToken()
        })
        .catch(function(err){
          console.log(err)
        })
        
      }
    })
    
  }

function fetchAllUser(){
  console.log('masuk fetch user')
   $.ajax({
     url: `${baseUrl}/users`,
     method: 'get',
     headers:{
       token: localStorage.token
     }
   })
   .done(users =>{
    $('#userList').empty()
     console.log(users)
      if(users.length<1){
        $('#userList').append(`
            <h5>No User Can Be Invite</h5>
        `)
      }else{
        users.forEach(user => {
          if(user._id != localStorage.userId)
          $('#userList').append(`
              <div class="col s12">
              <label>
                  <input type="checkbox" value="${user._id}" name="user"/>
                  <span>${user.name}</span>
              </label>
              </div>
          `)
        });
      }
   })
   .fail(err =>{
     console.log('masuk error fetch user')
     console.log(err)
   })
}

function addProject(){
  let name=$('#nameProject').val()
  let desc= $('#descProject').val()
  
  let members = []
    $.each($("input[name='user']:checked"),function(){
        members.push($(this).val())
    })
    members.push(localStorage.userId)


  let newProject= {
    name: name,
    description: desc,
    members: members
  }

  console.log(newProject)

  $.ajax({
    url: `${baseUrl}/projects`,
    method: 'post',
    data: {
      name: name,
      description: desc,
      members: members
    },
    headers:{
      token: localStorage.token
    }
  })
  .done(response =>{
    $('#nameProject').val('')
    $('#descProject').val('')
    $('#userList').empty()
    $('#addProjectModal').hide()
    fetchProject()
    Swal.fire({
      position: 'center',
      type: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  })
  .fail(err =>{
    console.log('error add project')
    console.log(err)
        
  })
  

}

function fetchProject(){
  
  $.ajax({
    url: `${baseUrl}/projects`,
    method: 'get',
    headers:{
      token: localStorage.token
    }
  })
  .done(projects =>{
    // console.log(projects);
    
    $('#projectList').empty()
    if(projects.length<1){
      $('#projectList').append(`
        <div class="row">
          <div class="col s12 m6">
            <div class="card horizontal" style="width:400px; background-color: #ef5350">
              <div class="card-content black-text">
                <h6 style="font-weight: bold; margin-left:55px">No Project on Your Account!</h6>
                <h6 style="font-weight: bold; margin-left:35px">Please Make Project to Add Todo</h6>
              </div>
            </div>
          </div>
        </div>
      `)
    }else{
      projects.forEach(project =>{
        if(project.creator._id == localStorage.userId){
          $('#projectList').append(`
            <div class="row" style="margin: 0 auto" >
              <div class="col s12 m6">
                <div class="card" style="width: 350px; background-color:#ffcdd2 ">
                  <div class="card-image row">
                    <a onclick="showModalEditProject('${project._id}')" href="#editProjectModal" class="btn-flat modal-trigger" style="position:absolute;; font-size:10px; color: orange; top: 3px; right:40px; height:30px">
                      <i class="fas fa-edit"></i>
                    </a>
                    <a onclick="removeProject('${project._id}','${project.name}')" class="btn-flat" style="position:absolute;; font-size:20px; color: red; top: 3px; right:10px; height:30px">
                      <i class="fas fa-times"></i>
                    </a>
                  </div>
                  <div class="card-content black-text" style="margin: 0 auto; line-height: 1; height:120px;">
                    <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -30px;">${project.name}</span>
                    <p style="font-size: 14px;">${project.description}</p>
                    <p style="font-size: 14px;">Creator: ${project.creator.name}</p>
                  </div>
                  <div class="card-action" style="font-size: 11px; background-color: black; font-weight: bold">
                    <a href="#inviteMemberModal" class="modal-trigger" onclick="showModalInviteMember('${project._id}')">Add Member</a>
                    <a href="#addTodoModal" class="modal-trigger" onclick="showModalAddTodo('${project._id}')">Add Todo</a>
                    <a onclick="getTodos('${project._id}')" id="listTodo-btn">View Todos</a>
                  </div>
                </div>
              </div>
            </div>
        `)
        }else{
        $('#projectList').append(`
            <div class="row" style="margin: 0 auto" >
              <div class="col s12 m6">
                <div class="card" style="width: 300px; background-color: #c8e6c9">
                  <div class="card-content black-text" style="margin: 0 auto; line-height: 1; height:100px;">
                    <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -20px;">${project.name}</span>
                    <p style="font-size: 14px;">${project.description}</p>
                    <p style="font-size: 14px;">Creator: ${project.creator.name}</p>
                  </div>
                  <div class="card-action" style="font-size: 11px; background-color: black; font-weight: bold">
                    <a class="modal-trigger" href="#addTodoModal" onclick="showModalAddTodo('${project._id}')">Add Todo</a>
                    <a onclick="getTodos('${project._id}')" id="listTodo-btn">View Todo</a>
                  </div>
                </div>
              </div>
            </div>
          `)
        }
      })
    }
  })
  .fail(err=>{
    console.log('error fetch project')
    console.log(err)    
  })
}

function showModalAddTodo(id){
  event.preventDefault()
  currentProjectId= id
  console.log(currentProjectId);
  
  $.ajax({
    url: `${baseUrl}/projects/${id}`,
    method: 'get',
    headers: {
      token: localStorage.token
    }
  })
  .done(project =>{
    $('#addTodoModal').empty()
    $('#addTodoModal').append(`  
        <div class="modal-content">
          <h5 style="text-align:center; font-weight:bold; text-decoration:underline">Add New Todo</h5><br>
          <div class="row" id="formAddTodo">
              <form class="col s12">
                  <div class="row">
                    <div class="input-field col s12">
                      <input disabled value=${project._id} id="disabled" type="text" class="validate" style="visibility: hidden">
                      <label for="projectName">Project: ${project.name}</label>
                    </div>
                  </div>
                  <div class="row">
                      <div class="input-field col s12">
                          <input id="nameTodo" type="text" class="validate">
                          <label for="nameTodo">Name</label>
                      </div>
                  </div>
                  <div class="row">
                      <div class="input-field col s12">
                          <input id="descTodo" type="text" class="validate">
                          <label for="descTodo">Description</label>
                      </div>
                  </div>
                  <div class="row">
                    <div class="input-field col s12">
                        <input id="dueDate" type="date" class="datepicker" name="dueDate" required="">
                        <label for="dueDate">Due Date</label>
                    </div>
                </div>
              </form>
          </div>
      </div>
      <div class="modal-footer">
          <button id="addTodo-btn" onclick="addTodo()" class="btn waves-effect waves-light" type="submit" name="action">Save</button>
      </div>
    `)
  })
  .fail(err =>{
    console.log('error show modal add todo')
    console.log(err)
    
  })
}

function addTodo(){
  console.log('masuk add todo projectId', currentProjectId);

  let newTodo={
    name: $('#nameTodo').val(),
    description: $('#descTodo').val(),
    dueDate: $('#dueDate').val(),
    projectId: currentProjectId
  }
  
  if(new Date(newTodo.dueDate)< new Date()== true){
    Swal.fire({
      type: "error",
      title: "Check Your Date!",
      text: 'Due Date minimal tomorrow.',
      showConfirmButton: true,
    })
    console.log('lebih kecil')
  }else{
    $.ajax({
      url: `${baseUrl}/todos`,
      method: 'post',
      dataType: 'json',
      data:newTodo,
      headers: {
        token: localStorage.token
      }
    })
    .done(todo =>{
      $('#nameTodo').val(null)
      $('#descTodo').val(null)
      $('#dueDate').val(null)
      $('#addTodoModal').hide()
      Swal.fire({
        position: 'center',
        type: 'success',
        title: 'Success Add Todo',
        showConfirmButton: false,
        timer: 1200
      })
      getTodos(currentProjectId)
    })
    .fail(err =>{
      console.log('error add todo')
      console.log(err)
      
    })
  }
}

function getTodos(id){
  currentProjectId= id
  fetchTodo()
  fetchFinished()
}

function fetchTodo(){
  console.log('masuk fetch todo');
  
  $.ajax({
    url: `${baseUrl}/todos/todo/${currentProjectId}`,
    method: 'get',
    headers:{
      token: localStorage.token
    }
  })
  .done(todos =>{
    console.log(todos);
    $('#todoList').empty()
    if(todos.length<1){
      $('#todoList').append(`
          <div class="row" >
            <div class="col s12 m6">
              <div class="card horizontal" style="width: 400px; background-color: #ef5350">
                <div class="card-content black-text" style="text-align:center">
                  <h6 style="font-weight: bold; margin-left: 70px;"> No Task on This Project!</h6>
                  <h6 style="font-weight: bold; margin-left: 60px;">Please Add New Todo</6>
                </div>
              </div>
            </div>
          </div>
      `)
    }else{
      let projectName= todos[0].projectId.name
      $('#todoList').append(`
          <h6 id="todoList-titleProject">List Todo Project ${projectName}</h6>
      `)
      todos.forEach(todo =>{
        $('#todoList').append(`
            <div class="row" style="margin: 0 auto" >
              <div class="col s12 m6">
                <div class="card" style="width: 375px; background-color: #f0f4c3; ">
                  <div class="card-image">
                    <a onclick="removeTodo('${todo._id}','${todo.name}')" class="btn-flat" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px;">
                      <i class="fas fa-times"></i>
                    </a>
                  </div>
                  <div class="card-content black-text" style="margin: 0 auto; line-height: 1; height:150px;">
                    <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -15px;">${todo.name}</span>
                    <p style="font-size: 14px; margin-top:-5px">${todo.description}</p>
                    <p style="font-size: 14px;">Deadline: ${new Date(todo.dueDate).toLocaleDateString('en-US',
                                        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p style="font-size: 14px;">Status: ${todo.status}</p>
                    <p style="font-size: 14px; margin-bottom:10px;">Creator: ${todo.userId.name}</p>
                  </div>
                  <div class="card-action"style="font-size: 11px; background-color: black; font-weight: bold;">
                    <a href="#editTodoModal" onclick="showModalEditTodo('${todo._id}')" class="modal-trigger">Edit</a>
                    <a onclick="updateFinished('${todo._id}')">Finish</a>
                  </div>
                </div>
              </div>
            </div>
        `)
      })
    }
  })
  .fail(err =>{
    console.log('error fetch todo')
    console.log(err)
    
  })
}

function fetchFinished(){
  console.log('masuk fetch finished');
  
  $.ajax({
    url: `${baseUrl}/todos/finished/${currentProjectId}`,
    method: 'get',
    headers:{
      token: localStorage.token
    }
  })
  .done(todos =>{
    console.log(todos);
    $('#finishedList').empty()
    if(todos.length<1){
      $('#finishedList').append(`
          <div class="row" >
            <div class="col s12 m6">
              <div class="card horizontal" style="width: 400px; background-color: #ef5350">
                <div class="card-content black-text">
                  <h6 style="margin-left:40px; font-weight:bold">No Finished Task for This Project</h6>
                </div>
              </div>
            </div>
          </div>
      `)
    }else{
      let projectName= todos[0].projectId.name
      $('#finishedList').append(`
          <h6 id="finishedList-projectTitle">Finished Task Project ${projectName}</h6>
      `)
      todos.forEach(todo =>{
        $('#finishedList').append(`
            <div class="row"  >
              <div class="col s12 m6">
                <div class="card" style="width: 400px; margin: 0 auto; background-color:#a5d6a7  ">
                  <div class="card-image">
                    <a onclick="removeTodo('${todo._id}','${todo.name}')" class="btn-flat" style="position:absolute;; font-size:10px; color: red; top: 3px; right:3px; height:30px">
                      <i class="fas fa-times"></i>
                    </a>
                  </div>
                  <div class="card-content black-text" style="margin: 0 auto; line-height: 1; height:130px;">
                    <span class="card-title" style="font-size: 16px; font-weight: bold; margin-top: -10px;">${todo.name}</span>
                    <p style="font-size: 14px; margin-top: -5px;">${todo.description}</p>
                    <p style="font-size: 14px;">Deadline: ${new Date(todo.dueDate).toLocaleDateString('en-US',
                                                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p style="font-size: 14px;">Status: ${todo.status}</p>
                    <p style="font-size: 14px;">Creator: ${todo.userId.name}</p>
                  </div>
                </div>
              </div>
            </div>
        `)
      })
    }
  })
  .fail(err =>{
    console.log('error fetch todo')
    console.log(err)
  })
}

function updateFinished(id){
  console.log('ini id todo', id);
  console.log(`${baseUrl}/todos/${id}`);
  
  $.ajax({
    url:`${baseUrl}/todos/${id}`,
    method: 'patch',
    data:{
      status: 'finished'
    },
    headers:{
      token: localStorage.token
    }
  })
  .done(response =>{
    console.log('success update',response);
    
    fetchTodo()
    fetchFinished()
  })
  .fail(err =>{
    console.log('masuk error update finish');
    console.log(err);
  })
}

function removeTodo(id, name){
  console.log(id);
  
  Swal.fire({
    title: 'Are You sure delete this task?',
    text: name,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sure!'
  })
  .then((result) => {
    if(result.value){
      console.log('masuk remove todo', id)
      $.ajax({
        url: `${baseUrl}/todos/${id}`,
        method: 'delete',
        headers:{
          token: localStorage.token
        }
      })
      .done(response =>{
        Swal.fire({
          position: 'center',
          type: 'success',
          title: `Success Delete Task ${name}`,
          showConfirmButton: false,
          timer: 1200
        })
        getTodos(currentProjectId)
      })
      .fail(err =>{
        console.log('error delete todo')
        console.log(err)
      })
    }
  })
}

function removeProject(id, name){

    Swal.fire({
    title: 'Are You sure delete this project?',
    text: name,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sure!'
  })
  .then((result) => {
    if(result.value){
      console.log('masuk remove project', id)
      $.ajax({
        url: `${baseUrl}/projects/${id}`,
        method: 'delete',
        headers:{
          token: localStorage.token
        }
      })
      .done(response =>{
        Swal.fire({
          position: 'center',
          type: 'success',
          title: `Success Delete Project ${name}`,
          showConfirmButton: false,
          timer: 1200
        })
        fetchProject()
      })
      .fail(err =>{
        console.log('error delete todo')
        console.log(err)
      })
    }
  })
  
}

function showModalInviteMember(id){
  currentProjectId= id
 $.ajax({
   url: `${baseUrl}/projects/${id}`,
   method: 'get',
   headers:{
     token: localStorage.token
   }
 })
 .done(project =>{
    $.ajax({
      url: `${baseUrl}/users`,
      method: 'get',
      headers:{
        token: localStorage.token
      }
    })
    .done(users =>{
      $('#userListInvite').empty()
      if(users.length<1){
        $('#userListInvite').append(`
            <h5>No User Can Be Invite</h5>
        `)
      }else{
        users.forEach(user => {
          if(user._id != localStorage.userId){
            if(project.members.indexOf(user._id)== -1){
              $('#userListInvite').append(`
                <div class="col s12">
                  <label>
                      <input type="checkbox" value="${user._id}" name="userInvite"/>
                      <span>${user.name}</span>
                  </label>
                </div>
              `)
            }else{
              $('#userListInvite').append(`
              <div class="col s12">
                <label>
                    <input type="checkbox" value="${user._id}" name="userInvite"checked/>
                    <span>${user.name}</span>
                </label>
              </div>
            `)
            }
          }
        })
      }
    })
 })
 .fail(err =>{
   console.log('masuk error ajax get one project')
   console.log(err)
 })
}

function inviteMember(){
  let members = []
  $.each($("input[name='userInvite']:checked"),function(){
      members.push($(this).val())
  })

  $.ajax({
    url: `${baseUrl}/projects/invite/${currentProjectId}`,
    method: 'patch',
    data: {
      members: members
    },
    headers:{
      token: localStorage.token
    }
  })
  .done(response =>{
    $('#inviteMemberModal').hide()
    Swal.fire({
      position: 'center',
      type: 'success',
      title: `Success Invite Member`,
      showConfirmButton: false,
      timer: 1200
    })
  })
  .fail(err => {
    console.log('masuk error invite member')
    console.log(err)
  })
}

function showModalEditTodo(id){
  $.ajax({
    url: `${baseUrl}/todos/${id}`,
    method: 'get',
    headers:{
      token: localStorage.token
    }
  })
  .done(todo =>{

    let date = todo.dueDate.substring(0,10)


    $('#editTodoModal').append(`
        <div class="modal-content">
          <h5 style="text-align:center; font-weight:bold; text-decoration:underline">Edit Todo</h5><br>
          <div class="row" id="formAddTodo">
              <form class="col s12">
                  <div class="row">
                    <div class="col s12">
                      Name: 
                      <div class="input-field inline">
                        <input id="nameTodoEdit" type="text" value="${todo.name}" class="validate">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col s12">
                      Description: 
                      <div class="input-field inline">
                        <input id="descTodoEdit" type="text" value="${todo.description}" class="validate">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col s12">
                      Due Date: 
                      <div class="input-field inline">
                        <input id="dueDateEdit" type="date" class="datepicker" value="${date}" name="dueDateEdit>
                      </div>
                    </div>
                  </div>
              </form>
          </div>
      </div>
      <div class="modal-footer">
          <button id="editTodo-btn" onclick="editTodo('${todo._id}')" class="btn waves-effect waves-light" type="submit" name="action">Save</button>
      </div>
    `)
  })
  .fail(err =>{
    console.log('masuk error get one todo')
    console.log(err)
  })
}

function editTodo(id){
  console.log('masuk edit todo')
  event.preventDefault()

  let editTodo={
    name: $('#nameTodoEdit').val(),
    description: $('#descTodoEdit').val(),
    dueDate: $('#dueDateEdit').val(),
  }
  
  if(new Date(editTodo.dueDate)< new Date()){
    Swal.fire({
      type: "error",
      title: "Check Your Date!",
      text: 'Due Date minimal tommorow.',
      showConfirmButton: true,
    })
    console.log('lebih kecil')
  }else{
    $.ajax({
      url: `${baseUrl}/todos/${id}`,
      method: 'patch',
      dataType: 'json',
      data:editTodo,
      headers: {
        token: localStorage.token
      }
    })
    .done(todo =>{
      $('#editTodoModal').hide()
      Swal.fire({
        position: 'center',
        type: 'success',
        title: 'Success Update Todo',
        showConfirmButton: false,
        timer: 1200
      })
      getTodos(currentProjectId)
    })
    .fail(err =>{
      console.log('error edit todo')
      console.log(err)
      
    })
  }
}

function showModalEditProject(id){
  currentProjectId= id

  $.ajax({
    url: `${baseUrl}/projects/${id}`,
    method: 'get',
    headers:{
      token: localStorage.token
    }
  })
  .done(project =>{
    fetchUserEdit()
    $('#editProjectModal').append(`
        <div class="modal-content">
          <h5 style="text-align:center; font-weight:bold; text-decoration:underline">Edit Project</h5><br>
          <div class="row" id="formAddTodo">
              <form class="col s12">
                  <div class="row">
                  <div class="col s3">
                    Name: 
                  </div
                  <div class="col s8">
                      <div class="input-field inline">
                        <input id="nameProjectEdit" type="text" value="${project.name}" class="validate">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                  <div class="col s3">
                    Description: 
                  </div
                    <div class="col s8">
                      <div class="col s8 input-field inline">
                        <input id="descProjectEdit" type="text" value="${project.description}" class="validate">
                      </div>
                    </div>
                  </div>
                  <div id="editMember" style="height: 200px; overflow:scroll">
                      <h6 style="margin-left:40px">Project Members:</h6>
                      <div id="userListEdit" class="row" style="margin-left: 50px;"></div>
                  </div>
              </form>
          </div>
      </div>
      <div class="modal-footer">
          <button id="editProject-btn" onclick="editProject()" class="btn waves-effect waves-light" type="submit" name="action">Save</button>
      </div>
    `)
  })
  .fail(err =>{
    console.log('masuk error get one todo')
    console.log(err)
  })

}

function fetchUserEdit(){
  $.ajax({
    url: `${baseUrl}/projects/${currentProjectId}`,
    method: 'get',
    headers:{
      token: localStorage.token
    }
  })
  .done(project =>{
     $.ajax({
       url: `${baseUrl}/users`,
       method: 'get',
       headers:{
         token: localStorage.token
       }
     })
     .done(users =>{
       if(users.length<1){
         $('#userListEdit').append(`
             <h5>No User Can Be Invite</h5>
         `)
       }else{
         users.forEach(user => {
          if(user._id != localStorage.userId){
            if(project.members.indexOf(user._id)== -1){
              $('#userListEdit').append(`
                <div class="col s12">
                  <label>
                      <input type="checkbox" value="${user._id}" name="userEdit"/>
                      <span>${user.name}</span>
                  </label>
                </div>
              `)
            }else{
              $('#userListEdit').append(`
              <div class="col s12">
                <label>
                    <input type="checkbox" value="${user._id}" name="userEdit"checked/>
                    <span>${user.name}</span>
                </label>
              </div>
            `)
            }
          }
         })
       }
     })
  })
  .fail(err =>{
    console.log('masuk error ajax get one project')
    console.log(err)
  })
}

function editProject(){
  event.preventDefault()

  let name=$('#nameProjectEdit').val()
  let desc= $('#descProjectEdit').val()
  let members = []
    $.each($("input[name='userEdit']:checked"),function(){
        members.push($(this).val())
    })
    members.push(localStorage.userId)


  let editProject= {
    name: name,
    description: desc,
    members: members
  }

  console.log(editProject)

  $.ajax({
    url: `${baseUrl}/projects/${currentProjectId}`,
    method: 'patch',
    data: editProject,
    headers:{
      token: localStorage.token
    }
  })
  .done(response =>{
    $('#nameProjectEdit').val(null)
    $('#descProjectEdit').val(null)
    $('#editProjectModal').hide()
    fetchProject()

    Swal.fire({
      position: 'center',
      type: 'success',
      title: 'Your project has been updated',
      showConfirmButton: false,
      timer: 1500
    })
  })
  .fail(err =>{
    console.log('error edit project')
    console.log(err)
        
  })
}