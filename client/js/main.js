$('document').ready(function(){
    initLocalClocks();
    getDate()
    checkSignIn()
    initListener()
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {});
});

function checkSignIn(){
    if(localStorage.getItem('access_token')){
        $('#landingPage').hide()
        $('#homePage').show()
        getNotifications(localStorage.getItem('userId'))
        getPersonalTodos()
        getMyProjects()
    } else {
        $('#landingPage').show()
        $('#homePage').hide()
    }
}


function initListener(){
    if(!$('#formStatus:checked').val()){
        $('.signUpContent').hide()
        $('.signInContent').show()
    } else {
        $('.signUpContent').show()
        $('.signInContent').hide()
    }

    $('#formStatus').click(function(){  
        console.log($('#formStatus:checked').val());
        console.log('aw');
        let value = $('#formStatus:checked').val()
        if(value){
            $('.signUpContent').show()
            $('.signInContent').hide()
        } else {
            $('.signUpContent').hide()
            $('.signInContent').show()
        }
    })

    $('#formLanding').submit(function(e){
        e.preventDefault()
        if(!$('#formStatus:checked').val()){
            signin()
        } else {
            signup()
        }
    })

    $('.logout').click(function(){
        userNotifications = []
        localStorage.clear()
        checkSignIn()        
    })

    $('#createPersonalTodo').click(async function(e){
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
            title : 'CREATE NEW TODO',
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
                    url : `${baseURL}/todos`,
                    method : 'POST',
                    headers : {
                        access_token : localStorage.getItem('access_token')
                    },
                    data : { name, description, dueDate : new Date(dueDate)}
                })

                $('#loaderCreate').empty()
                checkSignIn()
            } catch (error) {
                console.log('error: ', error.responseJSON);
                
            }

        }

    })

}


