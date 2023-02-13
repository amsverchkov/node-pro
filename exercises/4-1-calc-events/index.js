const EventEmiter = require('events');
const { getValidationErrors, castParamsToFloat } = require('../4-1-calc/index');
const { add } = require('../4-1-calc/add');
const { divide } = require('../4-1-calc/divide');
const { multiply } = require('../4-1-calc/multiply');
const { subtract } = require('../4-1-calc/subtract');

let [, , firstNum, secondNum, operation] = process.argv;

const myEmiter = new EventEmiter();

myEmiter.on('error', errorHandler);

myEmiter.on('result', (result) => {
    console.log(`Operation result is: ${result}`);
})

myEmiter.on('validate', () => {
    const errors = getValidationErrors(firstNum, secondNum, operation);
    if (errors.length > 0) {
        myEmiter.emit(
            'error',
            new Error(errors.join(' '))
        );
        return;
    }
})

myEmiter.on('add', (firstNum, secondNum) => {
    myEmiter.emit('result', add.getResult(firstNum, secondNum));
});

myEmiter.on('multiply', (firstNum, secondNum) => {
    myEmiter.emit('result', multiply.getResult(firstNum, secondNum));
});


myEmiter.on('divide', (firstNum, secondNum) => {
    myEmiter.emit('result', divide.getResult(firstNum, secondNum));
});


myEmiter.on('subtract', (firstNum, secondNum) => {
    myEmiter.emit('result', subtract.getResult(firstNum, secondNum));
});

myEmiter.emit('validate', firstNum, secondNum, operation);

[firstNum, secondNum] = castParamsToFloat(firstNum, secondNum);

myEmiter.emit(operation, firstNum, secondNum);

function errorHandler(error) {
    console.log(`Error: ${error.message}`);
}