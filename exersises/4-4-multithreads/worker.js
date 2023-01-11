const { parentPort, workerData } = require('worker_threads');
const complexCalculate = require('./calc-sum');
parentPort.postMessage(complexCalculate(workerData));
