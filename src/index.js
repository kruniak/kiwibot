// TODO:
//  https://mtproto-core.js.org/docs/
//  https://stackoverflow.com/a/67692493/19446614

// const { exec } = require('child_process');
require('dotenv').config();
const common = require('./core/common');

// // TEMPORARY: sticker management
// const bot = require('../scripts/stickerManagerBot');
// bot.run();

// // serve assets
// exec('npx http-server assets');

const bot = require('./kbot/bot');

console.log(
  `${common.projectName} v${common.version} running on nodejs ${process.version}`
);

bot.run();
