let token = localStorage.getItem("token");
let taskList = [];
$(document).ready(function(){
    initial();
})

function initial(){
    if(token == null){
        tokenNull();
    }else{
        tokenExist();
        fetchTodoList();
    }
}

$("#btn-login").click(function(event){
    event.preventDefault();
    $("#login-body").show();
    $("#logout-body").hide();
    $("#edit-task-body").hide();
    $("#add-task-body").hide();
    $("#delete-task-body").hide();
});

$("#btn-logout").click(function(event){
    event.preventDefault();
    $("#logout-body").show();
    $("#login-body").hide();
    $("#edit-task-body").hide();
    $("#add-task-body").hide();
    $("#delete-task-body").hide();
});


$("#btn-add-task").click(function(event){
    event.preventDefault();
    $("#add-task-body").show();
    $("#logout-body").hide();
    $("#login-body").hide();
    $("#edit-task-body").hide();
    $("#delete-task-body").hide();
});

$("#btn-signup").click(function(event){
    event.preventDefault();
    $("#page-signup").show();
})


$("#confirm-logout").click(function(event){
    event.preventDefault();
    signOut();

    tokenNull();
})


$(".g-signin2").click(function(event){
    event.preventDefault();
    
    tokenExist();
    fetchTodoList();
})

function tokenNull(){
    $("#btn-login").show();
    $("#btn-signup").show();
    $("#btn-logout").hide();
    $("#btn-home").hide();
    $("#todo-list-container").hide();
    $("#news-container").hide();
    $("#page-signup").hide();
}

function tokenExist(){
    $("#btn-logout").show();
    $("#btn-home").show();
    $("#todo-list-container").show();
    $("#news-container").show();
    $("#btn-login").hide();
    $("#btn-signup").hide();
    $("#page-signup").hide();
}




//TODO LIST
function fetchTodoList(){
    console.log("masuk");
    $("#todo-list").empty();
    axios.get("http://localhost:3000/todos/", {
        headers: {
            token
        }
    })
        .then(({data}) => {
            taskList = data;
            data.forEach((task) => {
                if(task.status == "not-completed"){
                    const date = new Date(task.timePlan);
                    $("#todo-list").append(`
                    <label class="checkbox-container">${task.title}
                        <input type="checkbox" id="${task._id}">
                        <span class="checkmark"></span>
                        <br><span class="checkbox-details">${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}</span>
                    </label>  <button id="${task._id}" data-toggle="modal" data-target="#myModal" type="button" class="btn btn-primary btn-sm" onclick=editTaskModal("${task._id}")>Edit</button> | <button id="${task._id}" data-toggle="modal" data-target="#myModal" type="button" class="btn btn-danger btn-sm" onclick=deleteTaskModal("${task._id}")>Delete</button>
                    `);
                    if(task.status == "completed"){
                        $(`#${task._id}`).prop("checked", true);
                    }else{
                        $(`#${task._id}`).prop("checked", false);
                    }
                }
            });

            data.forEach((task) => {
                if(task.status == "completed"){
                    const date = new Date(task.timePlan);
                    $("#todo-list").append(`
                    <label class="checkbox-container">${task.title}
                        <input type="checkbox" id="${task._id}">
                        <span class="checkmark"></span>
                        <br><span class="checkbox-details">${date.getUTCHours()}:${date.getUTCMinutes()} ${date.getUTCDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}</span>
                    </label> <button type="button" class="btn btn-primary btn-sm" onclick=editTaskModal("${task._id}")>Edit</button> | <button type="button" class="btn btn-danger btn-sm" onclick=deleteTaskModal("${task._id}")>Delete</button>
                    `);
                    if(task.status == "completed"){
                        $(`#${task._id}`).prop("checked", true);
                    }else{
                        $(`#${task._id}`).prop("checked", false);
                    }
                }
            });
        })
        .catch((err) => {
            token = localStorage.getItem("token");
            if(token != null){
                setTimeout(function(){ fetchTodoList(); }, 5000);
            }
        })
}

document.querySelector('#todo-list').onclick = function(ev) {
    if(ev.target.value) {
        if(ev.target.checked == true){
            updateStatusTodo(ev.target.id, "completed");
        }else{
            updateStatusTodo(ev.target.id, "not-completed");
        }
    }
}

function updateStatusTodo(id, status){
    axios.put(`http://localhost:3000/todos/${id}`, {status}, {
        headers: {
            token
        }
    })
        .then((data) => {
            fetchTodoList();
        })
        .catch((err) => {
            console.log(err);
        });
}

function editTaskModal(id){
    let task; 
    taskList.forEach((singleTask) => {
        if(singleTask._id == id){
            task = singleTask;
        }
    });
    const newDate = new Date(task.timePlan);
    const date = newDate.getUTCFullYear()+"-"+("0" + (newDate.getUTCMonth() + 1)).slice(-2)+"-"+("0" + newDate.getUTCDate()).slice(-2);

    $("#edit-task-body").show();
    $("#login-body").hide();
    $("#logout-body").hide();
    $("#add-task-body").hide();
    $("#delete-task-body").hide();
    

    $("#edit-task-form").html(`
        <form action="#" id="editForm">
            <input type="text" name="id" style="display:none;" value="${task._id}">
            <div class="form-group">
                <label for="title">Title</label>
                <input name="title" type="text" class="form-control" value="${task.title}">
            </div>
            <div class="form-group">
                <label for="timePlan">Date</label>
                <input name="timePlan" type="date" class="form-control" value="${date}">
            </div>
            <div class="form-group">
                <label for="decription">Description</label>
                <input name="decription" type="text" class="form-control" value="${task.description}">
            </div>
        </form>
    `)
}


