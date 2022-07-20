const { Telegraf /*, Markup */ } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_GAMES_KEY);

const init = () => {
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};

const registerEvents = () => {
  // bot.on('inline_query', ctx => {
  //   ctx.answerInlineQuery([{
  //     type: 'article',
  //     id: 'thumb',
  //     title: 'What are you looking for?',
  //     description: 'hello',
  //     thumb_url: 'thumb',
  //     input_message_content: {
  //       message_text: 'ofofo'
  //     },
  //     reply_markup: Markup.inlineKeyboard([
  //       Markup.button.url('lolol', 'https://drake-321.github.io/')
  //     ])
  //   }]);
  // });

  // ctx.replyWithGame('kiwilabs', {
  //   reply_markup: 'https://drake-321.github.io/'
  // });
};

const run = () => {
  bot.launch();
};

module.exports = {
  init,
  registerEvents,
  run
};
