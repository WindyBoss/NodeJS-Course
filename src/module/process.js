console.log(process.argv); // -> arguments added to terminal (example: node process.js [1 2 3] - arguments)

/* 
* Process -> huge global object, which responsible for processes in nodejs and helps to control them
*/
process.nextTick(() => {
    console.log("next tick");
});

setImmediate(() => {
    console.log('setImmediate');
});

console.log(process.env); // -> huge object of data about process 

process.exit(); // -> finish the process here

setTimeout(() => {
    console.log('setTimeout'); // -> this code will works faster than setImmediate
})