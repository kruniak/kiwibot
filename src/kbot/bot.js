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
      // ignore private messages
      if (ctx.chat.type === 'private') {
        ctx.reply('hello?');
        return next();
      }

      const senderId = ctx.message.from.id;

      const username = ctx.message.from.username;
      const displayName = [ctx.message.from.first_name, ctx.message.from.last_name].join(' ').trim();

      //
      // check existing and new users' basic data and update db
      //

      const user = await db.user.findUnique({
        where: {
          telegramId: senderId
        }
      });

      if (user) {
        if (user.username !== username) {
          // update username
          db.user.update({
            data: {
              username
            }
          });
        }

        if (user.displayName !== displayName) {
          // update display name
          db.user.update({
            data: {
              displayName
            }
          });
        }

        return next();
      }

      // create new user record
      await db.user.create({
        data: {
          telegramId: senderId,
          username,
          displayName
        }
      });

      return next();
    });

    bot.on('new_chat_members', async(ctx, next) => {
      ctx.replyWithVoice('https://github.com/drake-321/drake-321.github.io/raw/main/part1_entry-1.ogg');
      return next();
    });
  };

  run() {
    this.bot.launch();
  }
}

module.exports = Bot;