<!-- markdownlint-disable MD041 -->

[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.0&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.0&x2=0)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

## What is it?

A simple way to export and observe the state of module variable.

The inspiration comes from the case where I needed to "ask" the module about its internal state, but I didn't want to
expose such information in the Application context (React Application). Not everything need to be widely available.

This library main purpose is to keep the code lean and in boundaries.

## How to get it on Node.js or Bun

`npm i module-state`, `bun add module-state`

## As a developer, I want

### To read and set the exported module variable (both way communication)

```ts
// someModuleWithExportedObservable.ts
import { Observable } from "module-state";

export const moduleVariable = new Observable("");

moduleVariable.set("Hello");
```

```ts
// otherModule.ts
import { moduleVariable } from "./someModuleWithExportedObservable";

if (moduleVariable.hasBeenUpdated()) {
    console.log("moduleVariable has been modified");
}

moduleVariable.set(`${moduleVariable.get()} world!`);

console.log(moduleVariable.get());

/** It will print:
 *
 * "moduleVariable has been modified"
 * "Hello world!"
 */
```

### To lock the object against changes

```ts
import { Observable } from "module-state";

export const moduleVariable = new Observable(true).readOnly();

try {
    moduleVariable.set(false); // throws an error
} catch (e) {
    console.log("read only Observable cannot be set");
}

/** It will print:
 *
 * "read only Observable cannot be set"
 */
```

### To lock the object but allow internal changes

```ts
// someModuleWithExportedObservable.ts
import { Observable } from "module-state";

export const moduleVariable = new Observable(3);

const editableModuleVariable = moduleVariable.seal();

export function doSomething(value: number) {
    editableModuleVariable.set(2 * value);
}
```

```ts
// otherModule.ts
import { moduleVariable, doSomething } from "./someModuleWithExportedObservable";

if (moduleVariable.isReadOnly()) {
    console.log("moduleVariable is read only variable");
}

console.log(`moduleVariable is set to ${moduleVariable.get()}`);

try {
    moduleVariable.set(4);
} catch (e) {
    console.log("moduleVariable cannot be externally set");
}

doSomething(5);

console.log(`moduleVariable is set to ${moduleVariable.get()}`);

/** It will print:
 *
 * "moduleVariable is read only variable"
 * "moduleVariable is set to 3"
 * "moduleVariable cannot be externally set"
 * "moduleVariable is set to 10"
 */
```

### To wait until next "promised" modifitication

```ts
import { Observable } from "module-state";

export const moduleVariable = new Observable({ a: 1, b: [1, 2] });

moduleVariable.next().then(v => console.log(`moduleVariable b[2] contains ${v.b[v.b.length - 1]}`));

moduleVariable.get().b.push() = 123;
moduleVariable.get().b.push() = 124;

/** It will print:
 *
 * "moduleVariable b[2] contains 123"
 */
```

### To react on any modification

```ts
import { Observable } from "module-state";

export const moduleVariable = new Observable({ a: 1, b: [1, 2] });

moduleVariable.onChange(v => console.log(`moduleVariable b[2] contains ${v.b[2]}`));

moduleVariable.get().b.push() = 123;
moduleVariable.get().b[2] = 124;
moduleVariable.set({ a: 1, b: [1, 2, 125] });

/** It will print:
 *
 * "moduleVariable b[2] contains 123"
 * "moduleVariable b[2] contains 124"
 * "moduleVariable b[2] contains 125"
 */
```

### To call `typeOf` and `instanceOf` methods upon the Observable's value

```ts
import { Observable } from "module-state";

const moduleVariableNumber = new Observable(Number(3));
const moduleVariableString = new Observable("Hello");

console.log(moduleVariableNumber.typeOf());
console.log(moduleVariableNumber.instanceOf(Number));

console.log(moduleVariableString.typeOf());
console.log(moduleVariableString.instanceOf(String));

/**
 * It will print:
 *
 * "number"
 * true
 * "string"
 * true
 */
```

## The other nuances

### `get` returns

```ts
typeof newnew Observable("").get() === "string";
typeof new Observable(-1).get() === "number";
Observable(new Number(2)).get() instanceof Number;
typeof new Observable(true).get() === "boolean";

// returns a reference to the object
typeof new Observable({ a: "", b: [1, 2] }).get() === "object";
```

### The Observable is strictly typed

```ts
try {
    new Observable(-1).set("");
} catch (e) {
    console.log("Numeric Observable cannot be set as a string");
}

try {
    new Observable(true).set({});
} catch (e) {
    console.log("Boolean Observable cannot be set an object");
}

// not any type checking is performed for objects at runtime
new Observable({}).set({ a: 4, b: ["1a", "2a", "3a"] });

/** It will print:
 *
 * "Numeric Observable cannot be set as a string"
 * "Boolean Observable cannot be set an object"
 */
```

### `strictlyEditable` method will not allow to mark the Observable as read only. So nobody will change the Observable's behaviour

```ts
export const moduleVariable = new Observable("").strictlyEditable();

try {
    moduleVariable.readOnly();
} catch (e) {
    console.log("strictlyEditable Observable cannot be set as read only");
}

try {
    moduleVariable.seal();
} catch (e) {
    console.log("strictlyEditable Observable cannot be sealed");
}

moduleVariable.isReadOnly() === false;
```

### `seal` method returns strictlyEditable Observable

```ts
const moduleVariable = new Observable("");
const editableModuleVariable = moduleVariable.seal();

try {
    editableModuleVariable.readOnly();
} catch (e) {
    console.log("strictlyEditable Observable cannot be set as read only");
}
```

### If the Observable is read only, it will throw an error when `seal` is called upon it

```ts
const moduleVariable = new Observable("").readOnly();

try {
    moduleVariable.seal();
} catch (e) {
    console.log("read only Observable cannot be sealed");
}
```

### If the Observable is read only, `readOnly` method may be called without any errors multiple times

```ts
const moduleVariable = new Observable("").readOnly();

moduleVariable.readOnly();
moduleVariable.readOnly();
moduleVariable.readOnly();
```

### Initial value has to be defined (not null nor undefined is allowed)

```ts
import { Observable } from "module-state";

try {
    new Observable(undefined); // throws an error
} catch (e) {
    console.log("undefined is not accepted as an initial value");
}

try {
    new Observable(null); // throws an error
} catch (e) {
    console.log("null is not accepted as an initial value");
}

/** It will print:
 *
 * "undefined is not accepted as an initial value"
 * "null is not accepted as an initial value"
 */
```

## Possible improvements when needed

:black_square_button: Add bundling to import from CDN (vanilla js) -> umd, esm

:black_square_button: Improve Continuous Integration

:black_square_button: Add Changelog, Code of Conduct

:black_square_button: Automatic testing and linting

:black_square_button: Allow to pass class/function object with it's own onChange method. This become read only (sealed)
automatically (Object changes will be done through object's properties). In this case, when onChange is triggered, the
Observable will return true as a result of hasBeenUpdated method call. `get` returns reference to the object itself in
this case.

:black_square_button: Allow to pass a replacer function as the second argument. The replacer function allows you to
transform or filter the values which are not accepted now because they cannot be stringified by JSON.stringify function.
