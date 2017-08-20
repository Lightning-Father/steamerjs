"use strict";

/*
*   This plugin is going to check the node environment.
*   Right now we only check if NODE_PATH variable exists
 */

const logSymbols = require('log-symbols'),
	  semver = require('semver'),
	  pluginUtils = require('steamer-pluginutils'),
	  baseVer = "5.0.0";

var chalk = null;

function DoctortPlugin(argv) {
	this.argv = argv;
	this.utils = new pluginUtils("steamerjs");
	chalk = this.utils.chalk;
}

DoctortPlugin.prototype.isNodePathSet = function() {
	let globalNodeModules = this.utils.globalNodeModules;
	return globalNodeModules !== undefined && globalNodeModules !== null && globalNodeModules !== "";
};

DoctortPlugin.prototype.throwNodePathError = function() {
	throw new Error("You must set NODE_PATH correctly!!! Now it's undefined or empty\nYou can visit https://github.com/steamerjs/steamerjs to see how to set NODE_PATH");
};

DoctortPlugin.prototype.isNodeVerRight = function() {
	let version = semver.valid(process.version);

	return semver.gt(version, baseVer);
};

DoctortPlugin.prototype.throwNodeVerError = function() {
	throw new Error("Node version should be >= " + baseVer);
};

DoctortPlugin.prototype.beforeInit = function() {

	if (!this.isNodePathSet()) {
		this.throwNodePathError();
	}

	if (!this.isNodeVerRight()) {
		this.throwNodeVerError();
	}
};

DoctortPlugin.prototype.init = function() {

	if (this.isNodePathSet()) {
		console.log(logSymbols.success, " ", chalk.white('NODE_PATH is ' + this.utils.globalNodeModules));
	}
	else {
		console.log(logSymbols.error, " ", chalk.red('NODE_PATH is undefined\nYou can visit https://github.com/SteamerTeam/steamerjs to see how to set NODE_PATH'));
	}

	if (this.isNodeVerRight()) {
		console.log(logSymbols.success, " ", chalk.white('Node Version is ' + process.version));
	}
	else {
		console.log(logSymbols.error, " ", chalk.red('Node Version should be >= ' + baseVer));
	}
};

DoctortPlugin.prototype.help = function() {
	this.utils.printUsage('help you check steamer running environment!', 'doctor');
};

module.exports = DoctortPlugin;
