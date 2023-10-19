const errorMessages = {
	constructorTypeMismatch: "Constructor's argument value type is not compatible with expected type",
	setTypeMismatch: "Setter's argument value type is not compatible with expected type",
	dataTypeOriginMismatch: "Data type of the origin value is not compatible with the provided value",
};

export interface Observable<T> {}

export class ObservableState<T> implements Observable<T> {
	private value: T;
	private valueHasBeenUpdated: boolean = false;
	private onChangeCallbacks: ((_: T) => void)[] = [];

	constructor(value: T) {
		if (value === undefined || value === null || typeof value === "symbol") {
			throw new Error(errorMessages.constructorTypeMismatch);
		}
		this.value = value;
	}

	set(value: T): void {
		if (value === undefined || value === null || typeof value === "symbol") {
			throw new Error(errorMessages.setTypeMismatch);
		}

		this.confirmOriginDataType(value);

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
