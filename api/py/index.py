#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
# from core import request
import datetime
import oauth2

API_BASE_URL = 'https://api.twitter.com/1.1'

CONSUMER_KEY = 'fqYAlU6lRpoFvWiOrTaSgRmHz'
CONSUMER_SECRET = 'sdNJzBDMaRGQ1UAcpmJYeFQLygCyvxeTQpEnjJ5xiLFOvvAm97'

ACCESS_KEY = '497370998-0bvV05BIwtWaGwHPAcJKorp0nvcYzTa9RLaFOhbV'
ACCESS_SECRET = '8GsBrTgwniofjWUvWpifiOevcYsJg3pYul8JziXgTn3H6'

MAX_TWEETS = '&count=200'
MAX_USERS = 900
INCLUDE_RTS = '&include_rts=1'
EXCLUDE_REPLIES = '&exclude_replies=0'


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        output_str = ''
        query_string = self.path
        if len(query_string) < 2:
            output_str = 'No query param supplied.'
        else:
            params = parse_qs(query_string[2:])
            if 'name' not in params:
                output_str = 'Expected "name" query param.'
            else:
                username = params['name']
                self.wfile.write('queried: ' + username)
                output = self.get_followed_tweets(self.get_followed_usernames(username))
                json_obj = {}
                following_list = []
                for username in output:
                    user_data = {'username': username, 'tweets': output[username]}
                    following_list.append(user_data)
                json_obj['following'] = following_list
                output_str = json.dumps(json_obj, indent=2)
        self.wfile.write(output_str.encode())
        return

    def oauth_req(self, url_suffix, key=ACCESS_KEY, secret=ACCESS_SECRET, http_method='GET', post_body='', http_headers=None):
        url = API_BASE_URL + '/' + url_suffix
        consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
        token = oauth2.Token(key=key, secret=secret)
        client = oauth2.Client(consumer, token)
        resp, content = client.request(url, method=http_method, body=post_body.encode(), headers=http_headers)
        # print('RESP: ' + str(resp))
        return json.loads(content.decode())

    def get_followed_usernames(self, username):
        """obtain list of followed accounts. return up to 900 screen names in list"""
        follows_json = self.oauth_req('friends/list.json?screen_name=' + username)
        user_list = follows_json['users']
        usernames = [x['screen_name'] for x in user_list]
        return usernames

    def get_followed_tweets(self, usernames):
        """for each item in list of usernames, obtain up to 200 tweets"""
        user_tweet_map = {}
        max_index = MAX_USERS if len(usernames) > MAX_USERS else len(usernames)
        for username in usernames[:max_index]:
            user_tweets = 0
            tweets_list = self.oauth_req('statuses/user_timeline.json?screen_name=' + str(username) + EXCLUDE_REPLIES + INCLUDE_RTS + MAX_TWEETS)
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
