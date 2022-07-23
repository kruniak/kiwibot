const db = require('../../db');

//
// stickers setup
//
const stickerCommandHandler = async ctx => {
  // get sticker category
  const categoryName = ctx.message.text.slice(1);

  const category = await db.stickerCategory.findUnique({
    where: { name: categoryName }
  });


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

  return ctx.replyWithSticker(stickers[offset].file_id);
};

module.exports = (async function() {
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
      commandString: `/${c.name}`,
      commandHandler: stickerCommandHandler
    });
  });

  return stickerCommands;
})();
