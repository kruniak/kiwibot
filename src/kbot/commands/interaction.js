const Command = require('../../core/command');

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

module.exports = Pet;
