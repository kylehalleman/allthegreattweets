#!usr/bin/env python3

import oauth2
import json

API_BASE_URL = 'https://api.twitter.com/1.1'

CONSUMER_KEY = 'fqYAlU6lRpoFvWiOrTaSgRmHz'
CONSUMER_SECRET = 'sdNJzBDMaRGQ1UAcpmJYeFQLygCyvxeTQpEnjJ5xiLFOvvAm97'

ACCESS_KEY = '497370998-0bvV05BIwtWaGwHPAcJKorp0nvcYzTa9RLaFOhbV'
ACCESS_SECRET = '8GsBrTgwniofjWUvWpifiOevcYsJg3pYul8JziXgTn3H6'


def oauth_req(url, key=ACCESS_KEY, secret=ACCESS_SECRET, http_method='GET', post_body='', http_headers=None):
    consumer = oauth2.Consumer(key=CONSUMER_KEY, secret=CONSUMER_SECRET)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request(url, method=http_method, body=post_body.encode(), headers=http_headers)
    # print('RESP: ' + str(resp))
    return json.loads(content)


home_timeline = oauth_req(API_BASE_URL + '/statuses/home_timeline.json')
followers = oauth_req(API_BASE_URL + '/followers/ids.json?screen_name=strongtakes')
# follows = oauth_req(API_BASE_URL + '/friends/ids.json?screen_name=strongtakes')
# print(json.dumps(home_timeline, indent=4))
print(json.dumps(followers, indent=4))
# print(json.dumps(follows, indent=4))