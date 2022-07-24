# TODOS
- max two e926 requests per second as the docs state

- tags blacklist add and remove commands

- syntax
/randpost [...]  (! before tag for blacklisting, logical operators, etc...)

- turret or glados appear sometimes whenever users are typing

- handle ONE single group in my case. (ideally group whitelist / password when invited)

## 0.2.0 roadmap:
- fix turret05

- admin toggle nsfw posts (maybe sticker categories too?)

- admin stickers management

- save sticker set ids so that the bot will try to retrieve a matching sticker from the category and set that was selected by the user (/favestickers idx /listsets with indexes (stores stickerset ids) /unfavestickerset idx). if none was found it will just send some random one

- maybe send "Loading..." message on commands that call apis, then delete it once the result is returned
