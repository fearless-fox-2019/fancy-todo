$('document').ready(function () {
    console.log('Document Ready !')
    $('#imagelanding').click(() => {
        $('.heroContainer').show()
        $('#signInForm').hide()
        $('#signUpForm').hide()
    })

    if (localStorage.getItem('token')) {
        toHome()
        // toMyTask()
        // toProject()
        fetchAll().then(result => console.log(result))
    } else {
        toLanding()
        signInForm()
    }
})

// section
function toLanding() {
    $('#landing').show()
    $('#home').hide()
    $('#projects').hide()
    $('#mytasks').hide()
    $('#about').hide()
}

function toHome() {
    $('#landing').hide()
    $('#home').show()
    $('#projects').hide()
    $('#mytasks').hide()
    $('#about').hide()

    timeline()
    appendIdentity()
}

function toProject(projectId) {
    $('#landing').hide()
    $('#home').hide()
    $('#projects').show()
    $('#mytasks').hide()
    $('#about').hide()

    projectAllTask(projectId)
    projectAllMembers(projectId)
    projectAllDetail(projectId)
}

function toMyTask() {
    $('#landing').hide()
    $('#home').hide()
    $('#projects').hide()
    $('#mytasks').show()
    $('#about').hide()

    $('#newListparentMyTask').hide()

    appendToMidUp()
    appendToMidBotRight()
    myProjects()
}

function toAbout() {
    $('#landing').hide()
    $('#home').hide()
    $('#projects').hide()
    $('#mytasks').hide()
    $('#about').show()
}

function showLanding() {

}
let baseUrl = `http://localhost:3000`