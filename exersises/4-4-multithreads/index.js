const complexCalculate = require('./calc-sum');
const splitArr = require('./split-arr');
const {performance, PerformanceObserver} = require('perf_hooks');
const {Worker} = require('worker_threads');

const perfObserver = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        console.log(`${entry.name} duration ${entry.duration}`);
    })
});

perfObserver.observe({entryTypes: ['measure']});


function sqr(array) {
    return array.map((x) => (Math.random() > 0.5 ? x * 2 : x / 3));
}

const intitArr = [...Array(30000000).keys()];

performance.mark('startCalc');
const result = complexCalculate({arr: intitArr});
performance.mark('stopCalc');
performance.measure('calcSum', 'startCalc', 'stopCalc');

const calcWithWorker = (intitArr) => {
    return new Promise((resolve, reject) => {
        const myWorker = new Worker('./worker.js', {
            workerData: {arr: intitArr}
        })
        myWorker.on('message', (msg) => resolve(msg));
    })
}

const calcWithFewWorkers = async (intitArr) => {
    
    
    splitedIntitArr = splitArr(intitArr, 16);
    performance.mark('startCalcWorkers');
    const results = await Promise.all([
        calcWithWorker(splitedIntitArr[0]),
        calcWithWorker(splitedIntitArr[1]),
        calcWithWorker(splitedIntitArr[2]),
        calcWithWorker(splitedIntitArr[3]),
        calcWithWorker(splitedIntitArr[4]),
        calcWithWorker(splitedIntitArr[5]),
        calcWithWorker(splitedIntitArr[6]),
        calcWithWorker(splitedIntitArr[7]),
        calcWithWorker(splitedIntitArr[8]),
        calcWithWorker(splitedIntitArr[9]),
        calcWithWorker(splitedIntitArr[10]),
        calcWithWorker(splitedIntitArr[11]),
        calcWithWorker(splitedIntitArr[12]),
        calcWithWorker(splitedIntitArr[13]),
        calcWithWorker(splitedIntitArr[14]),
        calcWithWorker(splitedIntitArr[15]),
    ]);
    
    performance.mark('stopCalcWorkers');
    performance.measure('calcSumWorkers', 'startCalcWorkers', 'stopCalcWorkers');
}

calcWithFewWorkers(intitArr);