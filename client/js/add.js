function addTaskForm() {
    console.log('hello world from TaskFrom')
    let taskTitle = $('#addTaskFormTitle').val()
    let taskTitleDescription = $('#addTaskFormTitleDescription').val()
    let duedate = $("#datepicker").datepicker({
        minDate: -20,
        maxDate: "+1M +10D"
    }).val()
    let list = $('#listOption').val()
    let newListName = $('#addNewList').val()

    // console.log(taskTitle, 'ini task')
    // console.log(taskTitleDescription, 'ini task description')
    // console.log(duedate, 'ini due date')
    // console.log(list, 'ini list')
    // console.log(newListName, 'ini new list')
    let newTask = {
        name: taskTitle,
        description: taskTitleDescription,
        listId: '',
        duedate: duedate
    }
    if (list === 'Select list' || list === null) {
        console.log('hello agaiiiiinnn')
        //create new List
        let newList = {
            name: newListName
        }
        createNewList(newList)
            .then(newList => {
                console.log(newTask)
                newTask.listId = newList._id
                console.log(newList._id, 'inidia new list kitaa~~')
                return createNewTask(newTask)
            })
            .then(createdTask => {
                console.log(createdTask,'akhirnya task baruuuuu~~')
                appendIdentity()
                timeline()
            })
            .catch(err => console.log(err))
    } else {
        console.log('ahaayyyyyyy~~')
        //findOnelist
        
        findAlist(list)
            .then(foundList => {
                console.log(foundList, 'telah ditemuakn sebuah list yang tlah ada')
                newTask.listId = foundList._id
                return createNewTask(newTask)
            })
            .then( createdTask => {
                console.log(createdTask,'task baru algi dari list yang sudah ada :p')
                appendIdentity()
            })
            .catch(err => console.log('lahhh kok eror', err))
    }
}

function addListForm() {
    console.log('hello world from TaskFrom')
    $('#newListparent').toggle()
}

function addProjectForm() {
    console.log('hello world from projectsFrom')
    let name = $('#addProjectName').val()
    let description = $('#addProjectDescription').val()

    $.ajax({
            url: `${baseUrl}/projects`,
            type: 'POST',
            data: {
                name,
                description
            },
            headers: {
                token: localStorage.getItem('token')
            }
        })
        .done(created => {
            console.log(created)
            timeline()
        })
        .fail(err => {
            console.log(err)

        })
}

function getMinDate() {
    console.log('hehehe')
    return new Date()
}

function createNewList(newListData) {
    console.log(newListData, 'disiniiiii~~')
    return new Promise((resolve, reject) => {
        $.ajax({
                url: `${baseUrl}/todolists`,
                type: 'POST',
                headers: {
                    token: localStorage.getItem('token')
                },
                data: newListData
            })
            .done(result => resolve(result))
            .fail(err => reject(err))
    })
}

function createNewTask(newTaskData) {
    console.log(newTaskData, 'calon tak baruuu')
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${baseUrl}/tasks`,
            type: 'POST',
            headers: {
                token: localStorage.getItem('token')
            },
            data: newTaskData
        })
        .done(result => resolve(result))
        .fail(err => reject(err))
    })
}

function findAlist(name) {
    console.log(name)
    return new Promise ((resolve, reject)=> {
        $.ajax({
            url: `${baseUrl}/todolists/${name}`,
            type: 'GET',
            headers: {
                token: localStorage.getItem('token')
            }
        })
            .done(result => resolve( result ))
            .catch(err => reject( err ))
    })
}