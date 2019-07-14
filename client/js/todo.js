
$(document).ready(function() {
    $('#addTodo').click(function() {
        event.preventDefault()
        addTo()
    })
    
    function addTo() {
        $('#addForm').show()
    }
    
    $('#addSubmit').click(function() {
        event.preventDefault()
        let titleItem = $('#titleAdd').val()
        let descItem = $('#descriptionAdd').val()
        let statusItem = $('#sel1').val()
        let dateItem = $('#datepickerAdd').val()
        $.ajax({
            url: `${baseUrl}/todos/create`,
            type: 'post',
            data: {
                title: titleItem,
                description: descItem,
                status: statusItem,
                duedate: dateItem,
                token: localStorage.getItem('token')
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(data => {
            console.log('SUKSES MENAMBAHKAN TO-DO')
            event.preventDefault()
            isLogin()

        })
        .fail(error => {
            console.log(error)
        })   
    })
    
})

$('#editSubmit').click(function() {
    let id = localStorage.getItem('idTodo')
    let titleItem = $('#titleEdit').val()
    let descItem = $('#descriptionEdit').val()
    let statusItem = $('#sel2').val()
    let dateItem = $('#datepickerEdit').val()
    $.ajax({
        url: `${baseUrl}/todos/${id}`,
        type: 'put',
        data: {
            title: titleItem,
            description: descItem,
            status: statusItem,
            duedate: dateItem
        },
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(data => {
        console.log('SUKSES MENGEDIT DATA')
        isLogin()
    })
    .fail(error => {
        console.log(error)
    })
})

function editTodo(id) {
    $.ajax({
        url: `${baseUrl}/todos/${id}`,
        type: 'get',
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(data => {
        $('#titleEdit').val(`${data.title}`)
        $('#descriptionEdit').val(`${data.description}`)
        $('#sel2').val(`${data.status}`)
        $('#datepickerEdit').val(`${data.duedate}`) 
        $('#main').hide()
        localStorage.setItem(`idTodo`, data._id)
        $('#editForm').show()
    })
    .fail(error => {
        console.log(error)
    })
}

function deleteTodo(id) {
    $.ajax({
        url: `${baseUrl}/todos/${id}`,
        type: 'delete',
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(data => {
        console.log('SUKSES MENGHAPUS DATA')
        isLogin()
    })
    .fail(error => {
        console.log(error)
    })
}


function retrieveTodo() {
    $.ajax({
        url: `${baseUrl}/todos`,
        type: 'get',
        headers: {
            token: localStorage.getItem('token')
        }
    })
    .done(data => {

        $.each(data, function(i, todos) {
        $('#main').append(`
            <div class="card bg-light text-dark col-12">
                <div class="row">
                    <div class="card-body col-12" style="font-weight: bold; font-size: 20px;">${todos.title}</div>
                    <div class="card-body col-3" style="font-weight: bold; font-size: 14px; margin-top: -2.5%; margin-left: 1.7%;">${todos.description}</div>
                    <div class="card-body col-3" style="font-weight: bold; font-size: 14px; margin-top: -2.5%;">Status : ${todos.status}</div>
                    <div class="card-body col-3" style="font-weight: bold; font-size: 14px; margin-top: -2.5%;">Due Date : ${todos.duedate}</div>
                    <button onclick="editTodo('${todos._id}')" class="card-body col-1 btn btn-link" style="font-weight: bold; font-size: 20px; margin-top: -5%; text-align:right; color:black;"><i class="far fa-edit"></i></button>
                    <button onclick="deleteTodo('${todos._id}')" class="card-body col-1 btn btn-link" style="font-weight: bold; font-size: 20px; margin-top: -5%; text-align:right; color:black;"><i class='fas fa-trash'></i></button>
                </div>
            </div>
            <br>
        `)
        })
    })
    .fail(error => {
        console.log(error)
    })
}


