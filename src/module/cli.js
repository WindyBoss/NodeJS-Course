const [operation, ...numbers] = process.argv.slice(2); 

console.log(numbers);
console.log(operation);

switch(operation) {
    case 'sum':
        console.log(numbers.reduce((acc, num) => {
            console.log(num);
            console.log(parseFloat(num));
            return acc + parseFloat(num), 0
        }));
        break;

    case 'deduct':
        console.log(numbers.reduce((acc, num) => parseFloat(acc) - parseFloat(num)))
        break;
    default:
        throw new Error('unsupported operation');
};
