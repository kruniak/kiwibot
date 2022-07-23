const Command = require('../../core/command');

class Hello extends Command {
  constructor() {
    super('hello');
  }

  commandHandler = async ctx => {
    const helloMessageNumbers = [1, 2, 3, 4, 7, 8];
    return ctx.replyWithVoice(`https://github.com/drake-321/drake-321.github.io/raw/main/turret/turretstuckintube0${helloMessageNumbers[Math.floor(Math.random() * helloMessageNumbers.length) + 1]}.ogg`);
  };
}

module.exports = [
  new Hello()
];
