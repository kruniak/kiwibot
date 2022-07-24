const Command = require('../../core/command');

class BotHelp extends Command {
  constructor() {
    super('help');
  }

  commandHandler = async ctx => {
    if (ctx.message.text.split(' ').length != 2) {
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
  };
}

module.exports = [
  new BotHelp()
];
