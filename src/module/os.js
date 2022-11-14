const os = require('os');

// * os - internal nodejs library, which helps to works with operational system (f.e. check memory)

const totalMemory = os.totalmem();
const freeMemory = os.freemem();

console.log('Total memory: ' + totalMemory)
console.log('Free memory: ' + freeMemory)