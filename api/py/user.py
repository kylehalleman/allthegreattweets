#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
from core import request


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        query_string = self.path
        params = parse_qs(query_string[2:])
        username = params['name']
        output = request.get_followed_tweets(request.get_followed_usernames(username))
        json_obj = {}
        following_list = []
        for username in output:
            user_data = {'username': username, 'tweets': output[username]}
            following_list.append(user_data)
        json_obj['following'] = following_list
        self.wfile.write(json.dumps(json_obj, indent=2).encode())
        return
