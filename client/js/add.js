function addTaskForm() {
    console.log('Masuk Pada Add Task Form')
    let taskTitle = $('#addTaskFormTitle').val()
    let taskTitleDescription = $('#addTaskFormTitleDescription').val()
    let duedate = $("#datepicker").datepicker({
        minDate: -20,
        maxDate: "+1M +10D"
    }).val()
    let list = $('#listOption').val()
    let newListName = $('#addNewList').val()

    let newTask = {
        name: taskTitle,
        description: taskTitleDescription,
        listId: '',
        duedate: duedate
    }
    console.log(newTask, 'ini home page')
    if (list === 'Select list' || list === null) {
        console.log('Create new List path.')
        let newList = {
            name: newListName
        }
        createNewList(newList)
            .then(newList => {
                console.log(newList, 'Hasil kembalian dari membuat List baru')
                newTask.listId = newList._id
                return createNewTask(newTask)
            })
            .then(createdTask => {
                console.log(createdTask,'Hasil dari membuat task baru setelah membuat list baru')
                appendIdentity()
                timeline()
            })
            .catch(err => console.log(err))
    } else {
        console.log('Menggunakan List yang sudah Ada')
        
        findAlist(list)
            .then(foundList => {
                console.log(foundList, 'Hasil pencarian dari list yang dipilih')
                newTask.listId = foundList._id
                return createNewTask(newTask)
            })
            .then( createdTask => {
                console.log(createdTask,'Hasil membuat task Baru dari menggunakan list yang sudah ada')
                appendIdentity()
            })
            .catch(err => console.log({err,message: `Error karena membuat task dengan list yang sudah ada`}))
    }
}

function addListForm() {
    console.log('Memanggil tombol untuk menambahkan list baru')
    $('#newListparent').toggle()
}

function addProjectForm() {
    console.log('Masuk ke fungsi untuk membuat form baru')
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
            console.log(created, 'Ini adalah hasil dari project yang sudah dibuat.')
            timeline()
        })
        .fail(err => {
            console.log({err, message: 'gagal membuat project baru'})
        })
}

// function getMinDate() {
//     console.log('Mengambil tanggal sekarang')
//     return new Date()
// }

function createNewList(newListData) {
    console.log(newListData, 'Dipanggil oleh create task form. mengembalikan promise pending.')
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
    console.log(newTaskData, 'Dipanggil oleh create task form. mengembalikan promise pending.')
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
    console.log(name, 'Mencari list berdasarkan id input list.menghasilkan promise pending')
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