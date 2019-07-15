$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('select').formSelect();
    $('.datepicker').datepicker();
    toggleLogin()
    getTodo()
    filter()
    getCategory()
    $(`.refresh`).click(function (event) {
        event.preventDefault()
        getTodo()
    });
     $('.slider').slider();
     getInterest()

});
function getInterest(){
    var band = "red hot chili peppers"
    var movie ="pulp fiction"
    $.ajax({
        method: "GET",
        url: `${baseUrl}/interest/?favorite=${band}&movie=${movie}`
    })
    .done(function (response) {
        console.log(response)
    })
    
}
var baseUrl = "http://localhost:3000/api"
function filter() {
    $(".filter").on('input keypress', function () {
        var value = $(this).val().toLowerCase();
        // console.log(value)
        $(".todos").filter(function () {
            console.log(value)
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}
function filterByCategory(event) {
    event.preventDefault()
    var select = $('#choose').val()
    console.log(select)
    $.ajax({
        method: "GET",
        url: `${baseUrl}/todos/category/filter?category=${select}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            $(".todo").empty()
            response.forEach(e => {
                console.log(response)
                var created = getDate(e.createdAt)
                var due = getDate(e.dueDate)
                if (e.status === true) {
                    $(".todo").append(`<div class="row todos">
                    <div class="card-content">
                    <div class="col s2">
                        <div style="font-size: 20px;"><i class="material-icons cyan-text">check</i>${e.name}
                        </div>
                    </div>

                    <div class="col s2" style="padding-left: 7%;">
                        <div id="departure-time" style="font-size: 18px;">${created.tanggal}</div>
                        <div class="pink-text">${created.year}</div>
                    </div>

                    <div class="col s1">
                        <i class="material-icons">send</i>
                    </div>

                    <div class="col s1">
                        <div id="departure-time" style="font-size: 18px;">${due.tanggal}</div>
                        <div class="pink-text">${due.year}</div>
                    </div>

                    <div class="col s2">
                        <div style="font-size: 20px">${e.category}</div>
                    </div>

                    <div class="col s2">
                    <div style="font-size: 20px"> ${e.description}</div>
                    <div class="pink-text">description</div>
                    </div>

                    <div class="col s2">
                    <a class="waves-effect waves-light btn-small" id ="update${e._id}"><i class="material-icons right">update</i>update</a>
                    <a class="waves-effect waves-light btn-small red" id = "delete${e._id}"><i class="material-icons right">delete</i>delete</a>
                    </div>
             
                   
                </div>

            </div>`)
                } else {
                    $(".todo").append(`  <div class="row todos">
         
                    <div class="card-content">
                        <div class="col s2">
                            <div style="font-size: 20px;"><i class="material-icons cyan-text">close</i>${e.name}
                            </div>
                        </div>
    
                        <div class="col s2" style="padding-left: 7%;">
                            <div id="departure-time" style="font-size: 18px;">${created.tanggal}</div>
                            <div class="pink-text">${created.year}</div>
                        </div>
    
                        <div class="col s1">
                            <i class="material-icons">send</i>
                        </div>
    
                        <div class="col s1">
                            <div id="departure-time" style="font-size: 18px;">${due.tanggal}</div>
                            <div class="pink-text">${due.year}</div>
                        </div>

                        <div class="col s2">
                            <div style="font-size: 20px">${e.category}</div>
                        </div>

                        <div class="col s2">
                        <div style="font-size: 20px"> ${e.description}</div>
                        <div class="pink-text">description</div>
                        </div>

                        <div class="col s2">
                        <a class="waves-effect waves-light btn-small" id ="update${e._id}"><i class="material-icons right">update</i>update</a>
                        <a class="waves-effect waves-light btn-small red" id = "delete${e._id}"><i class="material-icons right">delete</i>delete</a>
                        </div>
                 
                       
                    </div>
    
                </div>`)
                }
                $(`#delete${e._id}`).click(function (event) {
                    event.preventDefault()
                    getDelete(e._id)
                });
                $(`#update${e._id}`).click(function (event) {
                    event.preventDefault()
                    getUpdate(e._id)
                });

            });
            console.log(response, "disini")
        })
        .fail(function (err) {
            // $("#loading").hide()
            // M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })
}
function getCategory() {
    // event.preventDefault()
    console.log('tes')
    $("#choose").empty()
    $.ajax({
        method: "GET",
        url: `${baseUrl}/todos/category`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            // $("#loading").hide()
            $("#choose").empty()
            console.log('oiiiiiiiiiiii')
            response.forEach(a => {
                console.log(a)
                $("#choose").append(`<option id="${a}">${a}</option>`)
            });
            $('select').formSelect();

            // console.log(response)
        })
        .fail(function (err) {
            // $("#loading").hide()
            M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })

}
function updateTodo(event) {
    console.log('woy')
    event.preventDefault()
    // $("#loading").show()
    var date = $("#dueDates").val()
    var temp = new Date(date)
    var year = temp.getFullYear()
    var monthInt = temp.getMonth() + 1
    var dateInt = temp.getDate()
    var month = null
    var date = null
    if (monthInt < 10) {
        month = `0${monthInt}`
    } else {
        month = monthInt
    }
    if (dateInt < 10) {
        date = `0${dateInt}`
    } else {
        date = dateInt
    }
    var name = $(`#names`).val()
    var id = $(`#id_todos`).val()
    console.log(id)
    var description = $("#descriptions").val()
    var category = $("#categorys").val()
    if ($('#check_id').is(":checked")) {
        // it is checked
        var status = true
    } else {
        var status = false
    }

    console.log(status, "disini")
    var updateData = {
        name: name,
        description: description,
        category: category,
        status: status,
        dueDate: new Date(`${year}-${month}-${date}`)
    }

    console.log(updateData)



    $.ajax({
        method: "PUT",
        url: `${baseUrl}/todos/${id}`,
        data: updateData,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            // $("#loading").hide()
            getTodo()
            getCategory()
            M.toast({ html: "berhasil mengedit data todo", classes: "green" })
            console.log(response)
        })
        .fail(function (err) {
            // $("#loading").hide()
            // M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })
}
function addTodo(event) {
    event.preventDefault()
    $("#loading").show()
    var date = $("#dueDate").val()
    var temp = new Date(date)
    var year = temp.getFullYear()
    var monthInt = temp.getMonth() + 1
    var dateInt = temp.getDate()
    var month = null
    var date = null
    if (monthInt < 10) {
        month = `0${monthInt}`
    } else {
        month = monthInt
    }
    if (dateInt < 10) {
        date = `0${dateInt}`
    } else {
        date = dateInt
    }
    var name = $("#name").val()
    var description = $("#description").val()
    var category = $("#category").val()
    var todoData = {
        name: name,
        description: description,
        category: category,
        dueDate: new Date(`${year}-${month}-${date}`)
    }

    console.log(todoData)



    $.ajax({
        method: "POST",
        url: `${baseUrl}/todos`,
        data: todoData,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            $("#loading").hide()
            getTodo()
            getCategory()
            M.toast({ html: "berhasil memasukan data todo", classes: "green" })
            console.log(response)
        })
        .fail(function (err) {
            $("#loading").hide()
            M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })
}
function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: "POST",
        url: `${baseUrl}/users/signin/google`,
        data: {
            token: id_token
        }
    })
        .done(function (response) {
            $(".modal").modal("close")
            localStorage.setItem("token", response.access_token)
            localStorage.setItem("username", response.username)
            toggleLogin()
        })
        .fail(function (err) {
            // // $("#loading").hide()
            // M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })
}

function login() {
    var username = $("#usernameLogin").val()
    var password = $("#passwordLogin").val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/api/users/signin",
        data: {
            username: username,
            password: password
        }
    })
        .done(function (response) {
            $(".modal").modal("close")
            $("#usernameLogin").val("")
            $("#passwordLogin").val("")
            localStorage.setItem("token", response.access_token)
            localStorage.setItem("username", response.username)
            toggleLogin()
        })
        .fail(function (err) {
            console.log(err.responseJSON)
        })
}

function register() {
    var username = $("#usernameRegister").val()
    var password = $("#passwordRegister").val()
    var email = $("#emailRegister").val()
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/api/users/signup",
        data: {
            username: username,
            email: email,
            password: password
        }
    })
        .done(function (response) {
            $(".modal").modal("close")
            $("#usernameRegister").val("")
            $("#emailRegister").val("")
            $("#passwordRegister").val("")
            $("#emailRegister").val()
            localStorage.setItem("token", response.access_token)
            localStorage.setItem("username", response.username)
            toggleLogin()
        })
        .fail(function (err) {
            console.log(err.responseJSON)
        })
}

