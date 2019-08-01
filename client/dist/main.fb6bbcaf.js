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
})({"js/main.js":[function(require,module,exports) {
$('#project-list-page').hide();

if (localStorage.getItem('accesstoken')) {
  $('#sign-in-form').hide();
  $('#mytodos').show();
  $('nav').show();
  $('#project-page').hide();
} else {
  $('#sign-in-form').show();
  $('#mytodos').hide();
  $('nav').hide();
  $('#project-page').hide();
}

$(document).ready(function () {
  if (localStorage.getItem('accesstoken')) {
    fetchMyTodos();
    fetchMyProjects();
  }

  $('#view-project-list').on('click', function () {
    $('#project-list-page').show();
    $('#mytodos').hide();
    $('#view-project-list').addClass('active');
    $('#project-page').hide();
  });
  $('#view-mytodos').on('click', function () {
    $('#project-list-page').hide();
    $('#mytodos').show();
    $('#view-project-list').removeClass('active');
    $('#project-page').hide();
  });
  $('#sign-up-form').hide();
  $('#sign-up-show').on('click', function () {
    $('#sign-in-form').fadeToggle(function () {
      $('#sign-up-form').fadeIn();
    });
  });
  $('#sign-in-show').on('click', function () {
    $('#sign-up-form').fadeToggle(function () {
      $('#sign-in-form').fadeIn();
    });
  });
  $('.check').on('click', function (event) {
    $(event.target).toggleClass('green');
    $(event.target).toggleClass('grey');
  });
  $('.menu .item').tab();
  $('#add-todo-button').on('click', function () {
    var today = new Date();
    resetNewTodoForm();
    $('#todo-form').modal('show');
    $('#date_calendar').calendar({
      type: 'date',
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    });
  });
  $('#add-project-button').on('click', function () {
    resetNewTodoForm();
    $('#new-project-name').val('');
    $('.ui.tiny.modal.project').modal('show');
  });
  $('#view-members-button').on('click', function () {
    $('.ui.tiny.modal.members').modal('show');
  });
  $('#add-member-button').on('click', function () {
    $('.ui.tiny.modal.addmember').modal('show');
  });
});

function resetNewTodoForm() {
  $('#new-todo-name').val('');
  $('#new-todo-desc').val('');
  $('#date_calendar').calendar('clear');
}

function resetLoginForm() {
  $('#email-login').val('');
  $('#password-login').val('');
}

function register() {
  event.preventDefault();
  var name = $('#name-register').val();
  var email = $('#email-register').val();
  var password = $('#password-register').val();
  $.ajax({
    url: "http://localhost:3000/users/register",
    method: 'POST',
    data: {
      name: name,
      email: email,
      password: password
    }
  }).done(function (response) {
    $('#sign-up-form').fadeToggle(function () {
      $('#sign-in-form').fadeIn();
    });
  }).fail(function (jqXHR, textstatus) {
    console.log(jqXHR);
  });
}

function login() {
  event.preventDefault();
  var email = $('#email-login').val();
  var password = $('#password-login').val();
  $.ajax({
    url: "http://localhost:3000/users/login",
    method: 'post',
    data: {
      email: email,
      password: password
    }
  }).done(function (response) {
    localStorage.setItem('accesstoken', response.accesstoken);
    postLogin();
    resetLoginForm();
  }).fail(function (jqXHR, textstatus) {
    swal(jqXHR.responseJSON.message);
  });
}

function onSignIn(googleUser) {
  event.preventDefault();
  var id_token = googleUser.getAuthResponse().id_token;
  $.ajax({
    url: 'http://localhost:3000/users/google-login',
    method: 'post',
    data: {
      token: id_token
    }
  }).done(function (response) {
    localStorage.setItem('accesstoken', response.accesstoken);
    postLogin();
  }).fail(function (jqXHR, textstatus) {
    console.log(jqXHR);
  });
}

function logout() {
  var auth2 = gapi.auth2.getAuthInstance();

  if (auth2) {
    auth2.signOut().then(function () {
      localStorage.clear();
      prelogin();
    }).catch(function (err) {
      localStorage.clear();
      console.log(err);
    });
  } else {
    localStorage.clear();
  }
}

function prelogin() {
  $('#mytodos').hide();
  $('#project-list-page').hide();
  $('#project-page').hide();
  $('#sign-in-form').fadeIn();
  $('nav').hide();
}

function postLogin() {
  fetchMyProjects();
  $('#project-page').hide();
  $('#mytodos').fadeIn();
  $('#sign-in-form').hide();
  $('nav').fadeIn();
  $('#add-todo-button').on('click', function () {
    var today = new Date();
    resetNewTodoForm();
    $('#todo-form').modal('show');
    $('#date_calendar').calendar({
      type: 'date',
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
    });
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
},{}]},{},["../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map