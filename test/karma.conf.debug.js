module.exports = function(config) {
  // apply base config
  require('./karma.conf.js')(config);

  config.set({
    browsers: ['Chrome'],
    singleRun: false,
  });
};
