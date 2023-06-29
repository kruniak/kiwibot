# TODOS

## 0.3.0 roadmap

- [x] handle commands in all/most replies (example reply to command with /angry or /pet etc...)

- [x] admin toggle nsfw posts

- [x] set booru posts to only find gay stuff for now

- [x] stickers category command list

- [x] *HALF-DONE* nsfw posts tags global blacklist

- [x] migrate to new telegraf api


## 0.3.1 roadmap

- [x] JSDoc _mostly_ everywhere because I can't autocomplete shit without typescript and I'm a trash programmer

- [ ] add /favpet or something to select a favorite pet sticker

- [x] update username when user changes it (already works??)

- [x] send booru posts with post url message after pic (without preview)

- [ ] fix all interaction commands not working properly for both mentions and replies

## 0.4.0 roadmap

- [ ] kiwiki command

- [x] user profiles (WIP design)

- [ ] commands that retrieve images should return these depending on profile anthro/feral species

- [x] pet / pat might use stickers instead of nothing or image, as well as hug, depending on idontknowwhatyet

- [ ] limit /randpost to 1 request every 2s globally (and maybe warn users sometimes they have to wait? e621 suggests a max of 2 requests per second)

- [ ] save sticker set ids so that the bot will try to retrieve a matching sticker from the category and set that was selected by the user (/favestickers idx /listsets with indexes (stores stickerset ids) /unfavestickerset idx). if none was found it will just send some random one


## 0.5.0 roadmap

- [ ] improve EXXXApi.js, add booru commands and extend functionality

- [ ] admin post tags blacklist add/remove commands

- [ ] admin stickers management

## 0.5.0

- [ ] localization (italian as a priority)


## backlog

- [ ] when replying /fav to a sticker that was triggered by a command, set that one sticker as favorite for the user

- [ ] maybe send "Loading..." reply message on commands that call apis, then delete it once the result is returned (I'm fairly sure we need mtproto or something to read the client)

- [ ] GLaDOS praise command (reply, mention, then voice reply or voice)

- [ ] booru posts should be globally or user settable as straight / bisexual / gay

- [ ] fix turret05

- [ ] deploy / shutdown / changelog messages in chat

- [x] setup prettier (done ig?)

- [ ] for commands like /hug (that return images from tags), u could check a post for tags to see if they match with the user 'profile' (for example, only pick those posts where the "huggee" is a canine anthro, or take things like size into consideration)

- [ ] actual randpost booru-like syntax
/randpost [...]  (! before tag for blacklisting, logical operators, etc...)

- [ ] turret or glados comment with text or voice sometimes whenever users are typing

- [ ] admin/user toggle nsfw sticker categories

