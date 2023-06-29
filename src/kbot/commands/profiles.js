const { Context } = require('telegraf');
const Command = require('../../core/command');
const db = require('../../db');

class About extends Command {
  constructor() {
    super('about');
  }

  /**
   * @param {Context} ctx - Current context
   */
  commandHandler = async ctx => {
    if (!ctx.message.reply_to_message) {
      return;
    }

    const userId = ctx.message.reply_to_message.from.id;

    const data = await db.user.findUnique({
      where: { telegramId: userId },
      select: {
        about: true,
        telegramId: true
      }
    });

    const telegramId = data?.telegramId;
    const aboutText = data?.about;

    if (!aboutText) {
      return;
    }

    return ctx.telegram.sendMessage(telegramId, aboutText);
  };
}

class AboutMe extends Command {
  constructor() {
    super('aboutme');
  }

  /**
   * @param {Context} ctx - Current context
   */
  commandHandler = async ctx => {
    if (ctx.chat.type !== 'private') {
      return ctx.reply(
        'This command only works when chatting with the bot itself.'
      );
    }

    const userId = ctx.message.from.id;

    const aboutText = ctx.message.text.replace('/aboutme', '').trim();

    if (aboutText.length === 0) {
      // If aboutText is empty or contains only whitespace, return or
      //  TODO: show the current aboutme
      return ctx.reply('No about info given.');
    }

    await db.user.update({
      where: { telegramId: userId },
      data: { about: aboutText }
    });

    return ctx.reply('Your about was successfully updated!');
  };
}

module.exports = [new About(), new AboutMe()];
