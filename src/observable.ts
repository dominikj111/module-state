import { same, CompareType } from "simple-comparator";

const errorMessages = {
	constructorTypeMismatch: "Constructor's argument value type is not compatible with expected type",
	setTypeMismatch: "Setter's argument value type is not compatible with expected type",
	dataTypeOriginMismatch: "Data type of the origin value is not compatible with the provided value",
};

export interface Observable<T extends CompareType> {}

export class ObservableState<T extends CompareType> implements Observable<T> {
	private value: T;
	private valueHasBeenUpdated = false;
	private onChangeCallbacks: ((_: T) => void)[] = [];

	constructor(value: T) {
		if (value === undefined || value === null || typeof value === "symbol") {
			throw new Error(errorMessages.constructorTypeMismatch);
		}

		if (!Array.isArray(value) && typeof value === "object") {
			const handler = {
				get: (target, key) => {
					if (typeof target[key] === "object" && target[key] !== null) {
						return new Proxy(target[key], handler);
					}
					return target[key];
				},
				set: (target, prop, value) => {
					target[prop] = value;
					this.triggerOnChange(this.value);
					return true;
				},
			};
			this.value = new Proxy(value, handler);
		} else {
			this.value = value;
		}
	}

	set(value: T): void {
		if (value === undefined || value === null || typeof value === "symbol") {
			throw new Error(errorMessages.setTypeMismatch);
		}

		this.confirmOriginDataType(value);

		if (same(value, this.value)) {
			return;
		}

		this.value = value;
		this.valueHasBeenUpdated = true;

		this.triggerOnChange(value);
	}

	get(): T {
		return this.value;
	}

	hasBeenUpdated(): boolean {
		return this.valueHasBeenUpdated;
	}

	typeOf(type: string): boolean {
		return typeof this.value === type;
	}

	instanceOf(classType): boolean {
		return this.value instanceof classType;
	}

	onChange(callback: (_: T) => void): () => void {
		const callbackIndex = this.onChangeCallbacks.length;
		this.onChangeCallbacks.push(callback);
		return () => {
			this.onChangeCallbacks.splice(callbackIndex, 1);
		};
	}

	next(): Promise<T> {
		return new Promise(resolve => {
			const remover = this.onChange(_ => {
				resolve(_);
				remover();
			});
		});
	}

	private confirmOriginDataType(value: T): void {
		if (typeof value !== typeof this.value) {
			throw new Error(errorMessages.dataTypeOriginMismatch);
		}

		if (this.value?.constructor.name !== value?.constructor.name) {
			throw new Error(errorMessages.dataTypeOriginMismatch);
		}

		if (
			(!(this.value instanceof String) && value instanceof String) ||
			(this.value instanceof String && !(value instanceof String))
		) {
			throw new Error(errorMessages.dataTypeOriginMismatch);
		}
	}

	private triggerOnChange(value: T): void {
		for (const callback of this.onChangeCallbacks) {
			callback(value);
		}
	}
}
