const EventEmitter = require('events');
const emitter = new EventEmitter();

const url = 'https://mylogger.com/';

// in the next way is good to wrap the class for extending their functionality
class Logger extends EventEmitter {
    log(message) {
        console.log(message);
        this.emit('messageLogged', { id: 1, url: 'https://mylogger'});
    };
}

// other type of exports
module.exports = Logger;
