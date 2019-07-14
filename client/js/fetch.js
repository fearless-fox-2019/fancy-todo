let userTasks = []
let userLists = []
let userProjects = []

function fetchAll() {
    return Promise.all([usersTask(),usersList(),usersProject()])
}

function usersTask() {
    return new Promise((resolve, reject) => {
        $.ajax({
                url: `${baseUrl}/tasks`,
                type: 'GET',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done((allUsertasks) => resolve(allUsertasks))
            .fail((err) => reject(err))
    })
}

function usersList() {
    return new Promise((resolve, reject) => {
        $.ajax({
                url: `${baseUrl}/todoLists`,
                type: 'GET',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(allUserList => resolve(allUserList))
            .fail(err => reject(err))
    })
}

function usersProject() {
    return new Promise((resolve, reject) => {
        $.ajax({
                url: `${baseUrl}/projects/include`,
                type: 'GET',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .done(allUserProject => resolve(allUserProject))
            .fail((err) => reject(err))
    })
}

function fetchUserData() {
    return new Promise((resolve, reject)=> {
        $.ajax({
            url: `${baseUrl}/users/userData`,
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(result => resolve( result ))
            .fail( err => reject( err ))
    })
}