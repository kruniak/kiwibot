const Command = require('../../core/command');

//
// i only support e621/e926 atm. i don't know about other boards APIs yet
//
const EXXXApi = require('../../api/exxxApi');

class GetRandomArtistPost extends Command {
  constructor(commandName) {
    super('randpost artist');
  }

  commandHandler = async ctx => {

  };
}

class GetRandomPostFromTags extends Command {
  constructor(commandName) {
    super('randpost tags');
  }
}
