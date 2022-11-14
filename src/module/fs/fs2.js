const fs = require('fs').promises;

fs.readFile('readme.txt').then((data) => {
// console.log(data); -> it will show Buffer
// * Buffer -> number data type, which present UTF-8 symbols (65 23 99) -> which, means letters or symbol according to UTF-8 system
    const string = data.toString();
    const object = JSON.parse(string);

    console.log(object["repository"]);
    console.log(object);
}).catch((err) => {
    console.log(err.message);
});