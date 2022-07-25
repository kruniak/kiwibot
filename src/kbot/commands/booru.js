const Command = require('../../core/command');

//
// i only support e621/e926 atm. i don't know about other boards APIs yet
//
const api = require('../../api/exxxApi');

const isValidUrl = urlString => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

class RandomPostFromTags extends Command {
  constructor() {
    super('randpost');
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    if (ctx.message.text.split(' ').length > 1) {
      var tags = ctx.message.text.split(' ').slice(1).join(' ').trim();
    } else {
      // NOTE: maybe allow full random search. check what API does.
      return ctx.reply('No tags specified.', {
        reply_to_message_id: ctx.message.message_id
      });
    }

    const result = await api.getRandomPostFromTags(tags);

    // FIXME: find a better solution
    if (!isValidUrl(result)) {
      return ctx.reply(result);
    }

    // TODO: add a goto post button

    return ctx.replyWithPhoto(result, {
      allow_sending_without_reply: true
    });
  }
}

// class GetRandomArtistPost extends Command {
//   constructor(commandName) {
//     super('randpost_artist');
//   }

//   commandHandler = async ctx => {
//     if (ctx.message.text.split(' ').length > 1) {
//       var tags = ctx.message.text.split(' ').slice(1).join('+');
//     }

//     const result = await api.getRandomPostFromTags(tags);
//     return ctx.replyWithPhoto(result, {
//       allow_sending_without_reply: true
//     });
//   };
// }

module.exports = [new RandomPostFromTags()];
