const common = require('../../core/common');
const Command = require('../../core/command');

class BotHelp extends Command {
  constructor() {
    super('help');
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    if (ctx.message.text.split(' ').length != 2) {
      return ctx.replyWithMarkdown(
        `*${common.projectName} v${common.version}*\n• /kiwiki\n• /about\n• /privacy\n\n*Commands*\n• /stickers\n• /pet\n• /hug\n• /randpost\n• *[...]*`,
        {
          reply_to_message_id: ctx.message.message_id
        }
      );
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

module.exports = [new BotHelp()];
