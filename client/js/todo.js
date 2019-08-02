function createTodo() {
    let todoName = $('#taskName').val()
    let description = $('#description').val()
    let dueDate = $('#dueDate').val()
    $.ajax({
        method: 'POST',
        url: `${baseUrl}/todos/createTodo`,
        headers: {
            token: localStorage.getItem('token')
        },
        data: {
            name: todoName,
            description,
            dueDate
        }
    })
        .done((dataCreated) => {
            // console.log(dataCreated)
            Swal.fire({
                type: 'success',
                title: 'Successfully added a new task!'
            })
        })
        .fail((err)=> {
            // console.log(err.responseJSON)
            Swal.fire({
                type: 'error',
                title: `date ${err.responseJSON.message}`
            })
        })
}

function listAll() {
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/todos/listTodo`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((dataCreated) => {
            $('#todoList').empty()
            // console.log(dataCreated)
            // id="todoName-${dataCreated[i]._id}"
            // id="${dataCreated[i]._id}"

            for(let i = 0; i < dataCreated.length;i++) {
                let statusData
                let favouriteData
                if(dataCreated[i].status) {
                    statusData = 'completed'
                } else  {
                    statusData = 'unfinished'
                }

                if(dataCreated[i].is_starred) {
                    favouriteData = 'yes'
                } else {
                    favouriteData = 'no'
                }
                // console.log(typeof dataCreated[i].dueDate)
                $('#todoList').append(`
                <div class="row " id="${dataCreated[i]._id}-card-task">
                <div class="col s12 ">
                  <div class="card lime lighten-4">
                    <div class="card-content black-text ">
                      <span class="card-title" id="todoName-${dataCreated[i]._id}">${dataCreated[i].name}</span>
                      <p class="descriptionNama" id="todoDescription-${dataCreated[i]._id}">${dataCreated[i].description}</p>
                      <br>
                      <p id="todoDueDate-${dataCreated[i]._id}">Due Date: ${dataCreated[i].dueDate.substring(0,10)}</p>
                      <p id="todoStatus-${dataCreated[i]._id}">Status: ${statusData}</p> 
                      <p id="todoFavourite-${dataCreated[i]._id}"> Bookmark: ${favouriteData}</p>
                    </div>
                    <div class="card-action">
                      <a href="#"  id="${dataCreated[i]._id}" onclick=checkDone() >Complete</a>
                      <a href="#" onclick="deleteTask('${dataCreated[i]._id}')">Delete</a>
                      <a href="#" onclick="favourite('${dataCreated[i]._id}')">
                        <label for="${dataCreated[i]._id}-favourite" class="custom-checkbox">
                            <input type="checkbox"id="${dataCreated[i]._id}-favourite"/>
                                <i class="material-icons glyphicon glyphicon-star-empty">favorite</i>
                                <i class="material-icons glyphicon glyphicon-star">favorite_border</i>
                        </label>
                        </a>
                    </div>
                  </div>
                </div>
              </div>
                `)
            }
        })
        .fail((err) => {
            console.log(err);
        })
}

function checkDone() {
    let idHalo = $("a").prevObject[0].activeElement.id
    // console.log($("a").prevObject[0].activeElement.id)
    $.ajax({
        method: 'PATCH',
        url: `${baseUrl}/todos/completeTodo/${idHalo}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((updated) => {
            let status
            if(updated.status) {
                status = 'completed'
            } else {
                status = 'unfinished'
            }
            $(`#todoStatus-${idHalo}`).empty()
            $(`#todoStatus-${idHalo}`).append(`
            Status: ${status}
            `)
            console.log(updated)
            // if(localStorage && localStorage.getItem('activeArea')==1){
            //     $('a.areamenu').addClass("activearea");
            //  } 
            //  $('a.areamenu').click(function(){
            //     $('a.areamenu').removeClass("activearea");
            //     $(this).addClass("activearea");
            //     localStorage.setItem('activeArea',1);// set value in localstorage
            //  });
            // if(localStorage.getItem('checkedItem')) {
            //     $(`#todoName-${idHalo}`).addClass('checked')
            // }
            //     $(`#todoName-${idHalo}`).addClass('checked')
            //     $(`#todoName-${idHalo}`).removeClass('checked')
            //     localStorage.setItem('checkedItem',1)
                // $(`#todoName-${id}`).removeClass('checked');
                // $(`#todoName-${id}`).addClass("checked");
                // localStorage.setItem('checked',1)
            //    $(`#todoName-${idHalo}`).toggleClass('checked')
            //    $(`#todoDescription-${idHalo}`).toggleClass('checked')
            //    $(`#todoDueDate-${idHalo}`).toggleClass('checked')
        })
        .fail((err) => {
            console.log(err);
        })
}

