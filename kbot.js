
const { Telegraf } = require('telegraf');
const { PrismaClient } = require('@prisma/client');

const EAPI = require('./eapi');

module.exports =
class Bot {
  constructor() {
    // bot client
    this.bot = new Telegraf(process.env.TELEGRAM_KEY);

    // db client
    this.prisma = new PrismaClient();

    // e926 client
    this.eapi = new EAPI();

    // initialize bot
    this.init();
  }

  init = () => {
    // initialize core functionality
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));

    this.registerCoreEvents();

    this.isInitialized = true;
  };

  registerCoreEvents = () => {
    const { bot, prisma } = this;

    bot.on('message', async (ctx, next) => {
      const senderId = ctx.message.from.id;

      const username = ctx.message.from.username;
      const displayName = [ctx.message.from.first_name, ctx.message.from.last_name].join(' ').trim();

      //
      // check existing and new users' basic data and update db
      //

      const user = await prisma.user.findUnique({
        where: {
          telegramId: senderId
        }
      });

      if (user) {
        if (user.username !== username) {
          // update username
          prisma.user.update({
            data: {
              username
            }
          });
        }

        if (user.displayName !== displayName) {
          // update display name
          prisma.user.update({
            data: {
              displayName
            }
          });
        }

        return next();
      }

      // create new user record
      await prisma.user.create({
        data: {
          telegramId: senderId,
          username,
          displayName
        }
      });

      return next();
    });

  };

  run() {
    this.bot.launch();
  }
};
