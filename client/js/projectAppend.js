function projectAppend(projects, nameColumn) {
    console.log(projects)
    projects.forEach( (project) => {
        $(`#${nameColumn}`).append(`
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <a class="btn btn-link" href="#" id="${project._id}${nameColumn}">${project.name}</a>
                <span class="badge badge-primary badge-pill" style="background: #E9ECEF; color: black">${project.members.length}</span>
            </li>
        `)
        detailProject(project, nameColumn)                    
    })
}