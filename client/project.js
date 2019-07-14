
$(document).ready(function() {
    localStorage.removeItem("projectId")
    if(localStorage.getItem("token") && !localStorage.getItem("googleLogin")){
        loadMyProjects()
    }
})

var baseUrl = "http://localhost:3000/api"


function loadMyProjects() {
    $.ajax({
        method: "GET",
        url: `${baseUrl}/users/myprojects`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
    .done(function(projects) {
        projects.forEach(project =>{
            $("#projectList").append(`
            <li><a href="#" id="${project._id}" onclick="viewProject()"><i class="material-icons">assignment</i>${project.name}</a></li>

            `)
        })
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}


function addProject() {
    event.preventDefault()
    var projectName = $("#projectName").val()
    $.ajax({
        method: "POST",
        url: `${baseUrl}/projects/add`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            name: projectName
        }
    })
    .done(function(project) {
        $("#projectList").append(`
        <li><a href="#" id="${project._id}" onclick="viewProject()"><i class="material-icons">assignment</i>${project.name}</a></li>

        `)
        $("#projectName").val("")
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
  
}

function viewProject() {
    $("#instructions").hide()
    $("#loading").show()
    var projectId = event.target.id
    localStorage.setItem("projectId", projectId)
    $.ajax({
        method: "GET",
        url: `${baseUrl}/projects/${projectId}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
    .done(function(project) {
        $("#loading").hide()
        $("#projectContent").empty()
        var members = ""
        var todoList = ""
        project.members.forEach(member =>{
            members += `<div class="chip">${member.username}</div>`
        })
        project.todos.forEach(todo =>{
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
            var checked = ""
            var strike = ""
            var style = ""
            if(todo.status === true) {
                checked = "checked"
                strike = "strike"
                style = "font-size: 15px; color: grey;"
                // $(`#${todoId}`).next().addClass("strike")
                // $(`#${todoId}`).next().css({
                //     "font-size": "15px",
                //     "color": "grey"
                // })
            } else {
                style = "font-size: 18px; color: black;"
            }

            todoList += `
            
            <div class="col s12">
                <label for="${todo._id}">
                    <input id="${todo._id}" type="checkbox" ${checked} onchange="updateStatus()"/>
                    <span class="grey-text text-darken-3 ${strike}" style="${style} margin-top: 10px; padding-bottom: 35px;">${todo.name}
                    <div class="chip ${tagColor}" style="height: 20px; line-height: 20px;">${Category}</div>
                    </span>
                    </label>
                    <i class="material-icons deleteTodo" style="font-size: 18px;" onclick="deleteTodo('${todo._id}', this)">delete</i>
                <div class="divider"></div>
            </div>
            `
        })


        $("#projectContent").append(`
        <div class="card-content">
        <a href="#" class="right waves-effect waves-red btn-flat" style="color: red;" onclick="deleteProject()">Delete Project</a>
                <h3>${project.name}</h3>
                <div id="members">
                    <div class="grey-text text-darken-2" style="margin-left: 4px;"><a href="#" onclick="showInviteForm()">+ Invite More People</a></div>
                    <div class="row" id="inviteForm" style="display:none">
                        <form onsubmit="inviteMember()">
                            <div class="col s4">
                                <select id="userList">
                                        <option value="" disabled selected>Invite Members</option>
                                </select>
                            </div>
                            <div class="col s1">
                                <button class="btn btn-small waves-blue waves-effect blue tiny" type="submit" style="margin-top: 10px;">Invite</button>
                            </div>
                        </form>

                    </div>
                    <div id="projectMembers">
                        ${members}
                    </div>
                </div>

                <div id="todo">
                    <div class="row" id="addTodoForm">
                        <form onsubmit="addTodo()">
                            <div class="col s5">
                                <div class="input-field" >
                                        <i class="material-icons prefix grey-text text-darken-3">edit</i>
                                    <input type="text" id="todoName" placeholder="Add a task">
                                </div>
                            </div>
    
                            <div class="col s3" style="margin-top: 1.3%;">
                                <select id="category">
                                        <option value="" disabled selected>Category</option>
                                        <option value="education">Education</option>
                                        <option value="recreational">Recreational</option>
                                        <option value="social">Social</option>
                                        <option value="busywork">Busywork</option>
                                        <option value="relaxation">Relaxation</option>
                                        <option value="cooking">Cooking</option>
                                        <option value="music">Music</option>
                                </select>
                            </div>
    
                            <div class="col s1" style="margin-top: 2%;">
                                <a class="btn-floating btn-small waves-effect waves-light blue tooltipped" data-position="top" data-tooltip="Find me something to do!  (Generates a random task based on the selected category)" onclick="bored()" style="margin-left: 20%;">?</a>
                            </div>
    
                            <div class="col s2" style="margin-top: 2%;">
                                <button type="submit" class="btn btn-small waves-effect waves-light blue">Submit</button>
                            </div>
                        </form>
                    </div>



                    <div class="row">
                        <h4>Tasks</h4>
                        <div id="todoList">

                            ${todoList}
                            
                            
                        </div>
                    </div>
                </div>

            </div>
        `)
        $('select').formSelect();
        $('.tooltipped').tooltip()
        loadMembers()
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function loadMembers() {
    $.ajax({
        method: "GET",
        url: `${baseUrl}/users/all`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
    .done(function(users) {
        console.log(users)
        users.forEach(user =>{
            $("#userList").append(`
            <option value="${user._id}">${user.username}</option>
            `)
        })
        $('select').formSelect();

    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function showInviteForm() {
    var display = $("#inviteForm").css("display")
    if(display === "none") {
        $("#inviteForm").show()
    } else {
        $("#inviteForm").hide()
    }
}

function inviteMember() {
    event.preventDefault()
    var selectedUser = $("#userList").val()
    var projectId = localStorage.getItem("projectId")
    $.ajax({
        method: "PATCH",
        url: `${baseUrl}/projects/${projectId}/invite`,
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            member: selectedUser
        }
    })
    .done(function(response) {
        var newMember = response.members[response.members.length-1].username
        $("#projectMembers").append(`
        <div class="chip">${newMember}</div>
        `)
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}

function deleteProject() {
    var projectId = localStorage.getItem("projectId")
    $.ajax({
        method: "DELETE",
        url: `${baseUrl}/projects/${projectId}/delete`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
    .done(function(response) {
        $("#projectContent").empty()
        $("#projectList").empty()
        loadMyProjects()
    })
    .fail(function(err) {
        M.toast({html: err.responseJSON, classes: "red"})
    })
}
