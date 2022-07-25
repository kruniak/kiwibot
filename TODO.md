# TODOS

## 0.2.0 roadmap

- [x] handle commands in all/most replies (example reply to command with /angry or /pet etc...)

- [x] admin toggle nsfw posts

- [x] set booru posts to only find gay stuff for now

- [ ] fix turret05

- [ ] stickers category command list

- [x] *HALF-DONE* nsfw posts tags global blacklist


## 0.2.1 roadmap

- [ ] pet / pat might use stickers instead of nothing or image, as well as hug, depending on idontknowwhatyet

- [ ] booru posts should be globally or user settable as straight / bisexual / gay

- [ ] save sticker set ids so that the bot will try to retrieve a matching sticker from the category and set that was selected by the user (/favestickers idx /listsets with indexes (stores stickerset ids) /unfavestickerset idx). if none was found it will just send some random one

- [ ] maybe send "Loading..." reply message on commands that call apis, then delete it once the result is returned

- [ ] maybe admin/user toggle nsfw sticker categories


## 0.2.2 roadmap

- [ ] randpost 1 request every 30s per user

- [ ] max two e926 requests per second as the docs state

- [ ] admin post tags blacklist add/remove commands

- [ ] GLaDOS praise command (reply, mention, then voice reply or voice)

## 0.2.3 roadmap

- [ ] actual /help command


# 0.3.0 roadmap

- [ ] improve EXXXApi.js, add booru commands and extend functionality

- [ ] italian localization

- [ ] admin stickers management


## backlog

- [ ] deploy / shutdown / changelog messages in chat

- [ ] setup prettier

- [ ] for commands like /hug (that return images from tags), u could check a post for tags to see if they match with the user 'profile' (for example, only pick those posts where the "huggee" is a canine anthro, or take things like size into consideration)

- [ ] actual randpost booru-like syntax
/randpost [...]  (! before tag for blacklisting, logical operators, etc...)

- [ ] turret or glados comment with text or voice sometimes whenever users are typing
