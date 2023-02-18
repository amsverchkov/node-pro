const complexCalculate = require('./calc-sum');
const splitArr = require('./split-arr');
const { performance, PerformanceObserver } = require('perf_hooks');
const { Worker } = require('worker_threads');

const coresNumber = 16;

const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name} duration ${entry.duration}`);
    })
});

perfObserver.observe({ entryTypes: ['measure'] });

const intitArr = [...Array(30000000).keys()];

//Here are complex calcing with and withou workers
calcWithoutWorkers({ arr: intitArr })
calcWithFewWorkers(intitArr);

function calcWithoutWorkers(initObj) {
    performance.mark('startCalc');
    complexCalculate(initObj);
    performance.mark('stopCalc');
    performance.measure('calcSum', 'startCalc', 'stopCalc');
}

function calcWithWorker (intitArr) {
    return new Promise((resolve) => {
        const myWorker = new Worker('./worker.js', {
            workerData: { arr: intitArr }
        })
        myWorker.on('message', (msg) => resolve(msg));
    })
}

async function calcWithFewWorkers (intitArr) {
    splitedIntitArr = splitArr(intitArr, coresNumber);
    performance.mark('startCalcWorkers');
    await Promise.all(splitedIntitArr.map(arr => calcWithWorker(arr)));
    performance.mark('stopCalcWorkers');
    performance.measure('calcSumWorkers', 'startCalcWorkers', 'stopCalcWorkers');
}

