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

    // "parse" tags
    if (ctx.message.text.split(' ').length > 1) {
      var tags = ctx.message.text.trim().split(/\s+/).slice(1).join(' ');
    } else {
      // NOTE: maybe allow full random search. check what API does.
      return ctx.reply('No tags specified.', {
        reply_to_message_id: ctx.message.message_id
      });
    }

    const result = await api.getRandomPostFromTags(tags);

    // FIXME: find a better solution
    if (!isValidUrl(result.imgUrl) || !isValidUrl(result.postUrl)) {
      return ctx.reply('Something went wrong or nothing was found 😿');
    }

    // TODO: add a goto post button! and maybe show the author

    return ctx.replyWithPhoto(result.imgUrl, {
      allow_sending_without_reply: true,
      reply_to_message_id: ctx.message.message_id,
      caption: `Post [*link*](${result.postUrl})`,
      parse_mode: 'MarkdownV2'
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
