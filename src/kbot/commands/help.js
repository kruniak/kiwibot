const common = require('../../core/common');
const Command = require('../../core/command');

class BotHelp extends Command {
  constructor() {
    super('help');
  }

  async commandHandler (ctx) {
    if (!await super.commandHandler(ctx)) {
      return;
    }

    if (ctx.message.text.split(' ').length != 2) {
      ctx.reply(`${common.projectName} v${common.version}\n\n*Commands*\n• /stickers\n[...]`);
      return ctx.replyWithVoice(`https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${Math.floor(Math.random() * 9) + 1}.ogg`);
    }

    const command = ctx.message.text.split(' ')[1];

    let message;
    switch (command) {
    case 'randpost':
      message = `usage: ${command} [tags]`;
      break;
    default:
      message = `command /${command} does not exist`;
      break;
    }

    return ctx.reply(message, {
      reply_to_message_id: ctx.message.message_id
    });
  }
}

module.exports = [
  new BotHelp()
];
