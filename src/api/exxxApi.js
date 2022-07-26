const axios = require('axios');

axios.defaults.headers.get = {
  api_key: process.env.EXXX_KEY,
  'User-Agent': 'SFW bot for a small group of friends and practice'
};

// !!!!!!!!
// TODO: nsfw json blacklist
//

class EXXXApi {
  constructor() {
    this.nsfw = false;
    this.baseUrl = `https://e${this.nsfw ? '621' : '926'}.net`;
  }

  toggleNsfw = () => {
    this.nsfw = !this.nsfw;
    this.baseUrl = `https://e${this.nsfw ? '621' : '926'}.net`;
  };

  getRandomPostFromTags = async tags => {
    // TODO: fix and improve the following
    //  (handle inexistent tags, max api calls per secs, better api usage etc...)

    // hardcode homo stuff for now.
    // TODO: global/user settings eventually...

    tags += ' male/male';

    // provisionary nsfl blacklist
    tags = tags
      .replace('cub', '')
      .replace('age_difference', '')
      .replace('loli', '')
      .replace('incest', '')
      .replace(/\s+/g, ' ')
      .trim();

    tags += ' -cub -age_difference -loli -incest';

    let posts = [];
    try {
      const res = await axios.get(`${this.baseUrl}/posts.json`, {
        headers: {
          // do not cache anything
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        },
        params: {
          limit: 100,
          tags: tags
        }
      });

      posts = res.data;
    } catch (ex) {
      return 'Bot failure or service down.';
    }

    // FIXME: doesnt work properly
    if (posts.length === 0) {
      return 'Nothing found 😿';
    }

    const post = posts[Math.floor(Math.random() * posts.length)];

    // TODO: check if animation?
      
    const imgUrl = post.file.url;
    const postId = post.id;

    return {
      imgUrl: imgUrl,
      postUrl: this.baseUrl + '/posts/' + postId
    };
  };

  // getArtistRandomPost = async artist => {

  // };

  // getTagInfo = async tagName => {

  // }
}

module.exports = new EXXXApi();
