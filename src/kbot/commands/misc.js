const { Context } = require('telegraf');
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
    if (!rollString) {
      return ctx.sendDice();
    } else if (!/^d\d+$/i.test(rollString)) {
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

class StickerInfo extends Command {
  constructor() {
    super('stinfo');
  }

  /**
   * @param {Context} ctx - Current context
   */
  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const repliedMessage = ctx.message.reply_to_message;
    if (!repliedMessage) {
      return ctx.reply('Reply to a sticker to print info about it', {
        reply_to_message_id: ctx.message.message_id
      });
    }

    const sticker = repliedMessage.sticker;
    if (sticker) {
      return ctx.reply(`file_id: ${sticker.file_id}`);
    }

    return ctx.reply('Not a sticker');
  }
}

module.exports = [new PHello(), new Roll(), new StickerInfo()];
