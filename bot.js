// const path = require('path');
// const fs = require('fs');

const { Telegraf } = require('telegraf');
const { PrismaClient } = require('@prisma/client');

const EAPI = require('./eapi');

const bot = new Telegraf(process.env.TELEGRAM_KEY);
const prisma = new PrismaClient();
const eapi = new EAPI();

// let chatId = null;

const init = () => {
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

// let shouldAskForStickerCategory = false;
// let shouldListenForStickerCategory = false;
// let user_id = '';
// let stickerId = '';
// let stickerSetName = '';

const registerEvents = () => {
  bot.on('message', async (ctx, next) => {
    const telegramId = ctx.message.from.id;

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

  // TODO: register global cron events (by using cron pkg maybe)
  // setInterval(() => {
  //   // bot.telegram.sendVoice(chatId, `https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${Math.floor(Math.random() * 9) + 1}.ogg`);
  // }, 30000);

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
    return ctx.replyWithVoice(`https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${Math.floor(Math.random() * 9) + 1}.ogg`);
  });

  // bot.command('/turret', ctx => {
  //   //
  //   // TODO: build a generic class that hosts local assets and caches remote ones
  //   //

  //   return ctx.replyWithVoice(`https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${Math.floor(Math.random() * 9) + 1}.ogg`);
  // });

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
    return ctx.replyWithPhoto(result, {
      allow_sending_without_reply: true
    });
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

    // TODO: remove url, just show the preview (it's probably doable in md)
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
      return ctx.reply('I don\'t know them, or they haven\'t pet anyone yet. Either way, it\'s saddening.');
    }

    let rand = Math.random() * 100;
    const commentarySendRatePercentage = 8;
    let shouldComment = false;

    if (rand < commentarySendRatePercentage) {
      shouldComment = true;
    }

    return ctx.replyWithMarkdown(`You appear to have pet them *${petter.petsGiven.length}* times.${shouldComment ? ' Impressive.\n\nConsider_b03aed0x2222llllï♣ô}23bba7_ng that _CRITICAL ERROR_: _Morality.PetOperationHumanPhraseGenerator.Get()_ not implemented. Exception type: EXCEPT\\_NULL\\_REF.\n\nFollowing protocol.\n*Reboot imminent*...' : ''}`);
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
