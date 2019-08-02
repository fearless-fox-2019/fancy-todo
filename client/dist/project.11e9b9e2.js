// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/project.js":[function(require,module,exports) {
function showProjectPage() {
  $('#mytodos').hide();
  $('#sign-in-form').hide();
  $('#project-page').fadeIn();
  $('#project-list-page').hide();
  $('#view-project-list').removeClass('active');
}

function fetchMyProjects() {
  $('#project-list').empty();
  $.ajax({
    url: 'http://localhost:3000/projects/',
    method: 'GET',
    headers: {
      accesstoken: localStorage.getItem('accesstoken')
    }
  }).done(function (projects) {
    console.log(projects);
    var raw = "";
    projects.forEach(function (project) {
      raw += "\n                <div class=\"four wide column\">\n                <div class=\"ui card piled segment animated jackInTheBox\">\n                  <div class=\"content\">\n                    <div class=\"header\">\n                      ".concat(project.name, "\n                      <i class=\"right floated trash small grey icon\" onclick=\"deleteProject('").concat(project._id, "')\"></i>\n                    </div>\n                  </div>\n                  <div class=\"content\">\n                    <h4 class=\"ui sub header\">Detail</h4>\n                    <div class=\"ui feed\">\n                      <div class=\"event\">\n                        <div class=\"content\">\n                          <div class=\"summary\"><a>Master: </a>").concat(project.master.name, "</div>\n                        </div>\n                      </div>\n                      <div class=\"event\">\n                        <div class=\"content\">\n                          <div class=\"summary\"><a>Members: </a> ").concat(project.members.length, "</div>\n                        </div>\n                      </div>\n                      <div class=\"event\">\n                        <div class=\"content\">\n                          <div class=\"summary\"><a>Todos: </a>").concat(project.todos.length, "</div>\n                        </div>\n                      </div>\n                    </div>\n                  </div>\n                  <div class=\"extra content\">\n                    <button class=\"ui button\" onclick=\"projectPage('").concat(project._id, "')\">Go to Project</button>\n                  </div>\n                </div>\n              </div>\n                ");
    });
    $('#project-list').append(raw);
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}

function addNewProject() {
  event.preventDefault();
  var name = $('#new-project-name').val();
  $.ajax({
    url: 'http://localhost:3000/projects/',
    method: 'POST',
    headers: {
      accesstoken: localStorage.getItem('accesstoken')
    },
    data: {
      name: name
    }
  }).done(function (projects) {
    console.log(projects);
    fetchMyProjects();
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}

function deleteProject(id) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this!",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(function (willDelete) {
    if (willDelete) {
      $.ajax({
        url: "http://localhost:3000/projects/".concat(id),
        method: 'DELETE',
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      }).done(function (response) {
        fetchMyProjects();
        swal("Project deleted!", {
          icon: "success"
        });
      }).fail(function (jqXHR, textstatus) {
        swal(jqXHR.responseJSON.message);
      });
    }
  });
}

function projectPage(id) {
  showProjectPage();
  $('#todos-incomplete-project').empty();
  $('#todos-complete-project').empty();
  $('#todos-all-project').empty();
  $('#project-todo-form').empty();
  $('#project-members').empty();
  $('#add-member-form').empty();
  console.log(id, 'projects iddddddd');
  $.ajax({
    url: "http://localhost:3000/projects/".concat(id),
    method: 'GET',
    headers: {
      accesstoken: localStorage.getItem('accesstoken')
    }
  }).done(function (response) {
    $('#project-name').text(response.name);
    console.log(response);
    var options = {
      weekday: 'short',
      month: 'long',
      day: 'numeric'
    };
    var rawAll = "";
    var rawCom = "";
    var rawIn = "";
    response.todos.forEach(function (todo) {
      if (todo.status) {
        rawCom += "\n                    <div class=\"four wide column\">\n                    <div class=\"ui link card animated flipInX\">\n                    <div class=\"content\">\n                    <i class=\"right floated check large green icon\" onclick=\"updateTodoProject('".concat(todo._id, "', ").concat(!todo.status, ", '").concat(id, "')\"></i>\n                    <div class=\"header\">").concat(todo.name, "</div>\n                        <div class=\"description\">\n                            <p>").concat(todo.description, "</p>\n                        </div>\n                    </div>\n                    <div class=\"extra content\">\n                        <span class=\"left floated trash\" onclick=\"deleteTodoProject('").concat(todo._id, "', '").concat(id, "')\">\n                            <i class=\"trash icon\"></i>\n                        </span>\n                    \n                        <span class=\"right floated clock outline\">\n                        <i class=\"clock_outline icon\"></i>\n                        Due date: ").concat(new Date(todo.due_date).toLocaleDateString('en', options), "\n                        </span>\n                        </div>\n                        </div>\n                    </div>\n                    ");
      } else {
        rawIn += "\n                    <div class=\"four wide column\">\n                    <div class=\"ui link card animated flipInX\">\n                    <div class=\"content\">\n                    <i class=\"right floated check large grey icon\" onclick=\"updateTodoProject('".concat(todo._id, "', ").concat(!todo.status, ", '").concat(id, "')\"></i>\n                    <div class=\"header\">").concat(todo.name, "</div>\n                        <div class=\"description\">\n                            <p>").concat(todo.description, "</p>\n                        </div>\n                    </div>\n                    <div class=\"extra content\">\n                        <span class=\"left floated trash\" onclick=\"deleteTodoProject('").concat(todo._id, "', '").concat(id, "')\">\n                            <i class=\"trash icon\"></i>\n                        </span>\n\n                        <span class=\"right floated clock outline\">\n                        <i class=\"clock_outline icon\"></i>\n                        Due date: ").concat(new Date(todo.due_date).toLocaleDateString('en', options), "\n                        </span>\n                        </div>\n                    </div>\n                    </div>\n                    ");
      }

      rawAll += "\n                <div class=\"four wide column\">\n                    <div class=\"ui link card animated flipInX\">\n                    <div class=\"content\">\n                    <i class=\"right floated check large ".concat(todo.status ? "green" : "grey", " icon\" onclick=\"updateTodoProject('").concat(todo._id, "', ").concat(!todo.status, ", '").concat(id, "')\"></i>\n                    <div class=\"header\">").concat(todo.name, "</div>\n                        <div class=\"description\">\n                            <p>").concat(todo.description, "</p>\n                        </div>\n                    </div>\n                    <div class=\"extra content\">\n                        <span class=\"left floated trash\" onclick=\"deleteTodoProject('").concat(todo._id, "', '").concat(id, "')\">\n                            <i class=\"trash icon\"></i>\n                        </span>\n\n                        <span class=\"right floated clock outline\">\n                        <i class=\"clock_outline icon\"></i>\n                        Due date: ").concat(new Date(todo.due_date).toLocaleDateString('en', options), "\n                        </span>\n                        </div>\n                    </div>\n                </div>\n                ");
    });
    var rawForm = "\n            <div class=\"ui icon header\">Add New Todo</div>\n          <div class=\"content\">\n            <form class=\"ui form\">\n              <div class=\"field\">\n                <label>Name</label>\n                <input\n                  type=\"text\"\n                  name=\"name\"\n                  placeholder=\"Name\"\n                  id=\"new-todo-name-project\"\n                />\n              </div>\n              <div class=\"field\">\n                <label>Description</label>\n                <textarea\n                  type=\"text\"\n                  name=\"last-name\"\n                  id=\"new-todo-desc-project\"\n                  rows=\"3\"\n                ></textarea>\n              </div>\n              <div class=\"field\">\n                <label>Due Date</label>\n                <div class=\"ui calendar\" id=\"project_date_calendar\">\n                  <div class=\"ui input left icon\">\n                    <i class=\"calendar icon\"></i>\n                    <input\n                      type=\"text\"\n                      placeholder=\"Date\"\n                      id=\"new-todo-due-date-project\"\n                      readonly=\"readonly\"\n                      required\n                    />\n                  </div>\n                </div>\n              </div>\n            </form>\n          </div>\n          <div class=\"actions\">\n            <div class=\"ui red cancel button\">\n              <i class=\"remove icon\"></i>\n              Cancel\n            </div>\n            <div class=\"ui green ok button\" onclick=\"addTodoProject('".concat(id, "')\">\n              <i class=\"checkmark icon\"></i>\n              Create Todo\n            </div>\n          </div>\n            ");
    var rawMembers = "\n            <tr class=\"center aligned\">\n                  <td>".concat(response.master.name, " (master)</td>\n                </tr>\n            ");
    response.members.forEach(function (member) {
      rawMembers += "\n                <tr class=\"center aligned\">\n                  <td>".concat(member.name, "</td>\n                </tr>\n                ");
    });
    var rawMemberForm = "\n            <div class=\"ui red cancel button\">\n              <i class=\"remove icon\"></i>\n              Cancel\n            </div>\n            <div class=\"ui blue ok button\" onclick=\"addMember('".concat(id, "')\">\n              <i class=\"checkmark icon\"></i>\n              Add Member\n            </div>\n            ");
    $('#todos-all-project').append(rawAll);
    $('#todos-incomplete-project').append(rawIn);
    $('#todos-complete-project').append(rawCom);
    $('#project-members').append(rawMembers);
    $('#add-member-form').append(rawMemberForm);
    $('#project-todo-form').append(rawForm);
    $('#add-member-button').on('click', function () {
      $('.ui.tiny.modal.addmember').modal('show');
    });
    $('#add-todo-project-button').on('click', function () {
      var today = new Date();
      resetNewTodoForm();
      $('#project-todo-form').modal('show');
      $('#project_date_calendar').calendar({
        type: 'date',
        minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
      });
    });
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}

function addTodoProject(id) {
  var name = $('#new-todo-name-project').val();
  var description = $('#new-todo-desc-project').val() || null;
  var due_date = $('#new-todo-due-date-project').val() || null;
  console.log(name, description, due_date);
  $.ajax({
    url: "http://localhost:3000/projects/".concat(id, "/add-todo"),
    method: 'PUT',
    headers: {
      accesstoken: localStorage.getItem('accesstoken')
    },
    data: {
      name: name,
      description: description,
      due_date: due_date
    }
  }).done(function (response) {
    projectPage(id);
    fetchMyProjects();
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}

function updateTodoProject(todoId, status, projectId) {
  event.preventDefault();
  $.ajax({
    url: "http://localhost:3000/projects/".concat(projectId, "/").concat(todoId),
    method: 'PATCH',
    headers: {
      accesstoken: localStorage.getItem('accesstoken')
    },
    data: {
      status: status
    }
  }).done(function (response) {
    projectPage(projectId);
    fetchMyProjects();
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}

function deleteTodoProject(todoId, projectId) {
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this!",
    icon: "warning",
    buttons: true,
    dangerMode: true
  }).then(function (willDelete) {
    if (willDelete) {
      $.ajax({
        url: "http://localhost:3000/projects/".concat(projectId, "/").concat(todoId),
        method: 'DELETE',
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      }).done(function (response) {
        projectPage(projectId);
        fetchMyProjects();
        swal("Todo deleted!", {
          icon: "success"
        });
      }).fail(function (jqXHR, textstatus) {
        swal(jqXHR.responseJSON.message);
      });
    }
  });
}

function addMember(projectId) {
  var newMemberEmail = $('#newMember').val();
  console.log(projectId);
  $.ajax({
    url: "http://localhost:3000/projects/".concat(projectId, "/add-member"),
    method: 'PUT',
    data: {
      email: newMemberEmail
    },
    headers: {
      accesstoken: localStorage.getItem('accesstoken')
    }
  }).done(function (response) {
    console.log(response);
    projectPage(projectId);
    fetchMyProjects();
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}
},{}],"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35445" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/project.js"], null)
//# sourceMappingURL=/project.11e9b9e2.js.map