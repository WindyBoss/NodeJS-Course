const path = require('path');

// * Path - internal nodejs library, that helps to work with files

// * variable __filename includes the path to current file. It can be parsed by "path library", which will make from it an object
const pathObj = path.parse(__filename);
console.log(pathObj);
console.log(__filename);


// * variable __dirname includes the path to the directory in which is current file. It can be parsed by "path library", which will make from it an object
const dirObj = path.parse(__dirname);
console.log(dirObj);
console.log(__dirname);
