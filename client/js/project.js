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