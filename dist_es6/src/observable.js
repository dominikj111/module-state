import { same } from "simple-comparator";
const errorMessages = {
    constructorTypeMismatch: "Constructor's argument value type is not compatible with expected type",
    setTypeMismatch: "Setter's argument value type is not compatible with expected type",
    dataTypeOriginMismatch: "Data type of the origin value is not compatible with the provided value",
};
export class ObservableState {
    value;
    valueHasBeenUpdated = false;
    onChangeCallbacks = [];
    constructor(value) {
        if (value === undefined || value === null || typeof value === "symbol") {
            throw new Error(errorMessages.constructorTypeMismatch);
        }
        this.value = value;
    }
    set(value) {
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
    get() {
        return this.value;
    }
    hasBeenUpdated() {
        return this.valueHasBeenUpdated;
    }
    typeOf(type) {
        return typeof this.value === type;
    }
    instanceOf(classType) {
        return this.value instanceof classType;
    }
    onChange(callback) {
        const callbackIndex = this.onChangeCallbacks.length;
        this.onChangeCallbacks.push(callback);
        return () => {
            this.onChangeCallbacks.splice(callbackIndex, 1);
        };
    }
    next() {
        return new Promise(resolve => {
            const remover = this.onChange(_ => {
                resolve(_);
                remover();
            });
        });
    }
    confirmOriginDataType(value) {
        if (typeof value !== typeof this.value) {
            throw new Error(errorMessages.dataTypeOriginMismatch);
        }
        if (this.value?.constructor.name !== value?.constructor.name) {
            throw new Error(errorMessages.dataTypeOriginMismatch);
        }
        if ((!(this.value instanceof String) && value instanceof String) ||
            (this.value instanceof String && !(value instanceof String))) {
            throw new Error(errorMessages.dataTypeOriginMismatch);
        }
    }
    triggerOnChange(value) {
        for (const callback of this.onChangeCallbacks) {
            callback(value);
        }
    }
}
//# sourceMappingURL=observable.js.map