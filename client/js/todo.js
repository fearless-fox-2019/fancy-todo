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