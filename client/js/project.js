
async function getMyProjects(){
    try {

        let myProjects = await $.ajax({
            url : `${baseURL}/projects`,
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })
        
        $('#myProjects').empty()

        console.log('myProjects: ', myProjects);

        if(myProjects.length > 0){
            myProjects.forEach(el => {
                // project collapsible content
                $('#myProjects').append(`
                    <li style="border: none; margin: 5px">
                        <div class="collapsible-header #4caf50 green " style="border : none; justify-content: space-between">
                            <div style="display:flex">
                                <i class="material-icons">work</i><b>${el.name.toUpperCase()}</b>
                            </div>
                            <div>
                                <a id="createTodoProject-${el._id}" href="" class="btn" style="color:black" ><i class="tiny material-icons">add</i><small>Todo</small></a>
                                <a id="deleteProject-${el._id}" class="btn red darken-2" style="color:white"><i class="tiny material-icons">priority_high</i><small> Delete Project </small></a>
                            </div>
                        </div>
                        
                        <div id="projectContent-${el._id}" class="collapsible-body" style="background-color: rgba(255,255,255,0.5); border: none">
                            <div class="row">
                                <div id="projectFixMembers-${el._id}" class="col s4" style="border-right : 1px dotted black; height:100%">
                                    <h6>Members (${el.fix_members.length}) : </h6>
                                </div>
                                <div id="projectPendingMembers-${el._id}" class="col s4" style="border-right : 1px dotted black;border-left : 1px dotted black; height:100%">
                                    <h6>Pending Members (${el.pending_members.length}) : </h6>
                                </div>
                                <div id="projectUnlisted-${el._id}" class="col s4" style="border-left : 1px dotted black; height:100%">
                                    <h6>Unlisted : </h6>
                                    
                                </div>
                            </div>
                            <hr>
                            <div id="projectTodos-${el._id}" style="display:flex; flex-wrap: wrap"></div>
                        </div>
                    </li>
                `)


                // list fix members
                el.fix_members.forEach((fix, i) => {
                    $(`#projectFixMembers-${el._id}`).append(`
                        <p>${i+1}. ${fix.username}</p>
                        
                    `)
                })


                // list pending members
                el.pending_members.forEach((pending, i) => {
                    $(`#projectPendingMembers-${el._id}`).append(`
                        <p>${i+1}. ${pending.username}</p>
                        
                    `)
                    
                })

                // unlisted members
                getUnlistedUser(el)


                // list project todos
                el.todos.forEach(todo => {
                    if(todo){
                        if(todo.status === 'completed' ){
                            todoStatus = `
                                <small style="color : lime"><b> ${todo.status} </b></small>
    
                            `
                        } else {
                            if(new Date(todo.dueDate) <= new Date()) {
                    
                                console.log('get todo (late) => ', todo.name);

                                todoStatus = `
                                <small style="color : yellow"><b> 'completed' </b></small>
                                <br>
                                <small style="color : peru"> (forced 'done' by system) </small>
                                ` 
                            } else {
                                todoStatus = `
                                <small style="color : orange"><b> ${todo.status} </b></small>
                                <br>
                                <br>
                                <a id="prj-done-${todo._id}" href="" class="btn-small" style="float : right">DONE</a>
                                <br>
                                ` 
                            }
                        }
                        $(`#projectTodos-${el._id}`).append(`
                            <div class="row" style="margin : 0">
                                <div class="col s12 m12">
                                    <div class="card blue-grey darken-1">
                                        <div class="card-content white-text">
                                        <span class="card-title">${todo.name}</span>
                                        <p>
                                            <small>author : ${todo.userId.username}</small>
                                            <hr>
                                            ${todo.description}
                                            <br>
                                            ${todoStatus}
                                            <br>
                                            <small>Due Date : ${new Date(todo.dueDate).toDateString()}</small>
                                        </p>
                                        </div>
                                        <div class="card-action">
                                        <a id="prj-update-${todo._id}" href="">UPDATE</a>
                                        <a id="prj-delete-${todo._id}" href="">DELETE</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)        
                        $(`#prj-done-${todo._id}`).click(function(e){
                            e.preventDefault()
                            doneProjectTodo(el._id, todo._id)
                        })
                        $(`#prj-update-${todo._id}`).click(function(e){
                            e.preventDefault()
                            updateProjectTodo(el._id, todo._id, todo.name, todo.description, todo.dueDate)
                        })
                        $(`#prj-delete-${todo._id}`).click(function(e){
                            e.preventDefault()
                            deleteProjectTodo(el._id, todo._id, todo.name)
                        })    
                    }
                })

                //create project todo
                $(`#createTodoProject-${el._id}`).click(async function(e){
                    e.preventDefault()
                    let y = new Date().getFullYear()
                    let m = new Date().getMonth()+1
                    let d = new Date().getDate()+1
                    
                    if(d/10 < 1) d = `0${d}`
                    if(m/10 < 1) m = `0${m}`
                    let complete = `${y}-${m}-${d}`

                    console.log('complete: ', complete);
                    console.log('clicked');
                    let {value:createTodo} = await Swal.fire({
                        title : 'CREATE NEW PROJECT TODO',
                        html : `
                            <label for="TodoName">Todo Name</label>
                            <input id="TodoName" type="text" />
                        
                            <label for="Description"> Description</label>
                            <textarea id="Description" type="text"></textarea>
                        
                            <label for="dueDate">Due Date</label>
                            <input id="dueDate" type="date" min="${complete}" value=""/>
                        `,
                        showCancelButton : true
                    })

                    let name = $('#TodoName').val() 
                    let description = $('#Description').val() 
                    let dueDate = $('#dueDate').val() 

                    if(createTodo && name && description && dueDate){
                        console.log('masuk')
                        console.log(name, description, dueDate)


                        try {
                            let create = await $.ajax({
                                url : `${baseURL}/projects/${el._id}/todo`,
                                method : 'POST',
                                headers : {
                                    access_token : localStorage.getItem('access_token')
                                },
                                data : { name, description, dueDate : new Date(dueDate)}
                            })
                            checkSignIn()
                        } catch (error) {
                            console.log('error: ', error.responseJSON);
                            
                        }

                    }
                })

                //delete project 
                $(`#deleteProject-${el._id}`).click(async function(e){
                    e.preventDefault()
                    let deleteOpt = await Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    })

                    console.log(deleteOpt.value);
                    if(deleteOpt.value){
                        console.log('a');
                        
                        deleteProject(el._id)
                    }

                })


            })
        }

        
    } catch (error) {

        console.log('error: ', error);
        
    }
}

