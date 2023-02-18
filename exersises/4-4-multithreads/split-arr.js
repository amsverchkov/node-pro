
const splitArr = (initArr, chunks) => {
    let subarray = []; //массив в который будет выведен результат.
    const sliceLength = Math.ceil(initArr.length / chunks);
    for (let i = 0; i < chunks; i++) {
        if (i === chunks - 1) {
            subarray[i] = initArr.slice((i * sliceLength))
        } else {
            subarray[i] = initArr.slice((i * sliceLength), (i * sliceLength) + sliceLength);
        }

    }
    return subarray;
}

module.exports = splitArr;