function favourite(id) {
    $.ajax({
        method: 'PATCH',
        url: `${baseUrl}/todos/favouriteTodo/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((updated) => {
            let status
            if(updated.is_starred) {
                status = 'yes'
            } else {
                status = 'no'
            }
            $(`#todoFavourite-${id}`).empty()
            $(`#todoFavourite-${id}`).append(`
            Bookmark: ${status}
            `)

        })
        .fail((err) => {
            console.log(err);
        })
}

function deleteTask(id) {
    // event.preventDefault()
    $.ajax({
        method: 'DELETE',
        url: `${baseUrl}/todos/deleteToDo/${id}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done((datas) => {
            $(`#${id}-card-task`).remove()
            Swal.fire({
                type: 'success',
                title: 'Successfully deleted a task!'
            })
            // event.preventDefault()
        })
        .fail((err) => {
           console.log(err);
        })
}

function filterData() {
    const value = $('#inputSearch').val()
    // console.log(value)
    $.ajax({
        method: 'GET',
        url: `${baseUrl}/todos/filter?search=${value}`,
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done((dataCreated) => {
        $('#todoList').empty()
        // console.log(dataCreated)
        // id="todoName-${dataCreated[i]._id}"
        // id="${dataCreated[i]._id}"

        for(let i = 0; i < dataCreated.length;i++) {
            let statusData
            let favouriteData
            if(dataCreated[i].status) {
                statusData = 'completed'
            } else  {
                statusData = 'unfinished'
            }

            if(dataCreated[i].is_starred) {
                favouriteData = 'yes'
            } else {
                favouriteData = 'no'
            }
            // console.log(typeof dataCreated[i].dueDate)
            $('#todoList').append(`
            <div class="row " id="${dataCreated[i]._id}-card-task">
            <div class="col s12 ">
              <div class="card lime lighten-4">
                <div class="card-content black-text ">
                  <span class="card-title" id="todoName-${dataCreated[i]._id}">${dataCreated[i].name}</span>
                  <p class="descriptionNama" id="todoDescription-${dataCreated[i]._id}">${dataCreated[i].description}</p>
                  <br>
                  <p id="todoDueDate-${dataCreated[i]._id}">Due Date: ${dataCreated[i].dueDate.substring(0,10)}</p>
                  <p id="todoStatus-${dataCreated[i]._id}">Status: ${statusData}</p> 
                  <p id="todoFavourite-${dataCreated[i]._id}"> Bookmark: ${favouriteData}</p>
                </div>
                <div class="card-action">
                  <a href="#"  id="${dataCreated[i]._id}" onclick=checkDone() >Complete</a>
                  <a href="#" onclick="deleteTask('${dataCreated[i]._id}')">Delete</a>
                  <a href="#" onclick="favourite('${dataCreated[i]._id}')">
                    <label for="${dataCreated[i]._id}-favourite" class="custom-checkbox">
                        <input type="checkbox"id="${dataCreated[i]._id}-favourite"/>
                            <i class="material-icons glyphicon glyphicon-star-empty">favorite</i>
                            <i class="material-icons glyphicon glyphicon-star">favorite_border</i>
                    </label>
                    </a>
                </div>
              </div>
            </div>
          </div>
            `)
        }
    })
    .fail((err) => {
        Swal.fire({
            type: 'error',
            title: err.responseJSON.message
        })
    })
}