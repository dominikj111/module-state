<!-- markdownlint-disable MD041 -->

[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.0&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.0&x2=0)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# What is it?

A simple way to export and observe the state of module variable.

The inspiration comes from the case where I needed to "ask" the module about its internal state, but I didn't want to expose such information in the Application context (React Application). Not everything need to be widely available.

This library main purpose is to keep the code lean and in boundaries.

## How to get it on Node.js or Bun

`npm i module-state`, `bun add module-state`

# Problems to solve

As a develoer, I want:

- To read and react on changes of the exported module variable.

```ts
// observableModule.ts
import { Observable } from 'module-state';

export const myModuleVariable1 = new Observable(-1);
export const myModuleVariable2 = new Observable("Hello");
export const myModuleVariable3 = new Observable<T>({ a: 1 }); // only objects which can be stringified
export const myModuleVariable4 = new Observable(true);

try {
    new Observable(undefined); // throws an error
} catch (e) {  console.err("undefined is not accepted"); }

try {
    new Observable(null); // throws an error
} catch (e) {  console.err("null is not accepted"); }

export function doSomething(value: number) {
    myModuleVariable1.set(value);
    myModuleVariable3.set({ a: 1, b: [1, 2, value] })
}
```

```ts
// otherModule.ts
import { 
    myModuleVariable1, 
    myModuleVariable2, 
    myModuleVariable3, 
    myModuleVariable4, 
    doSomething 
} from './observableModule';

myModuleVariable1.onChange(v => console.log(`myModuleVariable1 is now set to ${v}`));

console.log(myModuleVariable2.get() + " world");
console.log(myModuleVariable2.hasBeenUpdated() ? "myModuleVariable2 is initial" : "");

myModuleVariable3.next()
    .then(v => 
        console.log(
            `myModuleVariable3 b[2] contains ${v.b[2]}`, 
            myModuleVariable3.hasBeenUpdated() ? "" : " and it is not initial"
        )
    );

console.log(myModuleVariable3.hasBeenUpdated() ? "myModuleVariable3 is initial" : "");

doSomething(23);

console.log(myModuleVariable2.typeOf());
console.log(myModuleVariable2.initialOf(String) === String);

/** It will print:
 * 
 * "Hello world"
 * "myModuleVariable2 is initial"
 * "myModuleVariable3 is initial"
 * "myModuleVariable1 is now set to 23"
 * "myModuleVariable3 b[2] contains 23 and it is not 
 * "String"
 * true
 */
```

# Possible improvements when needed

:black_square_button: Add bundling to import from CDN (vanilla js) -> umd, esm

:black_square_button: Improve Continuous Integration

:black_square_button: Add Changelog, Code of Conduct

:black_square_button: Automatic testing and linting

:black_square_button: Read only (block the object's setter).

:black_square_button: Allow to pass an object with the 'onChange' method. This become read only automatically as the reference will be immutable. Also we may avoid any safety checks as to detect any changes is passed object responsibility. In this case, when onChange is triggered, the Observable will return true as a result of hasBeenUpdated method call.

:black_square_button: Allow to pass a replacer function as the second argument. The replacer function allows you to transform or filter the values which are not accepted now because they cannot be stringified by JSON.stringify function.

:black_square_button: Allow to ommit safety checks, so there can be stored an object with circular dependency (non serializable), BitInt or Symbol values. To support this, the check function (kind of) is needed to pass. This may be same as replacer function mentioned in previous improvement. This also need to be reflected in the comparison process (what detects changes).
