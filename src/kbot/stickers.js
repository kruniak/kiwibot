const db = require('../db');

//
// stickers setup
//
const stickerCommandHandler = async ctx => {
  const replyToMessage = ctx.message.reply_to_message;

  // get sticker category
  let categoryName = ctx.message.text.slice(1);

  // ignore command if it's followed by any words
  // FIXME: improve
  if (categoryName.indexOf(' ') > -1) {
    return;
  }

  // remove bot mention
  if (categoryName.indexOf('@') > -1) {
    categoryName = categoryName.substring(0, categoryName.indexOf('@'));
  }

  const category = await db.stickerCategory.findUnique({
    where: { name: categoryName }
  });

  // TODO: check if user has any favorite sets.
  //  if so, try to find a sticker within that particular set

  const stickers = await db.sticker.findMany({
    where: {
      categories: {
        some: {
          categoryId: category.id
        }
      }
    }
  });

  if (!stickers.length) {
    return ctx.reply('No stickers found :<');
  }

  const offset = Math.floor(Math.random() * stickers.length);

  // TODO: check if user has sticker nsfw mode enabled or global nsfw mode when they are trying to send
  //  a sticker that is linked with nsfw categories

  const stickerFileId = stickers[offset].file_id;

  const opt = replyToMessage
    ? {
        reply_to_message_id: replyToMessage.message_id
      }
    : null;

  return ctx.replyWithSticker(stickerFileId, opt);
};

module.exports = (async function () {
  const categories = await db.stickerCategory.findMany({
    select: {
      name: true
    }
  });

  //
  // command classes
  //
  let stickerCommands = [];
  categories.forEach(c => {
    stickerCommands.push({
      commandString: `${c.name}`,
      commandHandler: stickerCommandHandler
    });
  });

  return stickerCommands;
})();
