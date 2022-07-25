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

  // register sticker commands asynchronously (FIXME: do it synchronously instead?)
  (async function(){
    return await require('./stickers');
  })()
    .then(stickerCommands => {
      bot.command('/stickers', ctx => {
        // show stickers list
        return ctx.replyWithMarkdown(`*Sticker commands*:\n${stickerCommands.map(cmd => `• ${cmd.commandString}`).join('\n').trim()}`);
      });

      stickerCommands.forEach(stickerCommand => {
        bot.command(stickerCommand.commandString, stickerCommand.commandHandler);
      });
    });
};

module.exports = {
  registerAllCommands
};
