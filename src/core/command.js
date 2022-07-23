const commandPrefix = '/';

class Command {
  constructor(commandName) {
    this.commandString = commandPrefix.concat(commandName);
    this.db = require('../data/db');
  }
}

module.exports = Command;
