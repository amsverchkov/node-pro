const { EventEmitter } = require('events');
const args = process.argv;
const myEmitter = new EventEmitter();

myEmitter.on('error', (err) => {
    console.log(`Error: ${err.message}`);
});

myEmitter.on('result', (result) => {
    console.log(`Timer works! ${result} milliseconds passed`);
});

const milliseconds = getMillisecondsFromCommandLineArgs();
setTimeout(() => {
    myEmitter.emit('result', milliseconds)
}, milliseconds);


function getMillisecondsFromCommandLineArgs() {
    let milliseconds = 0;
    const startCommandLineArgs = 2;
    for (let i = startCommandLineArgs; i < args.length; i++) {
        const arg = args[i];
        if (!validateArg(arg)) {
            myEmitter.emit('error', new Error(`${arg} is not a valid param, please use at the end of param h, m, s`));
            return;
        }
        const [timeType, time] = [arg.slice(-1), parseFloat(arg.slice(0, -1))];
        switch (timeType) {
            case 'h':
                milliseconds += time * 1000 * 60 * 60;
            break;
            case 'm':
                milliseconds += time * 1000 * 60;
            break;
            case 's':
                milliseconds += time * 1000;
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
