const { on } = require('nodemon');
const { Telegraf } = require('telegraf');

const db = require('../db');
const { registerAllCommands } = require('./commands');

class Bot {
  constructor(api_key) {
    // bot client
    this.bot = new Telegraf(api_key);

    // initialize bot
    this.init();
  }

  init = () => {
    // initialize core functionality
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

    this.registerCoreEvents();

    // register bot commands
    registerAllCommands(this.bot);

    this.isInitialized = true;
  };

  registerCoreEvents = () => {
    const { bot } = this;

    bot.on('message', async (ctx, next) => {
      // ignore private messages by not calling next
      //  (otherwise commands would be executed)
      if (ctx.chat.type === 'private') {
        if (Math.random() < 0.5 ? 0 : 1) {
          return ctx.reply('hello?');
        } else {
          return ctx.replyWithVoice(
            `https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${
              Math.floor(Math.random() * 9) + 1
            }.ogg`,
            {
              reply_to_message_id: ctx.message.message_id
            }
          );
        }
      }

      const senderId = ctx.message.from.id;

      const username = ctx.message.from.username;
      const displayName = [
        ctx.message.from.first_name,
        ctx.message.from.last_name
      ]
        .join(' ')
        .trim();

      //
      // check existing and new users' basic data and update db
      //

      const user = await db.user.findUnique({
        where: {
          telegramId: senderId
        }
      });

      const admins = await bot.telegram.getChatAdministrators(ctx.chat.id);
      const isAdmin = Boolean(
        admins.find(member => member.user.id === senderId)
      );

      if (user) {
        if (user.username !== username) {
          // update username
          await db.user.update({
            where: {
              id: user.id
            },
            data: {
              username
            }
          });
        }

        if (user.displayName !== displayName) {
          // update display name
          await db.user.update({
            where: {
              id: user.id
            },
            data: {
              displayName
            }
          });
        }

        if (user.admin !== isAdmin) {
          // update admin status
          await db.user.update({
            where: {
              id: user.id
            },
            data: {
              admin: isAdmin
            }
          });
        }

        return next();
      }

      bot.start();

      // create new user record
      await db.user.create({
        data: {
          telegramId: senderId,
          username,
          displayName,
          admin: isAdmin
        }
      });

      return next();
    });

    bot.on('new_chat_members', async (ctx, next) => {
      // TODO: check if not self. it will welcome itself when invited to a group

      ctx.replyWithVoice(
        'https://github.com/drake-321/drake-321.github.io/raw/main/part1_entry-1.ogg'
      );
      return next();
    });
  };

  run() {
    this.bot.launch();
  }
}

module.exports = new Bot(process.env.TELEGRAM_KEY);
