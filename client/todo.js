var baseUrl = "http://35.186.150.38/api"
function updateStatus() {
    var todoId= event.target.id
    var projectId = localStorage.getItem("projectId")
    var todoStatus = null
    if($(`#${todoId}`).prop("checked")){
        $(`#${todoId}`).next().addClass("strike")
        $(`#${todoId}`).next().css({
            "font-size": "15px",
            "color": "grey"
        })
        $(`#${todoId}`).next().children().addClass("grey")
        todoStatus = true
    } else {
        $(`#${todoId}`).next().removeClass("strike")
        $(`#${todoId}`).next().css({
            "font-size": "18px",
            "color": "black"
        })
        $(`#${todoId}`).next().children().removeClass("grey")
        todoStatus = false
    }
    $.ajax({
        method: "PATCH",
        url: `${baseUrl}/projects/${projectId}/update`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            todo: todoId,
            todoStatus: todoStatus
        }
    })
    .done(function(response) {
        console.log(response)
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function addTodo() {
    var todoName = $("#todoName").val()
    var category = $("#category").val()
    var projectId = localStorage.getItem("projectId")
    $.ajax({
        method: "POST",
        url: `${baseUrl}/projects/${projectId}/createtodo`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            name: todoName,
            category: category
        }
    })
    .done(function(response) {
        var todo = response.todos[response.todos.length-1]
        var Category = todo.category[0].toUpperCase() + todo.category.slice(1)
        var tagColor = ""
            if(todo.status === true) {
                tagColor = ""
            }else if(todo.category === "recreational") {
                tagColor = "indigo lighten-2"
            } else if(todo.category === "education") {
                tagColor = "yellow lighten-1"
            } else if(todo.category === "social") {
                tagColor = "pink lighten-2"
            } else if(todo.category === "music") {
                tagColor = "purple lighten-1"
            } else if(todo.category === "busywork") {
                tagColor = "orange lighten-1"
            } else if(todo.category === "cooking") {
                tagColor = "brown lighten-1"
            } else if(todo.category === "relaxational") {
                tagColor = "cyan lighten-1"
            }
        $("#todoList").append(`
        <div class="col s12">
            <label for="${todo._id}">
                <input id="${todo._id}" type="checkbox" onchange="updateStatus()"/>
                <span class="grey-text text-darken-3" style="font-size: 18px; margin-top: 10px; padding-bottom: 35px;">${todo.name}
                <div class="chip ${tagColor}" style="height: 20px; line-height: 20px;">${Category}</div>
                </span>
            </label>
            <i class="material-icons deleteTodo" style="font-size: 18px;" onclick="deleteTodo('${todo._id}', this)">delete</i>
            <div class="divider"></div>
        </div>
        `)
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
    // console.log(category, todoName)   
}

function bored() {
    var category = $("#category").val()
    if(!category) {
        M.toast({html: 'Please select a category', classes: "red"})
    } else {
        $.ajax({
            method: "GET",
            url: `http://www.boredapi.com/api/activity?type=${category}`
        })
        .done(function(response) {
            $("#todoName").val(response.activity)
        })
        .fail(function(err) {
            M.toast({html: err.responseJSON, classes: "red"})
        })
    }
}

function deleteTodo(todoId, selected) {
    var projectId = localStorage.getItem("projectId")
    console.log(todoId,"TODOID")
    $.ajax({
        method: "DELETE",
        url: `${baseUrl}/projects/${projectId}/deleteTodo`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            todo: todoId
        }
    })
    .done(function(response) {
        $(selected).parent().remove()
        console.log(response)
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
    // console.log(todoId, parent)
}

$(document).ready(function() {
    
})