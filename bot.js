const path = require('path');
const fs = require('fs');

const { Telegraf } = require('telegraf');
const { PrismaClient } = require('@prisma/client');

const EAPI = require('./eapi');

const bot = new Telegraf(process.env.TELEGRAM_KEY);
const prisma = new PrismaClient();
const eapi = new EAPI();

const init = () => {
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

let shouldAskForStickerCategory = false;
let shouldListenForStickerCategory = false;
let user_id = '';
let stickerId = '';
let stickerSetName = '';

const registerEvents = () => {
  bot.on('message', async (ctx, next) => {
    const telegramId = ctx.message.from.id;

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

    const user = await prisma.user.findUnique({
      where: {
        telegramId: telegramId
      }
    });

    if (user) {
      return next();
    }

    const username = ctx.message.from.username;
    const displayName = [ctx.message.from.first_name, ctx.message.from.last_name].join(' ').trim();

    await prisma.user.create({
      data: {
        telegramId,
        username,
        displayName
      }
    });

    return next();
  });

  // bot.command('/tired', async ctx => {
  //   const category = await prisma.stickerCategory.findUnique({
  //     where: { name: 'tired' }
  //   });

  //   const stickers = await prisma.sticker.findMany({
  //     where: { stickerCategoryId: category.id }
  //   });

  //   const offset = Math.floor(Math.random() * stickers.length);

  //   return ctx.replyWithSticker(stickers[offset].file_id);
  // });

  bot.command('/angry', async ctx => {
    const category = await prisma.stickerCategory.findUnique({
      where: { name: 'angry' }
    });


    const stickers = await prisma.sticker.findMany({
      where: {
        categories: {
          some: {
            categoryId: category.id
          }
        }
      }
    });

    const offset = Math.floor(Math.random() * stickers.length);

    return ctx.replyWithSticker(stickers[offset].file_id);
  });

  bot.command('/help', ctx => {
    // TODO: print oracle turret lines sometimes instead of actual help or send/forward sound 8)

    ctx.reply(`
    hi
    `);
  });

  bot.command('/turret', ctx => {
    // TODO: have a generic class that hosts and caches assets

    // const audioFiles = fs.readdirSync('./assets/turret/');

    // var randomAudioFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];

    //return ctx.replyWithAudio('https://i1.theportalwiki.net/img/4/45/Turret_turretstuckintube09.wav');

    return ctx.replyWithVoice(`https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${Math.floor(Math.random() * 9) + 1}.ogg`);
  });

  bot.on('new_chat_members', ctx => {
    ctx.replyWithVoice('https://github.com/drake-321/drake-321.github.io/raw/main/part1_entry-1.ogg');
  });

  //
  // e621 thing
  //
  bot.command('/post', async (ctx) => {
    if (ctx.message.text.split(' ').length > 1) {
      var tags = ctx.message.text.split(' ').slice(1).join('+');
    }

    const result = await eapi.search(tags);
    return ctx.reply(result);
  });

  bot.command('/hug', async (ctx, next) => {
    const senderName = ctx.message.from.first_name;

    if (ctx.message.text.split(' ').length === 2) {
      var username = ctx.message.text.split(' ').slice(1).join(' ');
    } else {
      ctx.reply('People want free hugs!\nMention someone to give them a huggie! ~', {
        reply_to_message_id: ctx.message.message_id
      });
      return next();
    }

    const result = await eapi.search('hugging affection');
    const message = `${senderName} hugs ${username}\n${result}.\n`;

    return ctx.reply(message);
  });

  bot.command('/petstats', async ctx => {
    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('who?');
    }

    const petterUsername = ctx.message.text.substring(mention.offset + 1, mention.offset + mention.length + 1);

    const petter = await prisma.user.findUnique({
      where: {
        username: petterUsername
      },
      include: {
        petsGiven: true
      }
    });

    if (!petter) {
      return ctx.reply('don\'t know them or they haven\'t pet anyone yet.');
    }

    return ctx.reply(`pet count: ${petter.petsGiven.length}`);
  });


  bot.command('/pet', async ctx => {
    const mention = ctx.message.entities.filter(e => e.type === 'mention')[0];

    if (!mention) {
      return ctx.reply('pet who?');
    }

    let pettedName;

    const pettedUsername = ctx.message.text.substring(mention.offset + 1, mention.offset + mention.length + 1);

    const petted = await prisma.user.findUnique({
      where: {
        username: pettedUsername
      }
    });

    if (petted) {
      pettedName = petted.displayName;
    } else {
      return ctx.reply('I don\'t know them.');
    }

    const petter = await prisma.user.findUnique({
      where: {
        telegramId: ctx.message.from.id
      }
    });

    await prisma.pet.create({
      data: {
        petterId: petter.id,
        pettedId: petted.id
      }
    });

    // show either pat count or total pat count or none at random
    // const petCount = db.get(`SELECT COUNT(*) FROM Pets WHERE PetterId = ${ctx.message.from.id}'`);

    return ctx.replyWithMarkdown(`_${petter.displayName} pets ${pettedName}._\n`);
  });
};

const run = () => {
  bot.launch();
};

module.exports = {
  init,
  registerEvents,
  run
};
