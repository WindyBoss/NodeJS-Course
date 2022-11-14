const { log, endPoint } = require('./module/moduleExport');

log(endPoint);
console.log(global.x);


/*
Node.js has an interpretator, which can make a synchronous and asynchronous operations, which is similar to the work of server.
Server won't wait until the dish will cook, but will serve other customers, which makes his work much more efficient, and in the same way works node.js.
This is the reason why is better to use asynchronous operations, because they don't block interpretator, which can be tragically on server computer

All libraries in node.js has two types of operations: asynchronous and synchronous - the same duplicate operations, but 1 is synchronous and 1 is asynchronous.
*/