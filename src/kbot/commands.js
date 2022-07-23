const InteractionCommands = require('./commands/interaction');
const StatsCommands = require('./commands/stats');
const BooruCommands = require('./commands/booru');

// TODO: register sticker commands programmatically
//  by reading category table for the name (command string)

// then create an array of sticker command instances
// [...Stickers].forEach

const commandsList = [
  ...InteractionCommands,
  ...StatsCommands
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
