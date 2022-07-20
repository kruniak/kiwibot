// TODO:
//  https://mtproto-core.js.org/docs/
//  https://stackoverflow.com/a/67692493/19446614
const { exec } = require('child_process');
const worker = require('worker_threads');

require('dotenv').config();

// serve assets
exec('npx http-server assets');

const bot = require('./bot');
// const gameBot = require('./gamesBot');

bot.init();
bot.registerEvents();

bot.run();

// gameBot.init();
// gameBot.registerEvents();

// gameBot.run();
