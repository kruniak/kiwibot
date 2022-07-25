const { Telegraf } = require('telegraf');

const db = require('../src/db');

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

    let phase1 = false;
    let phase2 = false;
    let sticker = null;
    this.bot.on('message', async (ctx, next) => {
      if (ctx.chat.type !== 'private') {
        return next();
      }

      const senderId = ctx.message.from.id;

      const user = await db.user.findUnique({
        where: {
          telegramId: senderId
        }
      });

      if (!user) {
        ctx.reply("I don't know you. I don't speak with strangers.");
        return next();
      } else if (!user.admin) {
        ctx.reply("You don't have the rights to speak with me.");
        return next();
      }

      phase1 = ctx.message.sticker ?? false;
      if (phase1 && phase2) {
        ctx.reply('Resetting sticker insertion procedure...');
        phase2 = false;
        phase1 = false;
        sticker = null;
      } else if (phase1) {
        phase2 = true;
        phase1 = false;

        sticker = ctx.message.sticker;

        ctx.reply('Send a list of tags separated by spaces.');
        return next();
      } else if (phase2) {
        phase2 = false;
        phase1 = false;

        let tags = '';
        if (ctx.message.text.split(' ').length) {
          tags = ctx.message.text.split(' ');
        } else {
          sticker = null;
          return ctx.reply('No tags specified. Resetting...');
        }

        // check if categories exist
        let stickerCategoryIds = [];
        for (const tag of tags) {
          const category = await db.stickerCategory.findUnique({
            where: {
              name: tag
            }
          });

          if (!category) {
            stickerCategoryIds.push(
              (
                await db.stickerCategory.create({
                  data: {
                    name: tag,
                    nsfw: false // FIXME: this shouldn't be hardcoded
                  }
                })
              ).id
            );
          } else {
            stickerCategoryIds.push(category.id);
          }
        }

        let set = await db.stickerSet.findUnique({
          where: {
            setName: sticker.set_name
          }
        });

        if (!set) {
          set = await db.stickerSet.create({
            data: {
              setName: sticker.set_name
            }
          });
        }

        const newSticker = await db.sticker.create({
          data: {
            file_id: sticker.file_id,
            stickerSetId: set.id
          }
        });

        for (const categoryId of stickerCategoryIds) {
          await db.sticker.update({
            where: {
              id: newSticker.id
            },
            data: {
              categories: {
                create: {
                  categoryId
                }
              }
            }
          });
        }

        ctx.reply('Sticker added.');
      }

      return next();
    });

    this.isInitialized = true;
  };

  run() {
    this.bot.launch();
  }
}

module.exports = new Bot(process.env.TELEGRAM_KEY);