async function doneProjectTodo(id, todoId){
    try {
        console.log('masuk');
        let done = await $.ajax({
            url : `${baseURL}/projects/todo/${todoId}/${id}`,
            method : 'PATCH',
            headers : {
                access_token : localStorage.getItem('access_token')
            },
            data : {
                status : 'completed'
            }
        })
        console.log('done: ', done);
        checkSignIn()

    } catch (error) {
        console.log('error: ', error);
        
    }
}

async function deleteProjectTodo(id, todoId, name){
    try {

        let deleting = await Swal.fire({
            title: `DELETE "${name}" Todo ?`,
            animation: false,
            customClass: {
              popup: 'animated swing'
            },
            showCancelButton : true
          })


        if(deleting.value){
            let deleted = await $.ajax({
                url : `${baseURL}/projects/todo/${todoId}/${id}`,
                method : 'DELETE',
                headers : {
                    access_token : localStorage.getItem('access_token')
                }
            })
            console.log('deleted: ', deleted);
            checkSignIn()
        }

    } catch (error) {
        console.log('error: ', error.responseJSON);
        
    }
}

async function updateProjectTodo(id, todoId, name, description, dueDate){
    try {

        
        let y = new Date().getFullYear()
        let m = new Date().getMonth()+1
        let d = new Date().getDate()+1
        
        if(d/10 < 1) d = `0${d}`
        if(m/10 < 1) m = `0${m}`
        let complete = `${y}-${m}-${d}`

        y = new Date(dueDate).getFullYear()
        m = new Date(dueDate).getMonth()+1
        d = new Date(dueDate).getDate()
        
        if(d/10 < 1) d = `0${d}`
        if(m/10 < 1) m = `0${m}`
        dueDate = `${y}-${m}-${d}`

        let updTodo;

        if(new Date(dueDate) <= new Date()){

            console.log('update (late) => ', name);

            updTodo = await Swal.fire({
                title : 'UPDATE PROJECT TODO',
                html : `
                    <label for="TodoNameUp">Todo Name</label>
                    <input id="TodoNameUp" type="text" value="${name}"/>
                
                    <label for="DescriptionUp"> Description</label>
                    <textarea id="DescriptionUp" type="text">${description}</textarea>
                
                    <label for="dueDateUp">Due Date</label>
                    <input id="dueDateUp" type="date" min="${complete}" value="${dueDate}" disabled/>
                `,
                showCancelButton : true
            })
        } else {
            updTodo = await Swal.fire({
                title : 'UPDATE PROJECT TODO',
                html : `
                    <label for="TodoNameUp">Todo Name</label>
                    <input id="TodoNameUp" type="text" value="${name}"/>
                
                    <label for="DescriptionUp"> Description</label>
                    <textarea id="DescriptionUp" type="text">${description}</textarea>
                
                    <label for="dueDateUp">Due Date</label>
                    <input id="dueDateUp" type="date" min="${complete}" value="${dueDate}"/>
                `,
                showCancelButton : true
            })
        }

        name = $('#TodoNameUp').val() 
        description = $('#DescriptionUp').val() 
        dueDate = $('#dueDateUp').val() 

        if(updTodo.value && name && description && dueDate){

            let update = await $.ajax({
                url : `${baseURL}/projects/todo/${todoId}/${id}`,
                method : 'PATCH',
                headers : {
                    access_token : localStorage.getItem('access_token')
                },
                data : {name, description, dueDate}
            })
            console.log('update: ', update);
            checkSignIn()
        }

        

    } catch (error) {
        console.log('error: ', error);
        
    }
}

