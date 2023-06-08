const Command = require('../../core/command');

class PHello extends Command {
  constructor() {
    super('p_hello');
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const helloMessageNumbers = [1, 2, 3, 4, 7, 8];

    const opt = ctx.message.reply_to_message
      ? {
          reply_to_message_id: ctx.message.reply_to_message.message_id
        }
      : null;

    return ctx.replyWithVoice(
      `https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${
        helloMessageNumbers[
          Math.floor(Math.random() * helloMessageNumbers.length)
        ]
      }.ogg`,
      opt
    );
  }
}

class Roll extends Command {
  constructor() {
    super('roll');
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const messageId = ctx.message.message_id;

    const rollString = ctx.message.text.split(' ')[1];
    if (!rollString || !/^d\d+$/i.test(rollString)) {
      return ctx.reply(
        'Invalid roll format. Please use the format: /roll d<number>'
      );
    }

    const dieSides = parseInt(rollString.substring(1));

    if (isNaN(dieSides)) {
      return ctx.reply(
        'Invalid roll format. Please use the format: /roll d<number>'
      );
    }

    const result = Math.floor(Math.random() * dieSides) + 1;

    return ctx.reply(result.toString(), {
      reply_to_message_id: messageId
    });
  }
}

module.exports = [new PHello(), new Roll()];
