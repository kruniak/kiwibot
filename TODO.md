# TODOS

## 0.2.0 roadmap
- [ ] fix turret05

- [ ] GLaDOS praise command (reply, mention, then voice reply or voice)

- [x] handle commands in all/most replies (example reply to command with /angry or /pet etc...)

- [x] admin toggle nsfw posts

- [ ] admin stickers management

- [ ] admin toggle nsfw sticker categories

- [x] set booru posts to only find gay stuff for now

- [ ] deploy / shutdown / changelog messages in chat


## 0.2.1 roadmap

- [ ] pet / pat might use stickers instead of nothing or image, as well as hug

- [ ] booru posts should be globally or user settable as straight / bisexual / gay

- [ ] save sticker set ids so that the bot will try to retrieve a matching sticker from the category and set that was selected by the user (/favestickers idx /listsets with indexes (stores stickerset ids) /unfavestickerset idx). if none was found it will just send some random one

- [ ] improve EXXXApi.js

- [ ] maybe send "Loading..." reply message on commands that call apis, then delete it once the result is returned


## 0.2.2 roadmap

- [ ] randpost 1 request every 30s per user

- [ ] max two e926 requests per second as the docs state

- [ ] admin post tags blacklist add/remove commands


# 0.3.0 roadmap
- [ ] italian localization


## backlog
- for commands like /hug (that return images from tags), u could check a post for tags to see if they match with the user 'profile' (for example, only pick those posts where the "huggee" is a canine anthro, or take things like size into consideration)

- randpost syntax
/randpost [...]  (! before tag for blacklisting, logical operators, etc...)

- turret or glados comment with text or voice sometimes whenever users are typing
