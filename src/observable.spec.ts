import { Observable } from "./observable";

describe("Observable class", () => {
	describe("accepts single argument in it's contructor", () => {
		it("should accept a simple data type value as an argument in it's constructor", () => {
			expect(() => {
				new Observable(-1);
				new Observable("");
				new Observable({});
				new Observable(true);
				new Observable(Number(3));
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

		it("should returns from get same type/instance as provided", () => {
			expect(new Observable(new Number(4)).get() instanceof Number).toBe(true);
			expect(typeof new Observable("").get()).toBe("string");
			expect(typeof new Observable({}).get()).toBe("object");
		});

		it("should returns from get object reference", () => {
			const obj = { a: "", b: [1, 2] };
			const observable = new Observable(obj);
			const observable2 = new Observable({ ...obj });

			expect(observable.get()).toEqual(obj);
			obj.a = "a";
			expect(observable.get()).toEqual(obj);

			observable2.get().b.push(3);
			observable2.get().a = "b";
			expect(obj.b.length).toBe(3);
			expect(obj.a).toBe("a");
		});

		it("should inform if the setter was called", () => {
			const observable = new Observable(-1);
			expect(observable.hasBeenUpdated()).toBe(false);
			observable.set(42);
			expect(observable.hasBeenUpdated()).toBe(true);
		});

		it("should return the result of `typeof`", () => {
			const observable = new Observable(true);
			expect(observable.typeOf()).toBe("boolean");

			const observableNumber = new Observable(Number(3));
			expect(observableNumber.typeOf()).toBe("number");
		});

		it("should return the result of `instanceof`", () => {
			const observable = new Observable("");
			expect(observable.instanceOf(String)).toBe(true);

			const observableNumber = new Observable(Number(3));
			expect(observableNumber.instanceOf(Number)).toBe(true);
		});
	});

	describe("recognizes object's changes well", () => {
		// it contains own object comparison utility
		// copy the comparison from cache-wave, make it as dedicated npm module
	});

	describe("accepts only simple data types and simple objects what can by serialized by JSON.stringify function", () => {
		// it will recongise circular dependencies
		// the object has to be serialized by JSON.stringify so any difference between deserialized and initial will throws
	});

	describe("can be limited or locked against other modifications", () => {
		it("throws when trying to modify sealed Observable", () => {
			const observable = new Observable(-1);
			observable.seal();
			expect(() => observable.set(42)).toThrow();
		});

		it("throws when trying to modify read only Observable", () => {
			const observable = new Observable(-1).readOnly();
			expect(() => observable.set(42)).toThrow();
		});

		it("isReadOnly method returns true when the Observable is read only", () => {
			const observable = new Observable(-1);
			expect(observable.isReadOnly()).toBe(false);
			observable.readOnly();
			expect(observable.isReadOnly()).toBe(true);
		});

		it("isReadOnly method returns true when the Observable is sealed", () => {
			const observable = new Observable(-1);
			expect(observable.isReadOnly()).toBe(false);
			observable.seal();
			expect(observable.isReadOnly()).toBe(true);
		});

		it("seal method returns Observable mediator what can be modified", () => {
			const observable = new Observable(-1);
			const childObservable = observable.seal();

			expect(observable.isReadOnly()).toBe(true);
			expect(childObservable.isReadOnly()).toBe(false);

			expect(() => {
				observable.set(42);
			}).toThrow();

			expect(() => {
				childObservable.set(42);
			}).not.toThrow();
		});

		it("seal method returns Observable mediator what control it's parent Observable", () => {
			const observable = new Observable(-1);
			const childObservable = observable.seal();

			expect(observable instanceof Observable).toBe(true);
			expect(childObservable instanceof Observable).toBe(true);

			childObservable.set(42);
			expect(observable.get()).toBe(42);
		});

		it("seal method can be called only once", () => {
			const observable = new Observable(-1);
			observable.seal();
			expect(() => observable.seal()).toThrow();
		});

		it("readOnly method can be called any number of times", () => {
			const observable = new Observable(-1);
			observable.readOnly();
			expect(() => observable.readOnly()).not.toThrow();
		});

		it("blocks any changes of an object value when read only (immutable value)", () => {
			// get return cloned copy of an object, so nobody cat change by reference
			// set compares against the original value, so nobody can change by setter
		});

		it("seal method returns stricly editable Observable, so no next seal, readOnly calls are allowed", () => {
			const observable = new Observable("").seal();
			expect(() => observable.readOnly()).toThrow();
			expect(() => observable.seal()).toThrow();
		});

		it("has strictlyEditable method what blocks readOnly and seal method calls", () => {
			const observable = new Observable("").strictlyEditable();
			expect(observable.isReadOnly()).toBe(false);
			expect(() => observable.readOnly()).toThrow();
			expect(() => observable.seal()).toThrow();
		});

		it("seal cannot be called upon read only Observable", () => {});

		it("strictlyEditable cannot be called if the Observable is read only", () => {});
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

	it("doesn't allow to set other than origin data type", () => {
		expect(() => {
			// @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'number' is ok for testing.
			new Observable(-1).set("");
		}).toThrow();

		expect(() => {
			// @ts-expect-error: Argument of type 'number' is not assignable to parameter of type 'string' is ok for testing.
			new Observable("").set(3);
		}).toThrow();

		expect(() => {
			// @ts-expect-error: Argument of type '{}' is not assignable to parameter of type 'boolean' is ok for testing.
			new Observable(true).set({});
		}).toThrow();

		expect(() => {
			new Observable({}).set([]);
		}).toThrow();

		expect(() => {
			// @ts-expect-error: Argument of type '{}' is not assignable to parameter of type 'never[]' is ok for testing.
			new Observable([]).set({});
		}).toThrow();

		expect(() => {
			// @ts-expect-error: Argument of type 'number' is not assignable to parameter of type 'never[]' is ok for testing.
			new Observable([]).set(4);
		}).toThrow();

		expect(() => {
			new Observable({}).set(4);
		}).toThrow();
	});
});
