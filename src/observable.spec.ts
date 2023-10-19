import { ObservableState, Observable } from "./observable";

describe("Observable class", () => {
	describe("Accepts single basic data type argument in it's contructor", () => {
		it("Accepts a simple data type value what can by serialized by JSON.stringify as an argument in it's constructor", () => {
			expect(() => {
				new ObservableState(-1);
				new ObservableState("");
				new ObservableState({});
				new ObservableState(true);
				new ObservableState(Number(0));
				new ObservableState(BigInt(0));
			}).not.toThrow();
		});

		it("Throws an error when undefined is passed as an argument", () => {
			expect(() => {
				new ObservableState(undefined);
			}).toThrow();
		});

		it("Throws an error when null is passed as an argument", () => {
			expect(() => {
				new ObservableState(null);
			}).toThrow();
		});

		it("Throws an error when Symbol is passed as an argument", () => {
			expect(() => {
				new ObservableState(Symbol());
			}).toThrow();
		});
	});

	describe("Offers an interface to get basic informations", () => {
		it("Allows to set and get current state", () => {
			const observable = new ObservableState(-1);
			observable.set(42);
			expect(observable.get()).toBe(42);
		});

		it("`set` throws when passing undefined, null or Symbol same as the constructor", () => {
			const observable = new ObservableState<unknown>({});
			expect(() => observable.set(undefined)).toThrow();
			expect(() => observable.set(null)).toThrow();
			expect(() => observable.set(Symbol())).toThrow();
		});

		it("`get` returns same type/instance as provided", () => {
			expect(new ObservableState(new Number(4)).get() instanceof Number).toBe(true);
			expect(typeof new ObservableState("").get()).toBe("string");
			expect(typeof new ObservableState({}).get()).toBe("object");
		});

		it("`get` returns an object reference", () => {
			const obj = { a: "", b: [1, 2] };
			const observableReference = new ObservableState(obj);
			const observableShallowCopy = new ObservableState({ ...obj });

			expect(observableReference.get()).toEqual(obj);
			obj.a = "a";
			expect(observableReference.get()).toEqual(obj);

			observableShallowCopy.get().b.push(3);
			observableShallowCopy.get().a = "b";
			expect(obj.b.length).toBe(3);
			expect(obj.a).toBe("a");
		});

		it("Doesn't allow to set other than origin data type", () => {
			expect(() => {
				// @ts-expect-error: Argument of type 'string' is not assignable to parameter of type 'number' is ok for testing.
				new ObservableState(-1).set("");
			}).toThrow();

			expect(() => {
				// @ts-expect-error: Argument of type 'number' is not assignable to parameter of type 'string' is ok for testing.
				new ObservableState("").set(3);
			}).toThrow();

			expect(() => {
				// @ts-expect-error: Argument of type 'boolean' is not assignable to parameter of type 'string' is ok for testing.
				new ObservableState("").set(true);
			}).toThrow();

			expect(() => {
				// @ts-expect-error: Argument of type '{}' is not assignable to parameter of type 'boolean' is ok for testing.
				new ObservableState(true).set({});
			}).toThrow();

			expect(() => {
				new ObservableState({}).set([]);
			}).toThrow();

			expect(() => {
				// @ts-expect-error: Argument of type '{}' is not assignable to parameter of type 'never[]' is ok for testing.
				new ObservableState([]).set({});
			}).toThrow();

			expect(() => {
				// @ts-expect-error: Argument of type 'number' is not assignable to parameter of type 'never[]' is ok for testing.
				new ObservableState([]).set(4);
			}).toThrow();

			expect(() => {
				new ObservableState({}).set(4);
			}).toThrow();

			expect(() => {
				new ObservableState({}).set(Number(3));
			}).toThrow();

			expect(() => {
				new ObservableState({}).set(new String("text"));
			}).toThrow();

			expect(() => {
				// @ts-expect-error: Argument of type 'String' is not assignable to parameter of type 'string'. Ok for testing.
				new ObservableState("").set(new String("text"));
			}).toThrow();

			expect(() => {
				new ObservableState(new String("text")).set("text");
			}).toThrow();

			expect(() => {
				new ObservableState(new Number(4)).set(1);
			}).toThrow();

			expect(() => {
				new ObservableState(new Boolean(1)).set(false);
			}).toThrow();
		});

		it("Informs if the setter was called", () => {
			const observable = new ObservableState(-1);
			expect(observable.hasBeenUpdated()).toBe(false);
			observable.set(42);
			expect(observable.hasBeenUpdated()).toBe(true);
		});

		it("Contains `typeOf` method returning the result of vanilla js/ts `typeof`", () => {
			const observable = new ObservableState(true);
			expect(observable.typeOf("boolean")).toBe(true);

			const observableNumber = new ObservableState(Number(3));
			expect(observableNumber.typeOf("number")).toBe(true);

			const observableArray = new ObservableState([]);
			expect(observableArray.typeOf("object")).toBe(true);
		});

		it("Contains `instanceOf` method returning correct result for Number/number as the vanilla js `instanceof`", () => {
			const observableNumberObject = new ObservableState(Number(3));
			// @ts-expect-error; The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter. Ok for testing.
			expect(observableNumberObject.instanceOf(Number)).toBe(observableNumberObject.get() instanceof Number);

			const observableSimpleNumber = new ObservableState(3);
			expect(observableSimpleNumber.instanceOf(Number)).toBe(false);
		});

		it("Contains `instanceOf` method returning correct result for String/string as the vanilla js `instanceof`", () => {
			const observableStringObject = new ObservableState(new String("Some text"));
			expect(observableStringObject.instanceOf(String)).toBe(observableStringObject.get() instanceof String);
			expect(observableStringObject.instanceOf(String)).toBe(true);

			const observableSimpleString = new ObservableState("Some text");
			// @ts-expect-error; The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter. Ok for testing.
			expect(observableSimpleString.instanceOf(String)).toBe(observableSimpleString.get() instanceof String);
			expect(observableSimpleString.instanceOf(String)).toBe(false);
		});

		it("Contains `instanceOf` method returning correct result for Boolean/true/false as the vanilla js `instanceof`", () => {
			const observableBooleanTrueObject = new ObservableState(Boolean(1));
			expect(observableBooleanTrueObject.instanceOf(Boolean)).toBe(
				// @ts-expect-error; The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter. Ok for testing.
				observableBooleanTrueObject.get() instanceof Boolean,
			);

			const observableBooleanFalseObject = new ObservableState(Boolean(1));
			expect(observableBooleanFalseObject.instanceOf(Boolean)).toBe(
				// @ts-expect-error; The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter. Ok for testing.
				observableBooleanFalseObject.get() instanceof Boolean,
			);

			const observableTrue = new ObservableState(true);
			expect(observableTrue.instanceOf(Boolean)).toBe(false);

			const observableFalse = new ObservableState(false);
			expect(observableFalse.instanceOf(Boolean)).toBe(false);
		});

		it("Contains `instanceOf` method returning correct result for class object as the vanilla js `instanceof`", () => {
			class SomeClass {}
			const objectOfSomeClass = new ObservableState(new SomeClass());
			expect(objectOfSomeClass.instanceOf(SomeClass)).toBe(true);
		});
	});

	// describe("recognizes object's changes well", () => {
		// it contains own object comparison utility
		// copy the comparison from cache-wave, make it as dedicated npm module
	// });

	// describe("accepts only simple data types and simple objects what can by serialized by JSON.stringify function", () => {
		// it will recongise circular dependencies
		// the object has to be serialized by JSON.stringify so any difference between deserialized and initial will throws
	// });

	// describe("can be limited or locked against other modifications", () => {
	// 	it("throws when trying to modify sealed Observable", () => {
	// 		const observable = new ObservableState(-1);
	// 		observable.seal();
	// 		expect(() => observable.set(42)).toThrow();
	// 	});

	// 	it("throws when trying to modify read only Observable", () => {
	// 		const observable = new ObservableState(-1).readOnly();
	// 		expect(() => observable.set(42)).toThrow();
	// 	});

	// 	it("isReadOnly method returns true when the Observable is read only", () => {
	// 		const observable = new ObservableState(-1);
	// 		expect(observable.isReadOnly()).toBe(false);
	// 		observable.readOnly();
	// 		expect(observable.isReadOnly()).toBe(true);
	// 	});

	// 	it("isReadOnly method returns true when the Observable is sealed", () => {
	// 		const observable = new ObservableState(-1);
	// 		expect(observable.isReadOnly()).toBe(false);
	// 		observable.seal();
	// 		expect(observable.isReadOnly()).toBe(true);
	// 	});

	// 	it("seal method returns Observable mediator what can be modified", () => {
	// 		const observable = new ObservableState(-1);
	// 		const childObservable = observable.seal();

	// 		expect(observable.isReadOnly()).toBe(true);
	// 		expect(childObservable.isReadOnly()).toBe(false);

	// 		expect(() => {
	// 			observable.set(42);
	// 		}).toThrow();

	// 		expect(() => {
	// 			childObservable.set(42);
	// 		}).not.toThrow();
	// 	});

	// 	it("seal method returns Observable mediator what control it's parent Observable", () => {
	// 		const observable = new ObservableState(-1);
	// 		const childObservable = observable.seal();

	// 		expect(observable instanceof Observable).toBe(true);
	// 		expect(childObservable instanceof Observable).toBe(true);

	// 		childObservable.set(42);
	// 		expect(observable.get()).toBe(42);
	// 	});

	// 	it("seal method can be called only once", () => {
	// 		const observable = new ObservableState(-1);
	// 		observable.seal();
	// 		expect(() => observable.seal()).toThrow();
	// 	});

	// 	it("readOnly method can be called any number of times", () => {
	// 		const observable = new ObservableState(-1);
	// 		observable.readOnly();
	// 		expect(() => observable.readOnly()).not.toThrow();
	// 	});

	// 	it("blocks any changes of an object value when read only (immutable value)", () => {
	// 		// get return cloned copy of an object, so nobody cat change by reference
	// 		// set compares against the original value, so nobody can change by setter
	// 	});

	// 	it("seal method returns stricly editable Observable, so no next seal, readOnly calls are allowed", () => {
	// 		const observable = new ObservableState("").seal();
	// 		expect(() => observable.readOnly()).toThrow();
	// 		expect(() => observable.seal()).toThrow();
	// 	});

	// 	it("has strictlyEditable method what blocks readOnly and seal method calls", () => {
	// 		const observable = new ObservableState("").strictlyEditable();
	// 		expect(observable.isReadOnly()).toBe(false);
	// 		expect(() => observable.readOnly()).toThrow();
	// 		expect(() => observable.seal()).toThrow();
	// 	});

	// 	it("seal cannot be called upon read only Observable", () => {});

	// 	it("strictlyEditable cannot be called if the Observable is read only", () => {});
	// });

	it("Triggers the onChange event when setter has been called", () => {
		const observable = new ObservableState(-1);
		const callback = jest.fn();
		observable.onChange(callback);
		observable.set(42);
		expect(callback).toHaveBeenCalledWith(42);
	});

	it("Allow to remove onChange reaction", () => {
		const observable = new ObservableState(-1);

		const callback1 = jest.fn();
		const callback2 = jest.fn();
		const callback3 = jest.fn();

		observable.onChange(callback1);
		const remover2 = observable.onChange(callback2);
		const remover3 = observable.onChange(callback3);

		observable.set(42);
		remover3();
		observable.set(41);
		remover2();
		observable.set(40);

		expect(callback1).toHaveBeenCalledTimes(3);
		expect(callback2).toHaveBeenCalledTimes(2);
		expect(callback3).toHaveBeenCalledTimes(1);
	});

	it("Allows to react on Promise when setter has been called", done => {
		const observable = new ObservableState(-1);

		observable.next().then(value => {
			expect(value).toBe(42);
			done();
		});

		observable.set(42);
	});
});
