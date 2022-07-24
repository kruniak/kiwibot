const HelpCommands = require('./commands/help');
const InteractionCommands = require('./commands/interaction');
const StatsCommands = require('./commands/stats');
const BooruCommands = require('./commands/booru');
const MiscCommands = require('./commands/misc');
const NsfwManagementCommands = require('./commands/admin/nsfwManagement');

const commandsList = [
  ...HelpCommands,
  ...InteractionCommands,
  ...StatsCommands,
  ...BooruCommands,
  ...MiscCommands,
  ...NsfwManagementCommands
];

const registerAllCommands = bot => {
  commandsList.forEach(command => {
    bot.command(command.commandString, command.commandHandler);
  });

  // register sticker commands asynchronously (i should find a better solution)
  (async function(){
    return await require('./stickers');
  })()
    .then(stickerCommands => stickerCommands.forEach(stickerCommand => {
      bot.command(stickerCommand.commandString, stickerCommand.commandHandler);
    }));
};

module.exports = {
  registerAllCommands
};
