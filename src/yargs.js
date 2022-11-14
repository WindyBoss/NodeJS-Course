/** @format */

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const users = [
  {
    id: 1,
    name: "Jane",
    surname: "Doe",
  },
  {
    id: 2,
    name: "Mike",
    surname: "JJ",
  },
  {
    id: 3,
    name: "John",
    surname: "pp"
  }

];

// * Yargs helps to simplify terminal command use by replacing long words with short (name => n | surname => s)
const argv = yargs
  .number("id")
  .string("name")
  .string("surname")
  .alias("name", "n")
  .alias("surname", "s").argv;

/* 
example: node yargs.js --id=1 --name=mike
result: { _: [], id: 1, name: 'mike', n: 'mike', '$0': 'yargs.js' }
* Here instead of name argument, used n
*/

function checkField(fieldName, user) {
  return !(argv[fieldName] && argv[fieldName] !== user[fieldName]);
} // -> return true | false

const userFound = users.filter((user) => { // -> helps to filter users by typing arguments in terminal during node process
  return (
    checkField("id", user) &&
    checkField("name", user) &&
    checkField("surname", user)
  );
});

console.log(userFound);

/* 
node yargs.js -n=Mike => [ { id: 2, name: 'Mike', surname: 'JJ' } ]
*/