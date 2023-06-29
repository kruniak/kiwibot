const db = require('../../db');
const api = require('../../api/exxxApi');
const Command = require('../../core/command');
const { Context } = require('telegraf');

class Pet extends Command {
  constructor() {
    super('pet');
  }

  /**
   * @param {Context} ctx - Current context
   */
  commandHandler = async (ctx, next) => {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    // TODO: test petting multiple users
    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention && !ctx.message.reply_to_message) {
      // return ctx.reply('/pet [mention]\nor just reply /pet', {
      //   reply_to_message_id: ctx.message.message_id
      // });

      // Call the next handler and just reply with a sticker
      return next();
    }

    let pettedName;

    let pettedUsername;
    if (mention) {
      pettedUsername = ctx.message.text.substring(
        mention.offset + 1,
        mention.offset + mention.length + 1
      );
    } else if (ctx.message.reply_to_message) {
      pettedUsername = ctx.message.reply_to_message.from.username;
      pettedName = ctx.message.reply_to_message.from.first_name;
    }

    const petted = await db.user.findUnique({
      where: {
        username: pettedUsername
      }
    });

    if (petted) {
      pettedName = petted.displayName;
    } else {
      return ctx.reply("I don't know them.");
    }

    const petter = await db.user.findUnique({
      where: {
        telegramId: ctx.message.from.id
      }
    });

    await db.pet.create({
      data: {
        petterId: petter.id,
        pettedId: petted.id
      }
    });

    const opt = ctx.message.reply_to_message
      ? {
          reply_to_message_id: ctx.message.reply_to_message.message_id
        }
      : null;

    const category = await db.stickerCategory.findUnique({
      where: { name: 'pet' }
    });

    // Reply with a "pet" sticker (if available)
    if (category) {
      const stickers = await db.sticker.findMany({
        where: {
          categories: {
            some: {
              categoryId: category.id
            }
          }
        }
      });

      const offset = Math.floor(Math.random() * stickers.length);

      const stickerFileId = stickers[offset].file_id;

      await ctx.replyWithSticker(stickerFileId, opt);
    }

    return ctx.replyWithMarkdownV2(`${petter.displayName} _pets_ ${pettedName}\\.`);
  };
}

// TODO: fix like /pet
class Pat extends Command {
  constructor() {
    super('pat');
  }

  /**
   * @param {Context} ctx - Current context
   */
  commandHandler = async ctx => {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('Who would you like to pat?');
    }

    let pattedName;

    // FIXME: there should be a better way to get the mentioned username
    const pattedUsername = ctx.message.text.substring(
      mention.offset + 1,
      mention.offset + mention.length + 1
    );

    const patted = await db.user.findUnique({
      where: {
        username: pattedUsername
      }
    });

    if (patted) {
      pattedName = patted.displayName;
    } else {
      return ctx.reply("I don't know them.");
    }

    const patter = await db.user.findUnique({
      where: {
        telegramId: ctx.message.from.id
      }
    });

    await db.pat.create({
      data: {
        patterId: patter.id,
        pattedId: patted.id
      }
    });

    const opt = ctx.message.reply_to_message
      ? {
          reply_to_message_id: ctx.message.reply_to_message.message_id
        }
      : null;

    return ctx.replyWithMarkdownV2(
      `${patter.displayName} _pats_ ${pattedName}\\.`,
      opt
    );
  };
}

class Hug extends Command {
  constructor() {
    super('hug');
  }

  /**
   * @param {Context} ctx - Current context
   */
  async commandHandler(ctx, next) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const senderName = ctx.message.from.first_name;
    const replyToMessage = ctx.message.reply_to_message;

    let username;
    let userRepliedId;

    // Allow mentions
    if (ctx.message.text.split(' ').length === 2) {
      username = ctx.message.text
        .split(' ')
        .slice(1)
        .join(' ')
        .replace('@', '');
    } else if (replyToMessage) {
      userRepliedId = replyToMessage.from.id;
    } else {
      // return ctx.reply('/hug [mention]\nor just reply /hug', {
      //   reply_to_message_id: ctx.message.message_id
      // });

      // Call the next handler and just reply with a sticker
      return next();
    }

    const result = await api.getRandomPostFromTags('hugging');
    if (!result.imgUrl) {
      return ctx.reply('Failed to find hugs. :<');
    }

    // check if we have username in db: if so, print displayName instead
    // NOTE: i'm pretty sure username changes could lead to inconsistencies in edge-cases

    let user;
    if (username) {
      user = await db.user.findUnique({
        where: {
          username: username
        }
      });
    } else {
      user = await db.user.findUnique({
        where: {
          telegramId: userRepliedId
        }
      });
    }

    if (user) {
      var maybeDisplayName = !user.displayName ? username : user.displayName;
    }

    const caption = `${senderName} hugs ${maybeDisplayName}`;

    const opt = replyToMessage
      ? {
          caption,
          reply_to_message_id: replyToMessage.message_id
        }
      : {
          caption
        };

    return ctx.replyWithPhoto(result.imgUrl, opt);
  }
}

// TODO: class Kiss extends Command { ... }

module.exports = [new Pet(), new Pat(), new Hug()];
