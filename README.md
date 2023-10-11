<!-- markdownlint-disable MD041 -->

[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.0&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.0&x2=0)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# What is it?

A simple way to export and observe the state of module variables.

## How to get it on Node.js or Bun

`npm i module-state`, `bun add module-state`

# Problems to solve

As a develoer, I want:

- To read and react on changes of the exported module variable.

```ts
// observableModule.ts
import { observable } from 'module-state';

export const myModuleVariable1 = observable(-1);
export const myModuleVariable2 = observable("Hello");
export const myModuleVariable3 = observable<T>({ a: 1 }); // only objects which can be stringified
export const myModuleVariable4 = observable(true);

try {
    observable(undefined); // throws an error
} catch (e) {  console.err("undefined is not accepted"); }

try {
    observable(null); // throws an error
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
console.log(myModuleVariable2.isInitialValue() ? "myModuleVariable2 is initial" : "");

myModuleVariable3.next()
    .then(v => 
        console.log(
            `myModuleVariable3 b[2] contains ${v.b[2]}`, 
            myModuleVariable3.isInitialValue() ? "" : " and it is not initial"
        )
    );

console.log(myModuleVariable3.isInitialValue() ? "myModuleVariable3 is initial" : "");

doSomething(23);

/** It will print:
 * 
 * "Hello world"
 * "myModuleVariable2 is initial"
 * "myModuleVariable3 is initial"
 * "myModuleVariable1 is now set to 23"
 * "myModuleVariable3 b[2] contains 23 and it is not initial"
 */
```

# Possible improvements when needed

:black_square_button: Add bundling to import from CDN (vanilla js) -> umd, esm

:black_square_button: Improve Continuous Integration

:black_square_button: Add Changelog, Code of Conduct

:black_square_button: Automatic testing and linting
