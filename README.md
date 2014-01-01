# karma-typescript-preprocessor [![Build Status][buildstatus]][buildstatusurl] [![Deps Status][depstatus]][depstatusurl]

> Preprocessor to compile TypeScript on the fly.

[![NPM][npm]](https://nodei.co/npm/karma-typescript-preprocessor/)

## Installation

Just write `karma-typescript-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-typescript-preprocessor": "~0.1"
  }
}
```

Or just issue the following command:
```bash
npm install karma-typescript-preprocessor --save-dev
```

## Configuration

The code below shows the default configuration of the preprocessor.
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
        sourceMap: false
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

----

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
[npm]: https://nodei.co/npm/karma-typescript-preprocessor.png?downloads=true&stars=true
[buildstatus]: https://drone.io/github.com/sergeyt/karma-typescript-preprocessor/status.png
[buildstatusurl]: https://drone.io/github.com/sergeyt/karma-typescript-preprocessor/latest
[depstatus]: https://david-dm.org/sergeyt/karma-typescript-preprocessor.png
[depstatusurl]: https://david-dm.org/sergeyt/karma-typescript-preprocessor
