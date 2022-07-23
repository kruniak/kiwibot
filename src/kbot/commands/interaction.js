const Command = require('../../core/command');
const api = require('../../api/exxxApi');

class Pet extends Command {
  constructor() {
    super('pet');
  }

  commandHandler = async ctx => {
    const { db } = this;

    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('pet who?');
    }

    let pettedName;

    const pettedUsername = ctx.message.text.substring(mention.offset + 1, mention.offset + mention.length + 1);

    const petted = await db.user.findUnique({
      where: {
        username: pettedUsername
      }
    });

    if (petted) {
      pettedName = petted.displayName;
    } else {
      return ctx.reply('I don\'t know them.');
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

    // show either pat count or total pat count or none at random
    // const petCount = db.get(`SELECT COUNT(*) FROM Pets WHERE PetterId = ${ctx.message.from.id}'`);

    return ctx.replyWithMarkdown(`_${petter.displayName} pets ${pettedName}._\n`);
  };
}

class Pat extends Command {
  constructor() {
    super('pat');
  }

  commandHandler = async ctx => {
    const { db } = this;

    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('pat who?');
    }

    let pattedName;

    const pattedUsername = ctx.message.text.substring(mention.offset + 1, mention.offset + mention.length + 1);

    const patted = await db.user.findUnique({
      where: {
        username: pattedUsername
      }
    });

    if (patted) {
      pattedName = patted.displayName;
    } else {
      return ctx.reply('I don\'t know them.');
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

    // show either pat count or total pat count or none at random
    // const petCount = db.get(`SELECT COUNT(*) FROM Pets WHERE PetterId = ${ctx.message.from.id}'`);

    return ctx.replyWithMarkdown(`_${patter.displayName} pats ${pattedName}._\n`);
  };
}

class Hug extends Command {
  constructor() {
    super('hug');
  }

  commandHandler = async ctx => {
    const senderName = ctx.message.from.first_name;

    if (ctx.message.text.split(' ').length === 2) {
      var username = ctx.message.text.split(' ').slice(1).join(' ');
    } else {
      return ctx.reply('People want free hugs!\nMention someone to give them a huggie! ~', {
        reply_to_message_id: ctx.message.message_id
      });
    }

    const result = await api.getRandomPostFromTags('hugging affection');

    const caption = `${senderName} hugs ${username}`;

    return ctx.replyWithPhoto(result, {
      caption
    });
  };
}

module.exports = [
  new Pet(),
  new Pat(),
  new Hug()
];
