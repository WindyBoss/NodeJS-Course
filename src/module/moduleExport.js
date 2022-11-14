const url = 'my super url';

function log(message) {
    console.log(message);
};


global.x = 3; // - it is possible to create global variable, which does not need export, 
// but it needs to be careful and try not to use it, because it will be a lot of global variables, and it will hard to code later

// * Exports in nodejs looks in the next way
module.exports.log = log;
module.exports.endPoint = url;
/*
or
module.exports = {
    log, 
    endPoint
}
*/



/*
* This is how nodejs works hiddenly, so it wrap each file in the next way, but we can code like code above
(function (exports, require, module, __filename, __dirname) {

    const url = 'my super url';
    function log(message) {
        console.log(message);
    }

    module.exports.log = log;
    module.exports.endPoint = url;
})
*/