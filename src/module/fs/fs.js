/** @format */

const fs = require("fs").promises;

// * as was mentioned in index.js - it is better to use async functions, that why are use then, Promise and asyncAwait


/* It is better to use async await instead of then, because it will prevent the callback hell (code will go to right ==>)
fs.readdir(__dirname) // -> read the current directory
  .then((files) => { // -> take all files
    console.log(files);

    return Promise.all( // -> here function will stop until Promise.all will be made, and all elements will served by Array.map 
      files.map(async (fileName) => {
        // console.log(fileName);
        const stats = await fs.stat(fileName); // -> will check file stats
        // console.log(stats);
        return {
            name: fileName,
            size: stats.size,
            date: stats.mtime // -> creation date
        };
      })
    );
  })
  .then((result) => { // -> last function, which wait until all promises in then will be made
    console.table(result); // -> show in console in table form
  });
*/

const readDirectory = async () => {
    const files = await fs.readdir(__dirname);
    const filesStats = await Promise.all(
        files.map(async (fileName) => {
            const stats = await fs.stat(fileName);
            return {
                name: fileName,
                size: stats.size,
                date: stats.mtime,
                isFolder: stats.isDirectory(),
            }
        })
    );
    console.table(filesStats);
};

readDirectory();