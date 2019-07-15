function projectAllTask(projectId) {
    console.log('all project task')
}

function projectAllMembers(projectId) {
    console.log('all project members')
}

function projectAllDetail(projectId) {
    console.log('project detailed')
    console.log(projectId)
    $.ajax({
        url: baseUrl + '/projects/' + projectId,
        type: 'GET',
        headers: {
            token: localStorage.getItem('token')
        }
    })
        .done(success => {
            console.log(success)
            $('#projectDetailed').empty()
            $('#projectDetailed').append(`
            <h1 class="title is-1" style="color: black">${success.name}</h1>
            `)
            success.members.forEach(el => {
                $('#projectAllmember').append(`
                <div class="box">
                    <article class="media">
    
                    <div class="media-content">
                    <div class="content">
                        <p>
                        <strong>John Smith</strong> <small>@johnsmith</small> <small>31m</small>
                        <br>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.
                        </p>
                    </div>
                    </article>
                    </div>
                `)
            })
        })
        .fail(er => {
            console.log(er)
        })
}