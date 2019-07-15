function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.post('http://localhost:3000/api/users/signin/google', {idToken: id_token})
    .done( response => {
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("username", response.username)
        var token = localStorage.getItem("token")
        $.ajaxSetup({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('token', token);
            }
        });
        
        if(token) {
            $("#login-button").hide()
            $("#register-button").hide()
            $("#logout-button").show()
        } else {
            $("#login-button").show()
            $("#register-button").show()
            $("#logout-button").hide()
            res.clear()
        }
    })
    .fail(function(err) {
        console.log(err.responseJSON)
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    })
    localStorage.clear()
    var token = localStorage.getItem("token")
    if(token) {
        $("#login-button").hide()
        $("#register-button").hide()
        $("#logout-button").show()
        ('token', token)
    } else {
        $("#login-button").show()
        $("#register-button").show()
        $("#logout-button").hide()
        res.clear()
    }
}

function signIn() {
    let email = $("#emailLogin").val()
    let password = $("#passwordLogin").val()
    $.post('http://localhost:3000/api/users/signin', { email: email, password: password })
    .done( response =>  {
        localStorage.setItem("token", response.access_token)
        localStorage.setItem("username", response.username)
        if(token) {
            $("#login-button").hide()
            $("#register-button").hide()
            $("#logout-button").show()
            res.set('token', token)
        } else {
            $("#login-button").show()
            $("#register-button").show()
            $("#logout-button").hide()
            res.clear()
        }
    })
    .fail(function(err) {
        console.log(err)
    })
}

function signUp() {
    let email = $("#emailRegister").val()
    let password = $("#passwordRegister").val()
    let name = $("#nameRegister").val()
    $.post('http://localhost:3000/api/users/signup', { email: email, password: password, name: name })
    .done( response =>  {
        
    })
    .fail(function(err) {
        console.log(err)
    })
}

function addTodo() {
    let name = $("#name").val(), description = $("#description").val(), due_date =$("#due-date").val()
    $.post('http://localhost:3000/api/todos', { name, description, due_date })
}

function getData() {
    console.log("MASUK DATA")
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/api/todos"
    })
    .done(function(response){
        response.forEach( a => {
            let newDate
            if(a.due_date == undefined){
                newDate = ''
            } else if(a.description == undefined){
                a.description = ''
            } else if(a.due_date) {
                var date = new Date(a.due_date);
                newDate = date.toDateString('dd-MM-yy');
            }

            let checkboxStatus
            if(a.status == true) {
                checkboxStatus = `<input type="checkbox" checked="checked" onclick="updateStatus('${a._id}')"/>`
            } else if(a.status == false) {
                checkboxStatus = `<input type="checkbox" onclick="updateStatus('${a._id}')"/>`
            }
            
            $("#to-do-list").prepend(`
                <li class="indigo-text">
                    <div class="row">
                        <div class="col s1">
                            <label>
                            ${checkboxStatus}
                            <span> </span>
                            </label>
                        </div>
                        <div class="col s7">
                            <strong class="indigo-text text-darken-1" style="font-size: 20px">
                            ${a.name}
                            </strong><br>
                            ${a.description}<br>
                            <i class="indigo-text text-lighten-3">${newDate}</i>
                        </div>

                        <div class="col s1" style="margin-top: 5%">
                        <a class="btn waves-effect grey lighten-1 btn-floating btn-small" onclick="replaceData('${a._id}')"><i class="material-icons">build</i></a>
                        </div>

                        <div class="col s1 offset-s1" style="margin-top: 5%">
                        <a class="btn waves-effect grey lighten-1 btn-floating btn-small" onclick="deleteOne('${a._id}')"><i class="material-icons">delete</i></a>
                        </div>
                    </div>
                    
                    
                    <div class="divider" style="margin: 5% 0"></div>
                </li>`)
        });
    })
    .fail(function(err) {
        console.log(err.responseJSON)
    })
}

function deleteOne(id) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/api/todos/${id}`
    })
}

function updateStatus(id) {
    let status
    console.log(`http://localhost:3000/api/todos/${id}`)
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/api/todos/${id}`
    })
        .done( response => {
            if(response.data.status === true) {
                status = false
            } else {
                status = true
            }

            $.ajax({
                method: "PATCH",
                url: `http://localhost:3000/api/todos/${id}`,
                data: {status: status}
            })
        })
    
}

function replaceData(id) {
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/api/todos/${id}`
    })
        .done( ({ data }) => {
            console.log(data)
            $("#update-form").replaceWith(`
            <div class="col s3" id="update-form">
                <div class="card">
                    <h5 class="flow-text indigo-text" style="padding: 7% 5% 2% 5%">Update</h5>
                    <div class="divider"></div>
                    
                    <div style="margin: 5%">
                        <label for="nameUpdate">What to do?</label>
                    </div>
                    <div class="input-field" style="margin: 5%">
                        <input id="nameUpdate" type="text" class="validate" placeholder="${data.name}">
                    </div>

                    <div style="margin: 5%">
                        <label for="descriptionUpdate">Description</label>
                    </div>
                    <div class="input-field" style="margin: 5%">
                        <textarea id="descriptionUpdate" type="text" class="materialize-textarea" placeholder="${data.description}"></textarea>
                    </div>

                    <div style="margin: 5%">
                        <label for="due_dateUpdate">Due Date</label>
                    </div>
                    <div class="input-field" style="margin: 5%;">
                        <input type="date" id="due_dateUpdate" class="datepicker">
                    </div>

                    <div class="input-field" style="margin: 5%; padding-bottom: 7%">
                        <button class="btn waves-effect indigo" type="submit" name="action" onclick="replaceTodo('${id}')">Create
                            <i class="material-icons right">send</i>
                        </button>
                    </div>
                </div>
            </div>
            `)
        })
    
}

function replaceTodo(id) {
    let name = $("#nameUpdate").val(), description = $("#descriptionUpdate").val(), due_date =$("#due_dateUpdate").val()
    let todo = { name: name, description: description, due_date:due_date }
    console.log(id)
    console.log(JSON.stringify(todo))
    $.ajax({
        method: "PUT",
        url: `http://localhost:3000/api/todos/${id}`,
        data: todo
    })
}

function hideUpdate() {
    $("#update-form").replaceWith(`<div class="col s3" id="update-form"></div>`)
}

