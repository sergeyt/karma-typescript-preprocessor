# karma-typescript-preprocessor

> Preprocessor to compile TypeScript on the fly.

[![Build Status](https://travis-ci.org/sergeyt/karma-typescript-preprocessor.svg?branch=master)](https://travis-ci.org/sergeyt/karma-typescript-preprocessor)
[![Deps Status](https://david-dm.org/sergeyt/karma-typescript-preprocessor.png)](https://david-dm.org/sergeyt/karma-typescript-preprocessor)
[![devDependency Status](https://david-dm.org/sergeyt/karma-typescript-preprocessor/dev-status.svg)](https://david-dm.org/sergeyt/karma-typescript-preprocessor#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/karma-typescript-preprocessor.svg?maxAge=2592000)](https://www.npmjs.com/package/karma-typescript-preprocessor)

## Installation

```bash
npm install karma-typescript-preprocessor --save-dev
```

## Configuration

The code below shows the sample configuration of the preprocessor.
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.ts': ['typescript']
    },

    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
        sourceMap: false, // (optional) Generates corresponding .map file.
        target: 'ES5', // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
        module: 'amd', // (optional) Specify module code generation: 'commonjs' or 'amd'
        noImplicitAny: true, // (optional) Warn on expressions and declarations with an implied 'any' type.
        noResolve: true, // (optional) Skip resolution and preprocessing.
        removeComments: true, // (optional) Do not emit comments to output.
        concatenateOutput: false // (optional) Concatenate and emit output to single file. By default true if module option is omited, otherwise false.
      },
      // transforming the filenames
      transformPath: function(path) {
        return path.replace(/\.ts$/, '.js');
      }
    }
  });
};
```

If you set the `sourceMap` option to `true` then the generated source map will be inlined as a data-uri.

All TypeScript compiler options are defined [here](https://github.com/Microsoft/TypeScript/blob/0f67f4b6f1589756906782f1ac02e6931e1cff13/lib/typescript.d.ts#L1445-L1500).

----

For more information on Karma see the [homepage](http://karma-runner.github.com).

