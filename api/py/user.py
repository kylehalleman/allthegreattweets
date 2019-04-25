#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
from . import request


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        query_string = self.path
        params = parse_qs(query_string[2:])
        username = params['name']
        self.wfile.write(str(request.oauth_req('friends/ids.json?screen_name=' + username)).encode())
        return