function toggleLogin() {
    var token = localStorage.getItem("token")
    if (token) {
        $("#register").hide()
        $("#login").hide()
        $("#logout").text(`${localStorage.getItem("username")} | Logout`)
        $("#logout").show()
        $('#categories').show()
        $('#add-todo').show()
        $('#sliders').hide()
        getTodo()
        getCategory()
    } else {
        $("#register").show()
        $("#login").show()
        $("#logout").text(`Logout`)
        $("#logout").hide()
        $("#flightDetails").empty()
        $('#categories').hide()
        $('#add-todo').hide()
        $('#sliders').show()
        getTodo()
    }
}

function logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    localStorage.removeItem("token")
    toggleLogin()
}
function getDate(temp) {
    temp = new Date(temp)
    var year = temp.getFullYear()
    var monthInt = temp.getMonth() + 1
    var dateInt = temp.getDate()
    var month = null
    var date = null
    if (monthInt < 10) {
        month = `0${monthInt}`
    } else {
        month = monthInt
    }
    if (dateInt < 10) {
        date = `0${dateInt}`
    } else {
        date = dateInt
    }
    let tanggal = `${month}-${date}`
    return {
        tanggal: tanggal,
        year: year
    }
}
function getUpdate(id) {
    $(".todo").empty()
    $.ajax({
        method: "GET",
        url: `http://localhost:3000/api/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            let date = getDate(response.dueDate)
            console.log(date)
            if (response.status == true) {
                $(".todo").append(`
            <div class="row">
            <form class="col s12" onsubmit="updateTodo(event)">
                <div class="row">
                    <div class="input-field col s12">
                        <input placeholder="Name of your todo" value = "${response.name}" id="names" type="text" class="validate">
                        <label class="active" for="name">Name</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input placeholder="Description"   value = "${response.description}" id="descriptions" type="text" class="validate">
                        <label class="active" for="description">Description</label>
                    </div>
                </div>
                <div class="row">
                <div class="input-field col s12">
                <p>
                <label>
                  <input type="checkbox" class="filled-in" id = "check_id" checked="checked" />
                  <span>STATUS TODO</span>
                </label>
              </p>
              </div>
              </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="dueDates" type="date"  value = "${date.year}-${date.tanggal}" class="validate">
                        <label class="active" for="dueDate">dueDate</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input placeholder="your category" id="categorys"  value = "${response.category}" type="text" class="validate">
                        <label class="active" for="category">category</label>
                    </div>
                </div>
                <button class="btn waves-effect waves-light pink" type="submit" name="action">Update
                <i class="material-icons right">update</i>
                 </button>
                 <input type="hidden" id="id_todos" name ="id_todos" value="${response._id}">
                </form>  
                </div>
            `)

            } else {
                $(".todo").append(`
                <div class="row">
                <form class="col s12" onsubmit="updateTodo(event)">
                    <div class="row">
                        <div class="input-field col s12">
                            <input placeholder="Name of your todo" value = "${response.name}" id="names" type="text" class="validate">
                            <label class="active" for="name">Name</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input placeholder="Description"   value = "${response.description}" id="descriptions" type="text" class="validate">
                            <label class="active" for="description">Description</label>
                        </div>
                    </div>
                    <div class="row">
                    <div class="input-field col s12">
                    <p>
                    <label>
                      <input type="checkbox" class="filled-in" id = "check_id" />
                      <span>STATUS TODO</span>
                    </label>
                  </p>
                  </div>
                  </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="dueDates" type="date"  value = "${date.year}-${date.tanggal}" class="validate">
                            <label class="active" for="dueDate">dueDate</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input placeholder="your category" id="categorys"  value = "${response.category}" type="text" class="validate">
                            <label class="active" for="category">category</label>
                        </div>
                    </div>
                    <button class="btn waves-effect waves-light pink" type="submit" name="action">Update
                    <i class="material-icons right">update</i>
                     </button>
                     <input type="hidden" id="id_todos" name ="id_todos" value="${response._id}">
                    </form>  
                    </div>
                `)

            }
            //     $('.submitTodo').empty(
            //     )
            //     $('.submitTodo').append(`

            // <button class="btn waves-effect waves-light pink" type="submit" name="action">Update
            // <i class="material-icons right">update</i>
            //  </button>
            // `)
            console.log(id)
        })
        .fail(function (err) {
            M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })
}
function getDelete(id) {
    $.ajax({
        method: "DELETE",
        url: `http://localhost:3000/api/todos/${id}`,
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            // $("#loading").hide()
            getTodo()
            getCategory()
            M.toast({ html: "berhasil menghapus data Todo", classes: "red" })
            console.log(response)
        })
        .fail(function (err) {
            // $("#loading").hide()
            M.toast({ html: err.responseJSON, classes: "red" })
            console.log(err.responseJSON)
        })
}
function getTodo() {
    console.log("list todo")
    $(".todo").empty()
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/api/todos",
        headers: {
            token: localStorage.getItem("token")
        }
    })
        .done(function (response) {
            console.log("masuk ajax")
            console.log(response)
            $(".todo").empty()
            response.forEach((e, i) => {
                console.log(response)
                var created = getDate(e.createdAt)
                var due = getDate(e.dueDate)
                if (e.status === true) {
                    $(".todo").append(`<div class="row todos">
                    <div class="card-content">
                    <div class="col s2">
                        <div style="font-size: 20px;"><i class="material-icons cyan-text">check</i>${e.name}
                        </div>
                    </div>

                    <div class="col s2" style="padding-left: 7%;">
                        <div id="departure-time" style="font-size: 18px;">${created.tanggal}</div>
                        <div class="pink-text">${created.year}</div>
                    </div>

                    <div class="col s1">
                        <i class="material-icons">send</i>
                    </div>

                    <div class="col s1">
                        <div id="departure-time" style="font-size: 18px;">${due.tanggal}</div>
                        <div class="pink-text">${due.year}</div>
                    </div>

                    <div class="col s2">
                        <div style="font-size: 20px">${e.category}</div>
                    </div>

                    <div class="col s2">
                    <div style="font-size: 20px"> ${e.description}</div>
                    <div class="pink-text">description</div>
                    </div>

                    <div class="col s2">
                    <a class="waves-effect waves-light btn-small" id ="update${e._id}"><i class="material-icons right">update</i>update</a>
                    <a class="waves-effect waves-light btn-small red" id = "delete${e._id}"><i class="material-icons right">delete</i>delete</a>
                    </div>
             
                   
                </div>

            </div>`)
                } else {
                    $(".todo").append(`  <div class="row todos">
         
                    <div class="card-content">
                        <div class="col s2">
                            <div style="font-size: 20px;"><i class="material-icons cyan-text">close</i>${e.name}
                            </div>
                        </div>
    
                        <div class="col s2" style="padding-left: 7%;">
                            <div id="departure-time" style="font-size: 18px;">${created.tanggal}</div>
                            <div class="pink-text">${created.year}</div>
                        </div>
    
                        <div class="col s1">
                            <i class="material-icons">send</i>
                        </div>
    
                        <div class="col s1">
                            <div id="departure-time" style="font-size: 18px;">${due.tanggal}</div>
                            <div class="pink-text">${due.year}</div>
                        </div>

                        <div class="col s2">
                            <div style="font-size: 20px">${e.category}</div>
                        </div>

                        <div class="col s2">
                        <div style="font-size: 20px"> ${e.description}</div>
                        <div class="pink-text">description</div>
                        </div>

                        <div class="col s2">
                        <a class="waves-effect waves-light btn-small" id ="update${e._id}"><i class="material-icons right">update</i>update</a>
                        <a class="waves-effect waves-light btn-small red" id = "delete${e._id}"><i class="material-icons right">delete</i>delete</a>
                        </div>
                 
                       
                    </div>
    
                </div>`)
                }
                $(`#delete${e._id}`).click(function (event) {
                    event.preventDefault()
                    getDelete(e._id)
                });
                $(`#update${e._id}`).click(function (event) {
                    event.preventDefault()
                    getUpdate(e._id)
                });
            });
            // response.forEach(a => {
            //     $("#arrival").append(`<option value="${a.code}:${a.city}">${a.city} - ${a.name} International Airport</option>`)
            //     $("#departure").append(`<option value="${a.code}:${a.city}">${a.city} - ${a.name} International Airport</option>`)
            // });
        })
        .fail(function (err) {
            console.log(err.responseJSON)
        })
}