(function installAppsScriptBridge(global) {
  'use strict';

  var meta = document.querySelector('meta[name="ikonix-api-base"]');
  var configuredBase = global.IKONIX_API_BASE || (meta && meta.content) || '';
  var apiBase = String(configuredBase).replace(/\/$/, '');

  function rpc(method, args) {
    return fetch(apiBase + '/api/rpc', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: method, args: args || [] })
    }).then(function (response) {
      return response.json().catch(function () {
        return { ok: false, error: 'The IKONIX service returned an invalid response.' };
      }).then(function (payload) {
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || 'The IKONIX request failed.');
        }
        return payload.result;
      });
    });
  }

  function createRunner(successHandler, failureHandler) {
    return new Proxy({}, {
      get: function (_, property) {
        if (property === 'withSuccessHandler') {
          return function (handler) { return createRunner(handler, failureHandler); };
        }
        if (property === 'withFailureHandler') {
          return function (handler) { return createRunner(successHandler, handler); };
        }
        if (property === 'then') return undefined;
        return function () {
          var args = Array.prototype.slice.call(arguments);
          rpc(String(property), args).then(function (result) {
            if (typeof successHandler === 'function') successHandler(result);
          }).catch(function (error) {
            var failure = { message: error && error.message ? error.message : String(error) };
            if (typeof failureHandler === 'function') failureHandler(failure);
            else global.console.error(failure.message);
          });
        };
      }
    });
  }

  global.google = global.google || {};
  global.google.script = global.google.script || {};
  global.google.script.run = createRunner(null, null);
}(window));
