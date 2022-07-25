const db = require('../../db');
const api = require('../../api/exxxApi');
const Command = require('../../core/command');

class Pet extends Command {
  constructor() {
    super('pet');
  }

  commandHandler = async (ctx) => {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const mention = ctx.message.entities.filter((e) => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('Who would you like to pet?');
    }

    let pettedName;

    const pettedUsername = ctx.message.text.substring(
      mention.offset + 1,
      mention.offset + mention.length + 1
    );

    const petted = await db.user.findUnique({
      where: {
        username: pettedUsername,
      },
    });

    if (petted) {
      pettedName = petted.displayName;
    } else {
      return ctx.reply("I don't know them.");
    }

    const petter = await db.user.findUnique({
      where: {
        telegramId: ctx.message.from.id,
      },
    });

    await db.pet.create({
      data: {
        petterId: petter.id,
        pettedId: petted.id,
      },
    });

    const opt = ctx.message.reply_to_message
      ? {
          reply_to_message_id: ctx.message.reply_to_message.message_id,
        }
      : null;

    return ctx.replyWithMarkdown(
      `${petter.displayName} _pets_ ${pettedName}.`,
      opt
    );

    // TODO: send stickers too!
  };
}

class Pat extends Command {
  constructor() {
    super('pat');
  }

  commandHandler = async (ctx) => {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const mention = ctx.message.entities.filter((e) => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('Who would you like to pat?');
    }

    let pattedName;

    const pattedUsername = ctx.message.text.substring(
      mention.offset + 1,
      mention.offset + mention.length + 1
    );

    const patted = await db.user.findUnique({
      where: {
        username: pattedUsername,
      },
    });

    if (patted) {
      pattedName = patted.displayName;
    } else {
      return ctx.reply("I don't know them.");
    }

    const patter = await db.user.findUnique({
      where: {
        telegramId: ctx.message.from.id,
      },
    });

    await db.pat.create({
      data: {
        patterId: patter.id,
        pattedId: patted.id,
      },
    });

    const opt = ctx.message.reply_to_message
      ? {
          reply_to_message_id: ctx.message.reply_to_message.message_id,
        }
      : null;

    return ctx.replyWithMarkdown(
      `${patter.displayName} _pats_ ${pattedName}.`,
      opt
    );
  };
}

class Hug extends Command {
  constructor() {
    super('hug');
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const senderName = ctx.message.from.first_name;

    if (ctx.message.text.split(' ').length === 2) {
      var username = ctx.message.text.split(' ').slice(1).join(' ');
    } else {
      return ctx.reply('Who would you like to hug?', {
        reply_to_message_id: ctx.message.message_id,
      });
    }

    const result = await api.getRandomPostFromTags('hugging affection');

    // TODO: check if we have username in db: if so, print displayName instead
    // NOTE: i think username changes could lead to inconsistencies in edge-cases

    const user = db.user.findUnique({
      where: {
        username,
      },
    });

    let maybeDisplayName = username;
    if (user) {
      maybeDisplayName = !user.displayName ? username : user.displayName;
    }

    const caption = `${senderName} hugs ${maybeDisplayName}`;

    const opt = ctx.message.reply_to_message
      ? {
          caption,
          reply_to_message_id: ctx.message.reply_to_message.message_id,
        }
      : {
          caption,
        };

    return ctx.replyWithPhoto(result, opt);
  }
}

// TODO: class Kiss extends Command { ... }

module.exports = [new Pet(), new Pat(), new Hug()];
