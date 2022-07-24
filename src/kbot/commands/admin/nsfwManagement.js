const api = require('../../../api/exxxApi');
const Command = require('../../../core/command');

class ToggleNsfwPosts extends Command {
  constructor() {
    super('togglensfw');
  }

  commandHandler = ctx => {
    // !!!!!!!!!!!!!!!!!
    // TODO: check if admin / owner

    api.toggleNsfw();

    return ctx.reply(`NSFW posts are now ${api.nsfw ? 'enabled' : 'disabled'}`);
  };
}

module.exports = [
  new ToggleNsfwPosts()
];
