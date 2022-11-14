/*
File Creation
*/
const fs = require('fs');

const fileName = 'example.txt';

// example of callback hell
// fs.writeFile(fileName, 'first file creation', err => {
//     if(err) {
//         console.log(err)
//     };

//     fs.readFile(fileName, 'utf-8', (err, data) =>{
//         if(err) {
//             console.log(err)
//         };        

//         fs.appendFile(fileName, 'second write', err => {
//             if(err) {
//                 console.log(err)
//             };
//         })
//     })
// });

const fsPromises = fs.promises;

/*
* The same as above, but using then
fsPromises.writeFile(fileName, 'rewrite').then(() => {
    return fsPromises.readFile(fileName, 'utf-8')
}).then((data) => {
    console.log(data)
    return fsPromises.appendFile(fileName, 'second write');
});
*/

// * The same as above, but using async await

async function main() {
    await fsPromises.writeFile(fileName, "rewrite");

    const data = await fsPromises.readFile(fileName, 'utf-8');

    console.log(data);

    await fsPromises.appendFile(fileName, "third write");
};

main();

