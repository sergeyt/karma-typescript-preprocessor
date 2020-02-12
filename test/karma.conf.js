module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: "",

    // frameworks to use
    frameworks: ["jasmine"],

    preprocessors: {
      "*.ts": ["typescript"]
    },

    typescriptPreprocessor: {
      options: {
        sourceMap: true
      }
    },

    files: ["*.ts"],

    // list of files to exclude
    exclude: [],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ["dots"],

    // web server port
    port: 9873,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    browsers: ["ChromeX"],

    customLaunchers: {
      ChromeX: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"]
      }
    },

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    plugins: ["karma-jasmine", "karma-chrome-launcher", require("../index.js")]
  });
};
