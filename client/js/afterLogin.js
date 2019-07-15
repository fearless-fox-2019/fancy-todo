function afterLogin() {
    $('#afterLogin').empty()
    $('#afterLogin').append(`
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#" onClick="history.go(0)"><strong>FANCY</strong><i>todo</i></a>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-toggle="modal" data-target="#form" aria-expanded="false" aria-controls="collapseExample">
                            Create project
                        </a>
                    </li>
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i>profile</i>
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a class="dropdown-item" href="#" data-toggle="popover" title="Welcome!" data-trigger="hover" data-content="Please enjoy, ${localStorage.getItem('email')}">Info</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" id="logout" href="#">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Search -->
            <form id="formSearch" class="form-inline">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <a type="submit"><span class="input-group-text" id="basic-addon1">@</span></a>
                    </div>
                    <input type="text" class="form-control" placeholder="Search" aria-label="Search" id="contentSearch" aria-describedby="basic-addon1">
                </div>
                <div class="form-group">
                <select class="form-control" id="tipeSearch">
                    <option value="project">Project</option>
                    <option value="todo">Todo</option>
                </select>
                </div>
            </form>

            <!-- Create project modal -->
            <div class="modal fade" id="form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header border-bottom-0">
                            <h5 class="modal-title" id="exampleModalLabel">Project</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form id="createProject">
                            <div class="modal-body">
                                <div class="form-group">
                                    <label for="projectName">Name</label>
                                    <input type="text" class="form-control" id="projectName" placeholder="new project name">
                                </div>
                                <div class="form-group">
                                    <label for="member1">Member:</label>
                                    <input type="text" class="form-control" id="member1" aria-describedby="descriptionHelp" placeholder="email member for new project">
                                    <input type="text" class="form-control" id="member2" aria-describedby="descriptionHelp" placeholder="email member for new project">
                                    <input type="text" class="form-control" id="member3" aria-describedby="descriptionHelp" placeholder="email member for new project">
                                    <small class="text-muted">You can add it later</small>
                                
                                </div>
                            </div>
                            <div class="modal-footer border-top-0 d-flex justify-content-center">
                            <button type="submit" class="btn btn-light" style="border-color: #E9ECEF; position: absolute; right: 15px; bottom: 15px">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Header -->
        <div class="jumbotron text-center" style="height:200px">
            <h1>Welcome to <strong>FANCY</strong><i>todo</i></h1>
            <p>Place where many programmers work together</p>
        </div>
            
        <!-- Content -->
        <div class="container">
            <div class="row">
    
                <!-- Project List -->
                <div class="col-md-4 text-center">
                    <h5 style="margin-bottom: 10px">Project assigned to ${localStorage.getItem('email')}</h5>
                    <ul class="list-group" id="projectList">
        
                    </ul>
                </div>
    
                <!-- Project's detail -->
                <div class="col-md-8" id="projectDetail">
                <h5 class="item text-center">Project's detail</h5>
                <div class="detailProject"></div>
                </div>
            </div>
        </div> 
    `)

    $('#logout').on('click', function() {
        localStorage.removeItem('token')
        $('#toastInfo').empty()
        $('#toastInfo').append(`
          <div class="toast-header">
            <strong class="mr-auto text-primary">Goodbye</strong>
            <small class="text-muted">a seconds ago</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
          </div>
          <div class="toast-body">
            ${localStorage.getItem('email')}
          </div>
        `)
        $('#toastInfo').toast({
          delay: 5000
        })
        $('#toastInfo').toast('show')
        localStorage.removeItem('email')
        signOut()
        isLogin = false
        checkLogin(isLogin)
    })

    $('[data-toggle="popover"]').popover();

    $('#createProject').submit(function(event){
        event.preventDefault()
        let temp = [$('#member1').val(), $('#member2').val(), $('#member3').val()]
        let members = []
        temp.forEach( (member) => {
            if (member!=='') {
                members.push(member)
            }
        })
        console.log(members)
        let payload = {
            name: $('#projectName').val(),
            members: members
        }
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/projects',
            headers: {
                token: localStorage.getItem('token')
            },
            data: payload
        })
        .done(function(response){
            $('#toastInfo').empty()
            $('#toastInfo').append(`
                <div class="toast-header">
                    <strong class="mr-auto text-primary">${response.message}</strong>
                    <small class="text-muted">a seconds ago</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                </div>
                <div class="toast-body">
                    ${response.info.name}
                </div>
            `)
            $('#toastInfo').toast({
                delay: 5000
            })
            $('#toastInfo').toast('show')
            $('#form').modal('hide')
        })
        .fail(function(response){
            $('#toastInfo').empty()
            $('#toastInfo').append(`
                <div class="toast-header">
                    <strong class="mr-auto text-primary">Failed while creating new project</strong>
                    <small class="text-muted">a seconds ago</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
                </div>
                <div class="toast-body">
                    ${response.message}
                </div>
            `)
            $('#toastInfo').toast({
                delay: 5000
            })
            $('#toastInfo').toast('show')
            $('#form').modal('hide')
        })
    })

    $.ajax({
        method: 'get',
        url: 'http://localhost:3000/projects',
        headers: {
            token: localStorage.getItem('token')
        }
      })
      .done( function(projects) {
          console.log(projects)
          projectAppend(projects, 'projectList')
      })
      .fail( function(err) {
        $('#toastInfo').empty()
        $('#toastInfo').append(`
          <div class="toast-header">
            <strong class="mr-auto text-primary">Failed</strong>
            <small class="text-muted">a seconds ago</small>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
          </div>
          <div class="toast-body">
            Error occured while fetching data
          </div>
        `)
        $('#toastInfo').toast({
          delay: 5000
        })
        $('#toastInfo').toast('show')
      })
}