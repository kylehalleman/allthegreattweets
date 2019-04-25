#!usr/bin/env python3

from http.server import BaseHTTPRequestHandler


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(str("Hello from Python on Now 2.0!").encode())
        return

    #return the following information to the frontend:
    ## number of followed twitters surveyed (900 max)
    ## timeframe surveyed
    ## listing of twitter username - tweet count
