const Pet = require('./commands/interaction');
const PetStats = require('./commands/stats');

// TODO: register sticker commands programmatically
//  by reading category table for the name (command string)

// then create an array of sticker command instances
// [...Stickers].forEach

const commandsList = [
  new Pet(),
  new PetStats()
  // new Help,
  // new Hug,
  // new Post,
];

// expects a Telegraf bot instance as paramater
const registerAllCommands = bot => {
  commandsList.forEach(command => {
    bot.command(command.commandString, command.commandHandler);
  });
};

module.exports = {
  registerAllCommands
};
