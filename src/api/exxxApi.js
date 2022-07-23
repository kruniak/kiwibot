const axios = require('axios');

let SFW = true;
const BASEURL = `https://e${SFW ? '926' : '621'}.net/`;

axios.defaults.headers.get = {
  'api_key': process.env.EXXX_KEY,
  'User-Agent': 'SFW bot for a small group of friends and practice',
};

class EXXXApi {
  getRandomPostFromTags = async tags => {
    // TODO: fix and improve the following
    //  (handle inexistent tags, max api calls per secs, better api usage etc...)

    try {
      var res = await axios.get(`${BASEURL}/posts.json`, {
        headers: {
          // do not cache anything
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: {
          limit: 1000,
          tags
        }
      });
    } catch (ex) {
      return 'Bot failure or service down.';
    }

    if (res.data.posts.length === 0) {
      return 'Nothing found 😿';
    }

    const imgUrl = res.data.posts[Math.floor(Math.random() * res.data.posts.length)].file.url;
    return imgUrl;
  };

  // getArtistRandomPost = async artist => {

  // };

  // getTagInfo = async tagName => {

  // }
}

module.exports = new EXXXApi();