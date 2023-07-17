const db = require('../db');

// const commandPrefix = '/';

class Command {
  constructor(commandName, admin = false) {
    // NOTE: porting this to new Telegraf version. There should be some
    //  way of setting command prefix in the API
    this.commandString = commandName; // commandPrefix.concat(commandName);
    this.admin = admin;

    this.commandHandler = this.commandHandler.bind(this);
  }

  // returns a boolean that indicates whether the command should be executed or not
  // TODO: fake news, rename this
  async commandHandler(ctx) {
    const user = await db.user.findUnique({
      where: {
        telegramId: ctx.message.from.id
      }
    });

    if (this.admin) {
      if (!user.admin) {
        ctx.replyWithMarkdown(
          "You don't have the rights to use this command.",
          {
            reply_to_message_id: ctx.message.message_id
          }
        );

        return false;
      }
    }

    return true;
  }
}

module.exports = Command;
