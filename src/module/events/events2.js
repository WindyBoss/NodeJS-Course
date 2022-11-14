const EventEmitter = require('events');

const Logger = require('./logger');
const logger = new Logger();


/*
* the next code register eventListener of class Logger, imported from logger.js file, 
* and later call logger.log, which simulate registered here event
*/

logger.on('messageLogged', (arg) => {
    console.log('Listener called', arg);
});

logger.log('jump');
