const EventEmiter = require('events');
const add = require('./add.js');
const multiply = require('./multiply.js');
const subtract = require('./subtract.js');
const divide = require('./divide.js');

let [,,firstNum, secondNum, operation] = process.argv;

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

[firstNum, secondNum] = castParamsToFloat([firstNum, secondNum]);

const result = getResult(operation, firstNum, secondNum);

console.log(`Operation result is: ${result}`);

function getResult(operation, firstNum, secondNum) {
    switch (operation) {
        case 'add':
            return add.getResult(firstNum, secondNum);
        case 'divide':
            return divide.getResult(firstNum, secondNum);
        case 'multiply':
            return multiply.getResult(firstNum, secondNum);
        case 'subtract':
            return subtract.getResult(firstNum, secondNum);
    }
}

function castParamsToFloat(params)
{
    return params.map(param => parseFloat(param));
}

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

module.exports = {
    getValidationErrors: getValidationErrors,
    castParamsToFloat: castParamsToFloat,
    getResult: getResult,
}