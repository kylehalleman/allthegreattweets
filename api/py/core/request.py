#!usr/bin/env python3

import oauth2
import json
import datetime

API_BASE_URL = 'https://api.twitter.com/1.1'

CONSUMER_KEY = 'fqYAlU6lRpoFvWiOrTaSgRmHz'
CONSUMER_SECRET = 'sdNJzBDMaRGQ1UAcpmJYeFQLygCyvxeTQpEnjJ5xiLFOvvAm97'

ACCESS_KEY = '497370998-0bvV05BIwtWaGwHPAcJKorp0nvcYzTa9RLaFOhbV'
ACCESS_SECRET = '8GsBrTgwniofjWUvWpifiOevcYsJg3pYul8JziXgTn3H6'

MAX_TWEETS = '&count=200'
MAX_USERS = 900
INCLUDE_RTS = '&include_rts=1'
EXCLUDE_REPLIES = '&exclude_replies=0'


def oauth_req(url_suffix, key=ACCESS_KEY, secret=ACCESS_SECRET, http_method='GET', post_body='', http_headers=None):
    url = API_BASE_URL + '/' + url_suffix
    consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request(url, method=http_method, body=post_body.encode(), headers=http_headers)
    # print('RESP: ' + str(resp))
    return json.loads(content.decode())


# obtain list of followed accounts
# return up to 900 screen names in list
def get_followed_usernames(username):
    follows_json = oauth_req('friends/list.json?screen_name=' + username)
    user_list = follows_json['users']
    usernames = [x['screen_name'] for x in user_list]
    return usernames


# for each item in list of usernames, obtain up to 200 tweets
def get_followed_tweets(usernames):
    user_tweet_map = {}
    max_index = MAX_USERS if len(usernames) > MAX_USERS else len(usernames)
    for username in usernames[:max_index]:
        user_tweets = 0
        tweets_list = oauth_req('statuses/user_timeline.json?screen_name=' + str(username) + EXCLUDE_REPLIES + INCLUDE_RTS + MAX_TWEETS)
# filter tweets by timestamp
        current_time = datetime.datetime.now(datetime.timezone.utc)
        date_format = '%a %b %d %H:%M:%S %z %Y'
        for tweet in tweets_list:
            tweet_class = tweet.__class__.__name__
            if tweet_class == 'str':
                print('error for user {0}: {1}'.format(username, tweet))
                continue
            timestamp = tweet['created_at']
            date_obj = datetime.datetime.strptime(timestamp, date_format)
            time_delta = current_time-date_obj
            numdays = time_delta.days
            if numdays < 7 :
                user_tweets+=1
        user_tweet_map[username]=user_tweets
# return map of username to count within timeframe
    return user_tweet_map
