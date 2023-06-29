const api = require('../../../api/exxxApi');
const Command = require('../../../core/command');

class Nsfw extends Command {
  constructor() {
    super('nsfw', true);
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    return ctx.replyWithMarkdown(
      `NSFW posts are *${api.nsfw ? 'enabled' : 'disabled'}*.`
    );
  }
}

class ToggleNsfwPosts extends Command {
  constructor() {
    super('togglensfw', true);
  }

  async commandHandler(ctx) {
    if (!(await super.commandHandler(ctx))) {
      return;
    }

    api.toggleNsfw();

    return ctx.replyWithMarkdown(
      `NSFW posts are now *${api.nsfw ? 'enabled' : 'disabled'}*.`
    );
  }
}

module.exports = [new Nsfw(), new ToggleNsfwPosts()];
