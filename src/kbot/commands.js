const HelpCommands = require('./commands/help');
const InteractionCommands = require('./commands/interaction');
const StatsCommands = require('./commands/stats');
const BooruCommands = require('./commands/booru');
const MiscCommands = require('./commands/misc');
const NsfwManagementCommands = require('./commands/settings/nsfwManagement');

const commandsList = [
  ...HelpCommands,
  ...InteractionCommands,
  ...StatsCommands,
  ...BooruCommands,
  ...MiscCommands,
  ...NsfwManagementCommands
];

const registerAllCommands = async bot => {
  commandsList.forEach(command => {
    bot.command(command.commandString, command.commandHandler);
  });

  // register sticker commands
  const stickerCommands = await (async function () {
    return await require('./stickers');
  })();

  stickerCommands.forEach(stickerCommand => {
    bot.command(stickerCommand.commandString, stickerCommand.commandHandler);
  });

  // show stickers list
  bot.command('stickers', ctx => {
    const userId = ctx.message.from.id;

    const message = `Sticker commands\n${stickerCommands
      .sort((a, b) => a.commandString.localeCompare(b.commandString))
      .map(cmd => `• ${cmd.commandString}`)
      .join('\n')
      .trim()}`;

    return bot.telegram.sendMessage(userId, message, {
      reply_to_message: ctx.message.message_id
    });
  });
};

module.exports = {
  registerAllCommands
};
