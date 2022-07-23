const commandPrefix = '/';

class Command {
  constructor(commandName) {
    this.commandString = commandPrefix.concat(commandName);
    this.db = require('../db');
  }
}

module.exports = Command;
