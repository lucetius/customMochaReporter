var Mochawesome = require('mochawesome');
var MochaJUnitReporter = require('mocha-junit-reporter');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = CustomMochaReporter;

function CustomMochaReporter (runner, options) {
    var opts = this.getCustomOptions(options);
    var artifactsDir = _.get(options, 'reporterOptions.artifactsDir', '');
    if (artifactsDir) { artifactsDir += '/'; }

    var awesomeOptions = _.clone(options);
    opts.awesomeOptions.reporterOptions.reportDir = artifactsDir + opts.awesomeOptions.reporterOptions.reportDir;
    awesomeOptions.reporterOptions = opts.awesomeOptions.reporterOptions;
    Mochawesome(runner, awesomeOptions);

    var jUnitOptions = _.clone(options);
    opts.jUnitOptions.reporterOptions.mochaFile = artifactsDir + opts.jUnitOptions.reporterOptions.mochaFile;
    jUnitOptions.reporterOptions = opts.jUnitOptions.reporterOptions;
    new MochaJUnitReporter(runner, jUnitOptions);
}

CustomMochaReporter.prototype.getCustomOptions = function (options) {
    var customOptionsFile = _.get(options, 'reporterOptions.configFile');
    var customOptions;
    if (customOptionsFile) {
        customOptionsFile = path.resolve(customOptionsFile);

        customOptions = fs.readFileSync(customOptionsFile).toString();

        try {
            customOptions = JSON.parse(customOptions);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }

    return customOptions;
};
