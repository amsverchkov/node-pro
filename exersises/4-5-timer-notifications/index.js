const { EventEmitter } = require('events');
const notifier = require('node-notifier');

const args = process.argv;
const myEmitter = new EventEmitter();

myEmitter.on('error', (err) => {
    console.log(`Error: ${err.message}`);
});

myEmitter.on('result', (result) => {
    notifier.notify({
        title: 'Timer!',
        message: `Timer works! ${result} milliseconds passed!`
    });
});

const milliseconds = getMillisecondsFromCommandLineArgs();
//console.log(milliseconds);
setTimeout(() => {
    myEmitter.emit('result', milliseconds)
}, milliseconds);


function getMillisecondsFromCommandLineArgs() {
    let milliseconds = 0;
    for (let i = 2; i < args.length; i++) {
        const arg = args[i];
        if (!validateArg(arg)) {
            myEmitter.emit('error', new Error(`${arg} is not a valid param, please use at the end of param h, m, s`));
            return;
        }
        switch (arg.slice(-1)) {
            case 'h':
                milliseconds += parseFloat(arg.slice(0, -1)) * 1000 * 60 * 60;
                break;
            case 'm':
                milliseconds += parseFloat(arg.slice(0, -1)) * 1000 * 60;
                break;
            case 's':
                milliseconds += parseFloat(arg.slice(0, -1)) * 1000;
                break;
        }

    }
    return milliseconds;
}

function validateArg(arg) {
    const allowedArgsEnds = ['h', 'm', 's'];
    if (!allowedArgsEnds.includes(arg.slice(-1))) {
        return false;
    }

    if (!Number(arg.slice(0, -1))) {
        return false;
    }
    return true;

}