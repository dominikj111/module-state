import { Observable } from "./observable";

describe("Observable class", () => {
	describe("accepts single argument in it's contructor", () => {
		it("should accept a simple data type value as an argument in it's constructor", () => {
			expect(() => {
				new Observable(-1);
				new Observable("");
				new Observable({});
				new Observable(true);
			}).not.toThrow();
		});

		it("should throw an error when undefined is passed as an argument", () => {
			expect(() => {
				new Observable(undefined);
			}).toThrow();
		});

		it("should throw an error when null is passed as an argument", () => {
			expect(() => {
				new Observable(null);
			}).toThrow();
		});

		it("should throw an error when Symbol is passed as an argument", () => {
			expect(() => {
				new Observable(Symbol());
			}).toThrow();
		});

		it("should throw an error when BigInt is passed as an argument", () => {
			expect(() => {
				new Observable(BigInt(0));
			}).toThrow();
		});
	});

	describe("offers an interface to get basic information", () => {
		it("should allow setting and getting the current state", () => {
			const observable = new Observable(-1);
			observable.set(42);
			expect(observable.get()).toBe(42);
		});

		it("should inform if the setter was called, so the passed value is the initial still", () => {
			const observable = new Observable(-1);
			expect(observable.hasBeenUpdated()).toBe(false);
			observable.set(42);
			expect(observable.hasBeenUpdated()).toBe(true);
		});

		it("should return the result of `typeof` function", () => {
			const observable = new Observable(true);
			expect(observable.typeOf()).toBe("boolean");
		});

		it("should return the result of `instanceof` function", () => {
			const observable = new Observable("");
			expect(observable.instanceOf(String)).toBe(true);
		});
	});

	it("triggers the onChange event when setter has been called", () => {
		const observable = new Observable(-1);
		const callback = jest.fn();
		observable.onChange(callback);
		observable.set(42);
		expect(callback).toHaveBeenCalledWith(42);
	});

	it("allows to react on Promise when setter has been called", done => {
		const observable = new Observable(-1);

		observable.next().then(value => {
			expect(value).toBe(42);
			done();
		});

		observable.set(42);
	});

	describe("recognizes object's changes well", () => {
		// it contains own object comparison utility
		// copy the comparison from cache-wave, make it as dedicated npm module
	});

	describe("accepts only simple data types and simple objects what can by serialized by JSON.stringify function", () => {
		// it will recongise circular dependencies
		// the object has to be serialized by JSON.stringify so any difference between deserialized and initial will throws
	});
});
