// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ObservableState } = require("..");

test("`ObservableState` is available in Node.js runtime and works well", async () => {
	const observable = new ObservableState(0);

	observable.onChange(_ => {
		expect(_).toBe(2);
	});

	observable.set(2);
});
