export default class TimeElapsed {
	constructor() {
		this.start = Date.now();
	}
	print(msg) {
		const elapsed = Date.now() - this.start;
		//console.log(msg, (elapsed / 1000).toFixed(1) + 's');
	}
}
