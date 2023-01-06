const EventEmiter = require('events');
const add = require('./add.js');
const multiply = require('./multiply.js');
const subtract = require('./subtract.js');
const divide = require('./divide.js');

const [,,firstNum, secondNum, operation] = process.argv;

const myEmiter = new EventEmiter();

myEmiter.on('error', errorHandler);
const errors = getValidationErrors(firstNum, secondNum, operation);
if (errors.length > 0) {
    myEmiter.emit(
        'error', 
        new Error(errors.join(' '))    
    );
    return;
}

let result;

switch (operation) {
    case 'add':
        result = add.getAddResult(firstNum, secondNum);
    break;
    case 'divide':
        result = divide.getDivideResult(firstNum, secondNum);
    break;
    case 'multiply':
        result = multiply.getMultiplyResult(firstNum, secondNum);
    break;
    case 'subtract':
        result = subtract.getSubstractResult(firstNum, secondNum);
    break;
}

console.log(`Operation result is: ${result}`);

function getValidationErrors(firstNum, secondNum, operation) {
    
    let errors = [];

    if (!firstNum || !secondNum || !operation) {
        errors.push('Not all required params specified: firstNum, secondNum and operation are required.');
    }

    if (!Number(firstNum) || !Number(secondNum)) {
        errors.push('FirsNum and secondNum should be numbers.');
    }

    if (!['add', 'multiply', 'divide', 'subtract'].includes(operation)) {
        errors.push('Operation should be one of: add, multiply, divide, subtract.');
    }

    return errors;
}

function errorHandler(error) {
    console.log(`Error: ${error.message}`);
}