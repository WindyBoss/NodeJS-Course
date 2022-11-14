const path = require('path');
const fs = require('fs').promises;

async function main2 () {
    const pathToMainPackageJson = path.join(__dirname, '../../../package.json'); // -> need to go up to the package

    console.log(await fs.readFile(pathToMainPackageJson, 'utf-8'));
};

main2();