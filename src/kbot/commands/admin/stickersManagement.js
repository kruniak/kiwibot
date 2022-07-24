const db = require('../../db');
const Command = require('../../core/command');

// TODO: add sticker / edit sticker / remove sticker

class AddSticker extends Command {
  constructor() {
    super('addsticker');
  }

  commandHandler = async ctx => {
    
  };
}


// TODO: old code to redo

// let chatId = null;

// let shouldAskForStickerCategory = false;
// let shouldListenForStickerCategory = false;
// let user_id = '';
// let stickerId = '';
// let stickerSetName = '';


// chatId = ctx.message.chat.id;

// if (ctx.chat.type !== 'private') {
//   return next();
// }

// if (ctx.message.sticker) {
//   shouldAskForStickerCategory = true;
//   shouldListenForStickerCategory = false;

//   user_id = ctx.message.from.id;
//   stickerId = ctx.message.sticker.file_id;
//   stickerSetName = ctx.message.sticker.set_name;
// }

// if (shouldAskForStickerCategory && ctx.message.from.id == user_id) {
//   shouldAskForStickerCategory = false;
//   shouldListenForStickerCategory = true;

//   return ctx.reply('What category?');
// }

// if (shouldListenForStickerCategory && ctx.message.from.id == user_id) {
//   shouldListenForStickerCategory = false;

//   const category = await prisma.stickerCategory.findUnique({
//     where: { name: ctx.message.text }
//   });

//   if (!category) {
//     stickerId = '';
//     stickerSetName = '';
//     return ctx.reply('That category was not found.');
//   }

//   let set = await prisma.stickerSet.findUnique({
//     where: { setName: stickerSetName }
//   });

//   if (!set) {
//     set = await prisma.stickerSet.create({
//       data: {
//         setName: stickerSetName
//       }
//     });
//   }

//   stickerSetName = '';

//   // await prisma.sticker.create({
//   //   data: {
//   //     file_id: stickerId,
//   //     stickerSetId: set.id,
//   //     stickerCategoryId: category.id
//   //   }
//   // });

//   await prisma.sticker.create({
//     data: {
//       file_id: stickerId,
//       stickerSetId: set.id,
//       categories: {
//         create: [
//           {
//             category: {
//               connect: {
//                 id: category.id
//               }
//             }
//           }
//         ]
//       }
//     }
//   });

//   stickerId = '';

//   return ctx.replyWithMarkdown(`Sticker added to _${category.name}_ category.`);
// }