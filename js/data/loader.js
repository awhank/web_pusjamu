var DataLoader = (function () {
  'use strict';

  var cache = {};

  return {
    load: function (key, url) {
      if (cache[key]) return Promise.resolve(cache[key]);

      return new Promise(function (resolve, reject) {
        if (window.fetch) {
          fetch(url)
            .then(function (r) {
              if (!r.ok) throw new Error('HTTP ' + r.status);
              return r.json();
            })
            .then(function (data) {
              cache[key] = data;
              resolve(data);
            })
            .catch(reject);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
              try {
                var data = JSON.parse(xhr.responseText);
                cache[key] = data;
                resolve(data);
              } catch (e) { reject(e); }
            } else { reject(new Error('HTTP ' + xhr.status)); }
          };
          xhr.onerror = function () { reject(new Error('Network error')); };
          xhr.send();
        }
      });
    }
  };
})();
