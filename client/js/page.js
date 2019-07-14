function lendingPage() {
    $('#home').hide()
    $('#project').hide()
    $('#personal').hide()
    $('#lending').show()
}

function gotoProject() {
    $('#personal').hide()
    $('#project').show()
    retrieveProject()
}

function gotoPersonal() {
    $('#project').hide()
    $('#personal').show()
}

function gotoEdit(title, desc, id, status) {
    if (status) {
        $( "#status" ).prop( "checked", true );
    } else {
        $( "#status" ).prop( "checked", false );
    }
    $('#edittodoModal').html(`
        <div class="modal fade" id="edit-modal"> 
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header">
                        <h4 class="modal-title" style="margin-left: 1%"> Edit Member </h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <!-- Modal body --> 
                    <div class="modal-body">
                        <div class="form-group" style="margin-left:1%; margin-right: 1%;">
                            <label for="titleEdit">Title:</label>
                            <input type="text" class="form-control" id="titleEdit" value="${title}">
                        </div>
                        <div class="form-group" style="margin-left:1%; margin-right: 1%;">
                            <label for="descriptionEdit">Description:</label>
                            <input type="text" class="form-control" id="descriptionEdit" value="${desc}">
                        </div>
                        <div class="form-group" style="margin-left:1%; margin-right: 1%;">
                            <label for="status">Status:</label>
                            <input type="checkbox" value=${status} id="status"> It's done
                            <button onclick="editTodo('${id}')" class="btn btn-dark" type="submit" style="margin-top: 3%; width: 100%;" data-dismiss="modal" id="edit-modal">Edit todo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `)
}