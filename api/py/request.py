#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler
import oauth2
import json
from . import globalvars

class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(str(oauth_req('followers/ids.json?screen_name=strongtakes')).encode())
        return


def oauth_req(url_suffix, key=globalvars.ACCESS_KEY, secret=globalvars.ACCESS_SECRET, http_method='GET', post_body='', http_headers=None):
    url = globalvars.API_BASE_URL + '/' + url_suffix
    consumer = oauth2.Consumer(key=globalvars.CONSUMER_KEY, secret=globalvars.CONSUMER_SECRET)
    token = oauth2.Token(key=key, secret=secret)
    client = oauth2.Client(consumer, token)
    resp, content = client.request(url, method=http_method, body=post_body.encode(), headers=http_headers)
    # print('RESP: ' + str(resp))
    return json.loads(content)


home_timeline = oauth_req('statuses/home_timeline.json')
followers = oauth_req('followers/ids.json?screen_name=strongtakes')
# follows = oauth_req(API_BASE_URL + '/friends/ids.json?screen_name=strongtakes')
# print(json.dumps(home_timeline, indent=4))
print(json.dumps(followers, indent=4))
# print(json.dumps(follows, indent=4))