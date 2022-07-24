const Command = require('../../core/command');

class Hello extends Command {
  constructor() {
    super('hello');
  }

  commandHandler = async ctx => {
    const helloMessageNumbers = [1, 2, 3, 4, 7, 8];

    const opt = ctx.message.reply_to_message ? {
      reply_to_message_id: ctx.message.reply_to_message.message_id
    } : null;

    return ctx.replyWithVoice(`https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${helloMessageNumbers[Math.floor(Math.random() * helloMessageNumbers.length)]}.ogg`, opt);
  };
}

module.exports = [
  new Hello()
];
