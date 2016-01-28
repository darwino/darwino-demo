/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2016.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// declare global: tern, server

var server;

this.onmessage = function(e) {
  var data = e.data;
  switch (data.type) {
  case "init": return startServer(data.defs, data.plugins, data.scripts);
  case "add": return server.addFile(data.name, data.text);
  case "del": return server.delFile(data.name);
  case "req": return server.request(data.body, function(err, reqData) {
    postMessage({id: data.id, body: reqData, err: err && String(err)});
  });
  case "getFile":
    var c = pending[data.id];
    delete pending[data.id];
    return c(data.err, data.text);
  default: throw new Error("Unknown message type: " + data.type);
  }
};

var nextId = 0, pending = {};
function getFile(file, c) {
  postMessage({type: "getFile", name: file, id: ++nextId});
  pending[nextId] = c;
}

function startServer(defs, plugins, scripts) {
  if (scripts) importScripts.apply(null, scripts);

  server = new tern.Server({
    getFile: getFile,
    async: true,
    defs: defs,
    plugins: plugins
  });
}

this.console = {
  log: function(v) { postMessage({type: "debug", message: v}); }
};
