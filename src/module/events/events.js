const EventEmitter = require('events');

// * Events - internal nodejs library, that helps to work with different events, and is called as class (object)

const emitter = new EventEmitter();
console.log(emitter);

emitter.on('messageLogged', function(arg) { // - helps to add an eventListener (event.on)
    console.log('listener called', arg);
});

emitter.emit('messageLogged', { id: 1, url: 'https:??'}); // - helps to simulate an event 
