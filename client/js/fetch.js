async function getPersonalTodos(){
    try {
        let todos = await $.ajax({
            url : `${baseURL}/todos`,
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })
        
        $('#personalTodoContent').empty()
        console.log('todos: ', todos);

        if(todos.length > 0){
            todos.forEach(el => {
                if(!el.isProject){
                    if(el.userId._id.toString() === localStorage.getItem('userId').toString()){
                        let todoStatus = ''
                        if(el.status === 'completed'){
                            todoStatus = `
                                <small style="color : lime"><b> ${el.status} </b></small>
    
                            `
                        } else {
                            todoStatus = `
                            <small style="color : pink"><b> ${el.status} </b></small>
                            <br>
                            <br>
                            <a id="done-${el._id}" href="" class="btn-small" style="float : right">DONE</a>
                            <br>
                            ` 
                        }
                        $('#personalTodoContent').append(`
                            <div class="row" style="margin : 0">
                            <div class="col s12 m12">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                <span class="card-title">${el.name}</span>
                                <p>
                                    <small>author : ${el.userId.username}</small>
                                    <hr>
                                    
                                    ${el.description}
                                    <br>
                                    ${todoStatus}
                                    <br>
                                    <small>Due Date : ${new Date(el.dueDate).toDateString()}</small>
                                </p>
                                </div>
                                <div class="card-action">
                                <a id="update-${el._id}" href="">UPDATE</a>
                                <a id="delete-${el._id}" href="">DELETE</a>
                                </div>
                            </div>
                            </div>
                            </div>
                        `)        
                        $(`#done-${el._id}`).click(function(e){
                            e.preventDefault()
                            doneTodo(el._id)
                        })
                        $(`#update-${el._id}`).click(function(e){
                            e.preventDefault()
                            updateTodo(el._id, el.name, el.description, el.dueDate)
                        })
                        $(`#delete-${el._id}`).click(function(e){
                            e.preventDefault()
                            deleteTodo(el._id,el.name)
                        })    
                    } else {
                        let todoStatus = ''
                        if(el.status === 'completed'){
                            todoStatus = `
                                <small style="color : lime"><b> ${el.status} </b></small>
    
                            `
                        } else {
                            todoStatus = `
                                <small style="color : pink"><b> ${el.status} </b></small>
                            ` 
                        }
                        $('#personalTodoContent').append(`
                            <div class="row" style="margin : 0">
                            <div class="col s12 m12">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                <span class="card-title">${el.name}</span>
                                <p>
                                    <small>author : ${el.userId.username}</small>
                                    <hr>
                                    
                                    ${el.description}
                                    <br>
                                    ${todoStatus}
                                    <br>
                                    <small>Due Date : ${new Date(el.dueDate).toDateString()}</small>
                                </p>
                                </div>
                                <div class="card-action">
                                
                                </div>
                            </div>
                            </div>
                            </div>
                        `)            
                    }
                }


            });
        }

    } catch (error) {
        console.log('error: ', error.responseJSON);
    }
    
}

async function doneTodo(id){
    try {
        console.log('masuk');
        let done = await $.ajax({
            url : `${baseURL}/todos/${id}`,
            method : 'PUT',
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

async function deleteTodo(id, name){
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
                url : `${baseURL}/todos/${id}`,
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

async function updateTodo(id, name, description, dueDate){
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

        let updTodo = await Swal.fire({
            title : 'UPDATE TODO',
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

        name = $('#TodoNameUp').val() 
        description = $('#DescriptionUp').val() 
        dueDate = $('#dueDateUp').val() 

        if(updTodo.value && name && description && dueDate){

            let update = await $.ajax({
                url : `${baseURL}/todos/${id}`,
                method : 'PUT',
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
