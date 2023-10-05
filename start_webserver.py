#! /usr/bin/python
import SimpleHTTPServer, SocketServer
PORT = 8000
httpd = SocketServer.TCPServer(("", PORT), SimpleHTTPServer.SimpleHTTPRequestHandler)
httpd.allow_reuse_address = True
print "Serving at port", PORT
httpd.serve_forever()