// TODO:
//  https://mtproto-core.js.org/docs/
//  https://stackoverflow.com/a/67692493/19446614
require('dotenv').config();

const bot = require('./bot');

bot.init();
bot.registerEvents();
bot.run();