$("#btn-edit-confirm").click(function(event){
    event.preventDefault();
    let updatedTask = {};
    let id;
    $("#editForm :input").each(function(){
        if($(this).attr("name") == "id"){
            id = $(this).val();
        }else if($(this).val() == "undefined"){
            updatedTask[$(this).attr("name")] = "";
        }else if($(this).attr("name") == "timePlan"){
            updatedTask["timePlan"] = new Date($(this).val());
        }else{
            updatedTask[$(this).attr("name")] = $(this).val();
        }
    });

    axios.put(`http://localhost:3000/todos/${id}`, updatedTask, {
        headers: {
            token
    }})
        .then((data) => {
            console.log(data);
            fetchTodoList();
        })
        .catch((err) => {
            console.log(err);
            fetchTodoList();
        })

})


$("#btn-add-confirm").click(function(event){
    event.preventDefault();
    let newTask = {}
    $("#addForm :input").each(function(){
        if($(this).val() == "undefined"){
            newTask[$(this).attr("name")] = null;
        }else if($(this).attr("name") == "timePlan"){
            newTask["timePlan"] = new Date($(this).val());
        }else{
            newTask[$(this).attr("name")] = $(this).val();
        }
    });
    console.log(newTask);

    axios.post(`http://localhost:3000/todos`, newTask, {
        headers: {
            token
    }})
        .then((data) => {
            console.log(data);
            fetchTodoList();
        })
        .catch((err) => {
            console.log(err);
            fetchTodoList();
        });


    $("#addForm :input").each(function(){
        $(this).val("");
    })
});

function deleteTaskModal(id){
    $("#delete-task-body").show();
    $("#login-body").hide();
    $("#logout-body").hide();
    $("#add-task-body").hide();
    $("#edit-task-body").hide();

    $("#btn-delete-confirm").attr("onclick", `deleteTask("${id}")`)
}

function deleteTask(id){
    console.log(id);
    axios.delete(`http://localhost:3000/todos/${id}`, {
        headers: {
            token
    }})
        .then((data) => {
            console.log(data);
            fetchTodoList();
        })
        .catch((err) => {
            console.log(err);
            fetchTodoList();
        });
}


$("#btn-signup-confirm").click(function(event){
    event.preventDefault();
    let isValid = true;
    let input = {};
    $("#signupForm :input").each(function(){
        if($(this).val() == "" || $(this).val() == "null"){
            isValid = false;
        }else{
            if($(this).attr("name") != undefined){
                input[$(this).attr("name")] = $(this).val();
            }
        }
    });

    if(isValid == true){
        axios.post("http://localhost:3000/users", input)
            .then((data) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", data.name);
                fetchTodoList();
                tokenExist();
                $("#page-signup").hide();
            })
            .catch((err) => {
                console.log(err);
            })

        console.log(isValid);
        console.log(input);
    }else{
        console.log(isValid);
        console.log(input);
    }
});


$("#btn-login-confirm").click(function(event){
    event.preventDefault();
    let isValid = true;
    let input = {};
    $("#loginForm :input").each(function(){
        if($(this).val() == "" || $(this).val() == "null"){
            isValid = false;
        }else{
            if($(this).attr("name") != undefined){
                input[$(this).attr("name")] = $(this).val();
            }
        }
    });

    console.log(input);

    axios.post("http://localhost:3000/users/login", input)
        .then((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            fetchTodoList();
            tokenExist();
        })
        .catch((err) => {
            console.log(err);
        });
})





//GOOGLE SIGN IN
function onSignIn(googleUser) {

    const {id_token} = googleUser.getAuthResponse();

    axios.post("http://localhost:3000/users/signin/google", {
        idToken: id_token
    })
        .then(({data}) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            fetchTodoList();
            tokenExist();
        })
        .catch((err) => {
            console.log("send data login to server ERROR");
            console.log(err.message);
            tokenNull();
        })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
        .then(function () {
            localStorage.clear();
            tokenNull();
        });
}

fetchNews();

function fetchNews(){
    axios.get(("https://newsapi.org/v2/everything?"+
    "q=programming&"+
    "sortBy=relevancy&"+
    "pageSize=10&"+
    "apiKey=16a651cfc9344eafae296ddf93fe7b6a"))
        .then(({data}) => {
            $("#news").empty();
            data.articles.forEach((news) => {
                $("#news").append(`
                <div style="width: 400px; height: 250px; display: inline-block; margin:30px">
                    <a href="${news.url}" target="_blank" style="">
                        <div>
                            <span style="font-size: 16pt;">${news.title}</span>
                            <img src="${news.urlToImage}" alt="" style="width: 100%;">
                            <hr>
                        </div>
                    </a>
                </div>
                `);
            })
        })
        .catch((err) => {
            console.log(err);
        })
}
