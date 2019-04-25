#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from core import request


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        query_string = self.path
        params = parse_qs(query_string[2:])
        username = params['name']
        output = request.get_followed_tweets(request.get_followed_ids(username))
        self.wfile.write(str(output).encode())
        return
