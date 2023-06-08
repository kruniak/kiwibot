const db = require('../../db');
const Command = require('../../core/command');

class PetStats extends Command {
  constructor() {
    super('petstats');
  }

  commandHandler = async ctx => {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('who?');
    }

    const petterUsername = ctx.message.text.substring(
      mention.offset + 1,
      mention.offset + mention.length + 1
    );

    const petter = await db.user.findUnique({
      where: {
        username: petterUsername
      },
      include: {
        petsGiven: true
      }
    });

    if (!petter) {
      return ctx.reply("I don't know them, sorry.");
    }

    return ctx.replyWithMarkdown(
      `You have pet them *${petter.petsGiven.length}* times.`
    );
  };
}

// TODO: check reply_to_message
class PatStats extends Command {
  constructor() {
    super('patstats');
  }

  commandHandler = async ctx => {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('who?');
    }

    const patterUsername = ctx.message.text.substring(
      mention.offset + 1,
      mention.offset + mention.length + 1
    );

    const patter = await db.user.findUnique({
      where: {
        username: patterUsername
      },
      include: {
        patsGiven: true
      }
    });

    if (!patter) {
      return ctx.reply("I don't know them, sorry.");
    }

    return ctx.replyWithMarkdown(
      `You have pat them *${patter.patsGiven.length}* times.`
    );
  };
}

module.exports = [new PetStats(), new PatStats()];
