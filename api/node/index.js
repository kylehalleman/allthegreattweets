const url = require('url');
const twitterize = require('twitterize');
const isAfter = require('date-fns/isAfter');
const subMonths = require('date-fns/subMonths');

const isWithinXMonths = (months = 1) => tweet =>
  isAfter(new Date(tweet.created_at), subMonths(new Date(), months));

function isWithin30Days(tweet) {
  return isAfter(new Date(tweet.created_at), subMonths(new Date(), 1));
}

class RateLimitError extends Error {
  constructor() {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.code = 88;
  }
}

const oauthOptions = {
  api_key: process.env.TWITTER_API_KEY,
  api_secret_key: process.env.TWITTER_API_SECRET_KEY,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

function rateLimitCheck(json) {
  return json.errors && json.errors.some(({ code }) => code === 88);
}

function searchLastWeek(screen_name, results = [], queryParams) {
  return twitterize({
    requestMethod: 'GET',
    endpoint: '/search/tweets.json',
    oauthOptions,
    queryParams: queryParams || {
      q: `from:${screen_name}`,
      result_type: 'recent',
      count: 100
    }
  })
    .then(data => {
      const json = JSON.parse(data);
      const statuses = json.statuses || [];
      try {
        if (rateLimitCheck(json)) {
          throw new RateLimitError();
        }

        if (statuses.length === 100) {
          const params = url.parse(json.search_metadata.next_results, true)
            .query;
          return searchLastWeek(screen_name, results.concat(statuses), params);
        }
      } catch (e) {}

      const filteredTweets = results
        .concat(statuses)
        .filter(tweet => !tweet.in_reply_to_screen_name);
      return {
        username: screen_name,
        tweets: filteredTweets.length
      };
    })
    .catch(err => console.error(err));
}

const searchViaTimelinesCurry = months => {
  const filterFn = isWithinXMonths(months);
  return function searchViaTimelines(user, results = [], queryParams) {
    return twitterize({
      requestMethod: 'GET',
      endpoint: '/statuses/user_timeline.json',
      oauthOptions,
      queryParams: Object.assign(
        {},
        {
          screen_name: user.screen_name,
          count: 200,
          include_rts: true
        },
        queryParams
      )
    }).then(data => {
      const json = JSON.parse(data);
      const tweets = Array.isArray(json) ? json : [];
      const filteredTweets = tweets.filter(filterFn);
      try {
        if (rateLimitCheck(json)) {
          throw new RateLimitError();
        } else if (filteredTweets.length === 200) {
          return searchViaTimelines(user, results.concat(filteredTweets), {
            max_id: filteredTweets[199].id_str
          });
        }
      } catch (e) {}

      return {
        username: user.screen_name,
        image: user.image,
        tweets: results.concat(filteredTweets).length
      };
    });
  };
};

// next_cursor
function getFriendsList(screen_name, results = [], queryParams) {
  return twitterize({
    requestMethod: 'GET',
    endpoint: '/friends/list.json',
    oauthOptions,
    queryParams: Object.assign({}, { screen_name, count: 200 }, queryParams)
  }).then(res => {
    const data = JSON.parse(res);
    if (rateLimitCheck(data)) {
      throw new RateLimitError();
    }
    if (data.next_cursor !== 0) {
      return getFriendsList(screen_name, results.concat(data.users), {
        cursor: data.next_cursor
      });
    } else {
      return results
        .concat(data.users)
        .filter(user => !user.protected)
        .map(({ screen_name, profile_image_url_https }) => ({
          screen_name,
          image: profile_image_url_https
        }));
    }
  });
}

function getTheTweets(months = 1, username = 'kylehalleman') {
  console.time('request');
  // @todo get multiple pages of friends
  return getFriendsList(username)
    .then(friends =>
      Promise.all(
        friends.map(friend => searchViaTimelinesCurry(months)(friend))
      )
    )
    .then(data => {
      console.timeEnd('request');
      return data.slice(0).sort((a, b) => b.tweets - a.tweets);
    });
}

module.exports = (req, res) => {
  // @todo handle for rate limit exceeded

  const query = url.parse(req.url, true).query;
  const months =
    typeof query.months === 'undefined' ? 1 : parseInt(query.months);

  getTheTweets(months, query.name)
    .then(data => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ following: data }));
    })
    .catch(err => {
      if (err.code === 88) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringfity(err));
      }
    });
};
