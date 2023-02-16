const getArgs = (args: string[]): Record<string, string | boolean> => {
    const res: Record<string, string | boolean> = {};
    const [, , ...rest] = args;
    rest.forEach((value, index, arr) => {
        if (value.charAt(0) === '-') {
            if (index === arr.length - 1) {
                res[value.slice(1)] = true;
            } else if (arr[index + 1].charAt(0) != '-') {
                res[value.slice(1)] = arr[index + 1]
            } else {
                res[value.slice(1)] = true;
            }
        }
    });
    return res;
}

export default getArgs;