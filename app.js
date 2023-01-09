const {performance, PerformanceObserver} = require('perf_hooks');
const {Worker} = require('worker_threads');
const {fork} = require('child_process');
const { compute } = require('./factorial');

const perfObserver = new PerformanceObserver((list) => {
    // Так ошибка
    const workerFunctionMeasure = list.getEntriesByName('workerFunction').pop();
    console.log(`${workerFunctionMeasure.name} duration: ${workerFunctionMeasure.duration}`);

    const forkFunctionMeasure = list.getEntriesByName('forkFunction').pop();
    console.log(`${forkFunctionMeasure.name} duration: ${forkFunctionMeasure.duration}`);


    // А так работает
    //const entries = list.getEntries();
    // entries.forEach((item) => {
    //     console.log(`${item.name} duration: ${item.duration}`);
    // })

});

perfObserver.observe({entryTypes: ['measure']});



const workerFunction = (arr) => {
    return new Promise(
        (resolve, reject) => {
            const worker = new Worker('./worker.js', {
                workerData: {arr}
            });
            worker.on('message', (msg) => {
                resolve(msg);
            })
        }
    );
}


const forkFunction = (arr) => {
    return new Promise(
        (resolve, reject) => {
            const forkProcess = new fork('./fork.js');
            forkProcess.send({arr});
            forkProcess.on('message', (msg) => {
                resolve(msg);
            })
            
        }
    );
}

const main = async () => {
    performance.mark('startWorkerFunction');
    const workerFunctionResults = await Promise.all([
        workerFunction([25, 19, 48, 30]),
        workerFunction([25, 19, 48, 30]),
        workerFunction([25, 19, 48, 30]),
        workerFunction([25, 19, 48, 30]),    
    ]);
    performance.mark('stopWorkerFunction');
    performance.measure('workerFunction', 'startWorkerFunction', 'stopWorkerFunction');
    console.log(workerFunctionResults);
    performance.mark('startForkFunction');
    Promise.all([
        forkFunction([25, 19, 48, 30]),
        forkFunction([25, 19, 48, 30]),
        forkFunction([25, 19, 48, 30]),
        forkFunction([25, 19, 48, 30]),
    ]).then(() => {
        performance.mark('stopForkFunction');
        performance.measure('forkFunction', 'startForkFunction', 'stopForkFunction');
    });
    //console.log('Res:' , forkFunctionRes);
    
    
    //console.log(forkFunctionRes);
}

main();
console.log(1);
setTimeout(() => console.log(`Test`), 500)