async function getUnlistedUser(project){
    try {
        let dataUnlisted = await $.ajax({
            url : `${baseURL}/users`,
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })
        
        console.log('dataUnlisted: ', dataUnlisted);
        let arrayUnlisted = []
        
        for(let i = 0; i < dataUnlisted.length; i++){
            let flag = true
            for(let j = 0; j < project.fix_members.length; j++){
                if(dataUnlisted[i]._id.toString() === project.fix_members[j]._id.toString()){
                    flag = false
                    break;
                }
            }

            for(let j = 0; j < project.pending_members.length; j++){
                if(dataUnlisted[i]._id.toString() === project.pending_members[j]._id.toString()){
                    flag = false
                    break;
                }   
            }

            if(flag){
                arrayUnlisted.push(dataUnlisted[i])
            }
        }

        arrayUnlisted.forEach((el, i) => {
            console.log('el: ', el);

            $(`#projectUnlisted-${project._id}`).append(`
                
                <p style="margin-top:10px; padding:5px; border-bottom:1px dotted grey;">
                    
                    <small><a id="invite-${el._id}-${project._id}" class=" btn-small waves-effect waves-light blue" style="float:right; margin-top:15px">invite</a></small>
                    <h6>${i+1}. ${el.username}</h6>
                </p>
            `)

            $(`#invite-${el._id}-${project._id}`).click(async function(e){
                try {
                    e.preventDefault()
                    console.log('masoook');
                    let invite = await $.ajax({
                        url : `${baseURL}/projects/${project._id}/invite`,
                        method : 'PATCH',
                        headers : {
                            access_token : localStorage.getItem('access_token')
                        },
                        data : {
                            userId : el._id
                        }
                    })
                    
                    console.log('invite: ', invite);
                    M.toast({html: invite.msg, classes : 'rounded orange'})
                    getMyProjects()
                    
                } catch (error) {
                    console.log('error: ', error);
                    
                }
            })

        })

    } catch (error) {
        console.log('error: ', error);
    }
    



}

async function deleteProject(id){
    try {
        let deletePrj = await $.ajax({
            url : `${baseURL}/projects/${id}`,
            method : `DELETE`,
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })

        console.log('deletePrj: ', deletePrj);
        M.toast({html: deletePrj.message , classes : 'rounded'})
        getMyProjects()

    } catch (error) {
        console.log('error: ', error);
    }
}

$('#createProject').click(async function(e){
    
    
    e.preventDefault()
    
    let {value:createProject} = await Swal.fire({
        title : 'CREATE NEW PROJECT',
        html : `
            <label for="ProjectName">Project Name</label>
            <input id="ProjectName" type="text" />
        
        `,
        showCancelButton : true
    })

    let name = $('#ProjectName').val() 
    
    console.log('createProject: ', createProject);
    console.log('name: ', name);

    if(createProject && name ){

        console.log('masuk')
        console.log(name)

        try {
            let create = await $.ajax({
                url : `${baseURL}/projects`,
                method : 'POST',
                headers : {
                    access_token : localStorage.getItem('access_token')
                },
                data : { name }
            })
            console.log('create: ', create);
            console.log('jadi nih');
            checkSignIn()
        } catch (error) {
            console.log('engga deng');
            console.log('error: ', error.responseJSON);
            
        }
        
    }
    
})