const Command = require('../../core/command');

class PetStats extends Command {
  constructor() {
    super('petstats');
  }

  commandHandler = async ctx => {
    const { db } = this;

    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('who?');
    }

    const petterUsername = ctx.message.text.substring(mention.offset + 1, mention.offset + mention.length + 1);

    const petter = await db.user.findUnique({
      where: {
        username: petterUsername
      },
      include: {
        petsGiven: true
      }
    });

    if (!petter) {
      return ctx.reply('I don\'t know them, or they haven\'t pet anyone yet. Either way, it\'s saddening.');
    }

    let rand = Math.random() * 100;
    const commentarySendRatePercentage = 8;
    let shouldComment = false;

    if (rand < commentarySendRatePercentage) {
      shouldComment = true;
    }

    return ctx.replyWithMarkdown(`You appear to have pet them *${petter.petsGiven.length}* times.${shouldComment ? ' Impressive.\n\nConsider_b03aed0x2222llllï♣ô}23bba7_ng that _CRITICAL ERROR_: _Morality.PetOperationHumanPhraseGenerator.Get()_ not implemented. Exception type: EXCEPT\\_NULL\\_REF.\nShutting down threads...\n\nFollowing protocol.\n*Reboot imminent*...' : ''}`);
  };
}

module.exports = PetStats;
