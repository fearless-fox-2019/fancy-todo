const baseURL = 'http://localhost:3000'
let userNotifications = []

async function signin(){

    try {
        let email = $('#email').val()
        let password = $('#password').val()
        console.log('data: ', email, password);
    
    
    
        let login = await $.ajax({
            url : `${baseURL}/users/login`,
            data : {email, password},
            method : 'post'
        })
    
        console.log(login);
        M.toast({html: `WELCOME "${login.username}" !`, classes : 'rounded'})
        localStorage.setItem('access_token', login.access_token)
        localStorage.setItem('userId', login.userId)
        
        $('#password').val('')

        checkSignIn()
    } catch (error) {
        $('#password').val('')
        console.log('error: ', error.responseJSON);
        M.toast({html: error.responseJSON.err, classes : 'rounded'})
        
    }

}

async function signup(){

    try {
        let username = $('#username').val()
        let email = $('#email').val()
        let password = $('#password').val()
        console.log('data: ', username, email, password);
    
    
    
        let register = await $.ajax({
            url : `${baseURL}/users/register`,
            method : 'post',
            data : {username, email, password}
        })
        console.log('register: ', register);

        let login = await $.ajax({
            url : `${baseURL}/users/login`,
            data : {
                email : register.email, 
                password
            },
            method : 'post'
        })
        console.log('login: ', login);

        M.toast({html: `WELCOME "${login.username}" !`, classes : 'rounded'})
        localStorage.setItem('access_token', login.access_token)
        localStorage.setItem('userId', login.userId)

        $('#username').val('')
        $('#email').val('')
        $('#password').val('')

        checkSignIn()
        
    } catch (error) {
        console.log('error: ', error);
        M.toast({html: 'Double check your form !', classes : 'rounded'})
        
        $('#password').val('')
        if( error.responseJSON.err.message){
            console.log('error: ', error.responseJSON.err);
            M.toast({html: error.responseJSON.err.message, classes : 'rounded'})
        } else {

            console.log('error: ', error.responseJSON);
            M.toast({html: error.responseJSON.err, classes : 'rounded'})
        }

        
    }

}

async function getNotifications(id){
    try {
        
        let user = await $.ajax({
            url : `${baseURL}/users/${id}`,
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })
    
        $('#notifications').empty()

        userNotifications = user.notifications

        console.log('userNotifications: ', userNotifications.length);

        if(userNotifications.length > 0){
            userNotifications.forEach(element => {
                
                $('#notifications').append(`
                    <li class="collection-item avatar animated shake" style="background-color: rgba(255, 255, 255, 0.8)">
                    <i class="material-icons circle blue">group_add</i>
                    
                    <span class="title"><b>Project Invitation</b></span>
                    <p>
                        <a id="reject-${element._id}" href="" class="btn-small content red" style="float: right; margin: 5px">reject</a>
                        <a id="accept-${element._id}" href="" class="btn-small content" style="float: right; margin: 5px">accept</a>
                        ${element.msg}
                    </p>
                    </li>
                `)

                $(`#accept-${element._id}`).click(function(e){
                    e.preventDefault()
                    acceptProject(element.projectId)
                })
                $(`#reject-${element._id}`).click(function(e){
                    e.preventDefault()
                    rejectProject(element.projectId)
                })

            });
        }
        
    } catch (error) {
        console.log('error: ', error.responseJSON);
        
    }

}

async function acceptProject(id){
    try {
        let accept = await $.ajax({
            url : `${baseURL}/projects/${id}/invite/accept`,
            method : 'patch',
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })
        console.log('accept: ', accept);
        M.toast({html: accept.msg, classes : 'rounded lime darken-4'})
        userNotifications = []
        checkSignIn()

    } catch (error) {
        console.log('error: ', error.responseJSON);
        
    }
}

async function rejectProject(id){
    try {
        let reject = await $.ajax({
            url : `${baseURL}/projects/${id}/invite/reject`,
            method : 'patch',
            headers : {
                access_token : localStorage.getItem('access_token')
            }
        })
        console.log('reject: ', reject);
        M.toast({html: reject.msg, classes : 'rounded red darken-4'})
        userNotifications = []
        
        checkSignIn()

    } catch (error) {
        console.log('error: ', error.responseJSON);
        
    }
}