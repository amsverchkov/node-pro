const EventEmiter = require('events');

let [,,firstNum, secondNum, operation] = process.argv;

const myEmiter = new EventEmiter();

myEmiter.on('error', errorHandler);

const errors = [];

if (!validateParams(firstNum, secondNum, operation)) {
    myEmiter.emit(
        'error', 
        new Error(errors.join(' '))    
    );
    return;
}

let result;
firstNum = parseFloat(firstNum);
secondNum = parseFloat(secondNum);

myEmiter.on('result', (result) => {
    console.log(`Operation result is: ${result}`);
})

myEmiter.on('add', (firstNum, secondNum) => {
    result = firstNum + secondNum;
    myEmiter.emit('result', result);
});

myEmiter.on('multiply', (firstNum, secondNum) => {
    result = firstNum * secondNum;
    myEmiter.emit('result', result);
});


myEmiter.on('divide', (firstNum, secondNum) => {
    result = firstNum / secondNum;
    myEmiter.emit('result', result);
});


myEmiter.on('subtract', (firstNum, secondNum) => {
    result = firstNum - secondNum;
    myEmiter.emit('result', result);
});

myEmiter.emit(operation, firstNum, secondNum);




function validateParams(firstNum, secondNum, operation) {
    if (!firstNum || !secondNum || !operation) {
        errors.push('Not all required params specified: firstNum, secondNum and operation are required.');
    }

    if (!Number(firstNum) || !Number(secondNum)) {
        errors.push('FirsNum and secondNum should be numbers.');
    }

    if (!['add', 'multiply', 'divide', 'subtract'].includes(operation)) {
        errors.push('Operation should be one of: add, multiply, divide, subtract.');
    }

    if (errors.length > 0) {
        return false;
    }

    return true;
}

function errorHandler(error) {
    console.log(`Error: ${error.message}`);
}