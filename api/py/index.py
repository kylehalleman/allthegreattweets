#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
# from core import request
import datetime
import oauth2
import threading
import time

API_BASE_URL = 'https://api.twitter.com/1.1'

MAX_USERS = 900
MAX_TWEETS = '&count=200'
INCLUDE_RTS = '&include_rts=1'
EXCLUDE_REPLIES = '&exclude_replies=0'

class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        helper = TwitterApiHelper()
        content_type, output = helper.get_request_output(self.path)
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.end_headers()
        self.wfile.write(output.encode())
        return


class TwitterApiHelper:
    def __init__(self):
        self.keys = {
            'CONSUMER_KEY': 'fqYAlU6lRpoFvWiOrTaSgRmHz',
            'CONSUMER_SECRET': 'sdNJzBDMaRGQ1UAcpmJYeFQLygCyvxeTQpEnjJ5xiLFOvvAm97',
            'ACCESS_KEY': '497370998-0bvV05BIwtWaGwHPAcJKorp0nvcYzTa9RLaFOhbV',
            'ACCESS_SECRET': '8GsBrTgwniofjWUvWpifiOevcYsJg3pYul8JziXgTn3H6'
        }

    def get_request_output(self, path):
        content_type = 'application/text'
        path_prefix = '/api/py?'
        if not path.startswith(path_prefix):
            output = 'Expected path to start with "' + path_prefix + '". Actual: "' + path + '"'
        else:
            params = parse_qs(path[len(path_prefix):])
            if 'name' not in params:
                output = 'Expected "name" query param. params: ' + str(params) + '. path: ' + path
            else:
                names = params['name']
                if len(names) == 0:
                    output = 'no name provided'
                else:
                    content_type = 'application/json'
                    username = params['name'][0]
                    user_tweet_map = self.get_followed_tweets(self.get_followed_usernames(username))
                    output = self.format_user_tweets(user_tweet_map)

        return content_type, output

    def oauth_req(self, url_suffix, http_method='GET', post_body='', http_headers=None):
        url = API_BASE_URL + '/' + url_suffix
        consumer = oauth2.Consumer(key=self.keys['CONSUMER_KEY'], secret=self.keys['CONSUMER_SECRET'])
        token = oauth2.Token(key=self.keys['ACCESS_KEY'], secret=self.keys['ACCESS_SECRET'])
        client = oauth2.Client(consumer, token)
        resp, content = client.request(url, method=http_method, body=post_body.encode(), headers=http_headers)
        return json.loads(content.decode())

    def get_followed_usernames(self, username):
        """obtain list of followed accounts. return up to 900 screen names in list"""
        follows_json = self.oauth_req('friends/list.json?screen_name=' + username + '&count=200')
        user_list = follows_json['users']
        usernames = [x['screen_name'] for x in user_list]
        print('Num follows: ' + str(len(usernames)))
        return usernames

    def get_user_followed_tweets(self, username, user_tweet_map):
        user_tweets = 0
        tweets_list = self.oauth_req('statuses/user_timeline.json?screen_name=' + str(username) + '&trim_user=true' + EXCLUDE_REPLIES + INCLUDE_RTS + MAX_TWEETS)
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
            if numdays < 7:
                user_tweets += 1
        user_tweet_map[username] = user_tweets

    def get_followed_tweets(self, usernames):
        """for each item in list of usernames, obtain up to 200 tweets"""
        user_tweet_map = {}
        max_index = MAX_USERS if len(usernames) > MAX_USERS else len(usernames)
        complete = max_index
        start_index = 0

        while complete > 0:
            for username in usernames[start_index:start_index+5]:
                task = threading.Thread(target=self.get_user_followed_tweets, args=(username, user_tweet_map))
                task.start()
            time.sleep(1)
            start_index += 5
            complete -= 5

        # return map of username to count within timeframe
        return user_tweet_map

    def format_user_tweets(self, user_tweet_map):
        json_obj = {}
        following_list = []
        for username in user_tweet_map:
            user_data = {'username': username, 'tweets': user_tweet_map[username]}
            following_list.append(user_data)
        json_obj['following'] = following_list
        return json.dumps(json_obj, indent=2)


def do_test():
    start_time = time.time()
    helper = TwitterApiHelper()
    content_type, content = helper.get_request_output('/api/py?name=MiniMooosey')
    print(content_type)
    print(content)
    print("--- %s seconds ---" % (time.time() - start_time))


if __name__ == '__main__':
    do_test()
