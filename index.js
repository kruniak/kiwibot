// TODO:
//  https://mtproto-core.js.org/docs/
//  https://stackoverflow.com/a/67692493/19446614
const { exec } = require('child_process');
require('dotenv').config();

// serve assets
exec('npx http-server assets');

const bot = require('./bot');

bot.init();
bot.registerEvents();
bot.run();
