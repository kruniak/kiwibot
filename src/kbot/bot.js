const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const db = require('../db');
const { registerAllCommands } = require('./commands');

class Bot {
  constructor(api_key) {
    // Bot client
    this.bot = new Telegraf(api_key);

    // Initialize bot
    this.init();
  }

  init = () => {
    // Initialize core functionality
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

    this.registerCoreEvents();

    // register bot commands
    registerAllCommands(this.bot);

    this.isInitialized = true;
  };

  registerCoreEvents = () => {
    const { bot } = this;

    // Hardcoded array of allowed chat IDs
    const allowedChatIds = ['-1001749379640' /*, '-1001787809187' */];

    bot.on(message('text'), async (ctx, next) => {
      // Handle private chat bot messages
      if (ctx.chat.type === 'private') {
        // if (Math.random() < 0.5 ? 0 : 1) {
        //   return ctx.reply('hello?');
        // } else {
        //   return ctx.replyWithVoice(
        //     `https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${
        //       Math.floor(Math.random() * 9) + 1
        //     }.ogg`,
        //     {
        //       reply_to_message_id: ctx.message.message_id
        //     }
        //   );
        // }

        // We can ignore private messages by not calling next
        //  (otherwise commands would be executed)
        return next();
      }

      // Check if the chat ID is in the allowedChatIds array,
      //  otherwise return
      if (!allowedChatIds.includes(String(ctx.chat.id))) {
        return;
      }

      const senderId = ctx.message.from.id;

      const username = ctx.message.from.username;
      const displayName = [
        ctx.message.from.first_name,
        ctx.message.from.last_name
      ]
        .join(' ')
        .trim();

      // Check existing and new users' basic data and update db
      const user = await db.user.findUnique({
        where: {
          telegramId: senderId
        }
      });

      // const admins = await bot.telegram.getChatAdministrators(ctx.chat.id);
      // const isAdmin = Boolean(
      //   admins.find(member => member.user.id === senderId)
      // );

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

        // if (user.admin !== isAdmin) {
        //   // update admin status
        //   await db.user.update({
        //     where: {
        //       id: user.id
        //     },
        //     data: {
        //       admin: isAdmin
        //     }
        //   });
        // }

        return next();
      }

      // XXX: why this here? can't remember
      bot.start();

      // Create new user record
      await db.user.create({
        data: {
          telegramId: senderId,
          username,
          displayName,
          admin: false
        }
      });

      return next();
    });

    bot.on(message('new_chat_members'), async (ctx, next) => {
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
