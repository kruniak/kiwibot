// const db = require('../../../db');
// const bot = require('../../bot');
// const Command = require('../../../core/command');

// // TODO: add sticker / edit sticker / remove sticker

// class AddSticker extends Command {
//   constructor() {
//     super('addsticker', true);

//     this.usersStickerPhase = [];
//     this.usersConfirmPhase = [];
//     this.usersEndPhase = [];

//     this.stickersByUser = [];
//     this.stickerTagsByUser = [];

//     this.commandHandler = this.commandHandler.bind(this);
//   }

//   async commandHandler (ctx) {
//     if (!await super.commandHandler(ctx)) {
//       return;
//     }

//     const senderId = ctx.message.from.id;

//     // FIXME: should have user reply to bot msgs...

//     if (this.usersStickerPhase.includes(senderId)) {

//     } else if (this.usersConfirmPhase.includes(senderId)) {

//       // !!!!!!!!!!!!!!!!!!!!!!!
//       // TODO: nsfw tags

//       if (ctx.message.text.split(' ').length > 1) {
//         var tags = ctx.message.text.split(' ').slice(1).join(' ').trim();
//       } else {
//         this.usersConfirmPhase = this.usersStickerPhase.filter(userId => userId !== senderId);

//         this.stickersByUser[senderId] = null;

//         return ctx.reply('You haven\'t sent any tags. Aborting.', {
//           reply_to_message_id: ctx.message.message_id
//         });
//       }

//       this.usersStickerPhase = this.usersStickerPhase.filter(userId => userId !== senderId);

//       this.usersEndPhase.push(senderId);

//       this.stickerTagsByUser[senderId] = tags;

//       return ctx.reply(`Are you sure you want to apply the following tags to the sticker: ${this.stickerTagsByUser[senderId]} ?.\nyes/no`, {
//         reply_to_message_id: ctx.message.message_id
//       });

//     } else if (this.usersEndPhase.includes(senderId)) {
//       this.usersConfirmPhase = this.usersConfirmPhase.filter(userId => userId !== senderId);
//       this.usersEndPhase = this.usersEndPhase.filter(userId => userId !== senderId);

//       if (ctx.message.text.toLowerCase() !== 'yes') {
//         this.stickersByUser[senderId] = null;
//         this.stickerTagsByUser[senderId] = null;

//         return ctx.reply('Aborting.', {
//           reply_to_message_id: ctx.message.message_id
//         });
//       }

//       // create categories if they do not exist
//       let stickerCategories = [];
//       this.stickerTagsByUser[senderId].forEach(async tag => {

//         const category = db.stickerCategory.findUnique({
//           where: {
//             name: tag
//           }
//         });

//         if (!category) {
//           stickerCategories.push(
//             await db.stickerCategory.create({
//               data: {
//                 name: tag,
//                 nsfw: false // FIXME: this shouldn't be hardcoded
//               }
//             })
//           );
//         } else {
//           stickerCategories.push(category);
//         }
//       });

//       // create sticker set if it does not exist
//       let set = await db.stickerSet.findUnique({
//         where: {
//           setName: this.stickerTagsByUser[senderId].set_name
//         }
//       });

//       if (!set) {
//         set = await db.stickerSet.create({
//           data: {
//             setName: this.stickersByUser[senderId].set_name
//           }
//         });
//       }

//       await db.sticker.create({
//         data: {
//           file_id: this.stickersByUser[senderId].file_id,
//           categories: {
//             connectOrCreate: this.stickerTagsByUser[senderId].map(categoryName => ({
//               category: {
//                 connectOrCreate: {
//                   where: {
//                     name: categoryName
//                   }
//                 }
//               }
//             }))
//           },
//           stickerSetId: set.id
//         }
//       });

//       this.stickersByUser[senderId] = null;
//       this.stickerTagsByUser[senderId] = null;

//       return ctx.reply('Done.', {
//         reply_to_message_id: ctx.message.message_id
//       });
//     }

//     this.usersStickerPhase.push(senderId);

//     bot.on('message', async (ctx, next) => {
//       if (!this.usersStickerPhase.includes(ctx.message.from.id)) {
//         return next();
//       }

//       if (!ctx.message.sticker) {
//         this.usersStickerPhase = this.usersStickerPhase.filter(userId => userId !== senderId);

//         return ctx.reply('I was expecting you to send a sticker. Nevermind.', {
//           reply_to_message_id: ctx.message.message_id
//         });
//       }

//       this.usersStickerPhase = this.usersStickerPhase.filter(userId => userId !== senderId);

//       this.stickersByUser[senderId] = ctx.message.sticker;

//       this.usersConfirmPhase.push(senderId);

//       return ctx.reply('Now send a list of tags separated with a space. NSFW tags should be prefixed with a \'!\'', {
//         reply_to_message_id: ctx.message.message_id
//       });
//     });

//     return ctx.reply('Send a sticker.', {
//       reply_to_message_id: ctx.message.message_id
//     });
//   }
// }

// class EditSticker extends Command {
//   constructor() {
//     super('editsticker', true);
//   }

//   async commandHandler (ctx) {
//     if (!await super.commandHandler(ctx)) {
//       return;
//     }
//   }
// }

// class DeleteSticker extends Command {
//   constructor() {
//     super('delsticker', true);
//   }

//   async commandHandler (ctx) {
//     if (!await super.commandHandler(ctx)) {
//       return;
//     }
//   }
// }

// module.exports = [
//   new AddSticker()
// ];


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