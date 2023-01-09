function factorial(n) {
	if (n == 1 || n == 0) {
		return 1;
	}
	return factorial(n - 1) * n;
}

function compute({ arr }) {
	const tmpArr = [];
	for (let i = 0; i < 100000000; i++) {
		tmpArr.push(i * i);
	}
	return arr.map(el => factorial(el));
};


module.exports = {factorial, compute}