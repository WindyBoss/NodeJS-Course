# Automatic mailing
Automatic mailing helps is created for massive mailing (newsletters, additional sign up mail verification, and so on).
## Libraries: 
1. [sendgrid](https://sendgrid.com/)
2. [nodemailer](https://nodemailer.com/about/) 


# Web-sockets
**Web-sockets** - connection protocol, which creates stable connection, which is based on "ping-pong" connection (regular fetches from server to check the connection) - "WebSocket handshake" in real time. Games, Chats or stock apps are based on this technology.
Lib: [socket.io](https://socket.io/)
Info: [mozilla](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

Definitions: 
1. Websocket message - message received by server or client
2. message handler - message handler function
3. Ping - fetch request from server or client to check the connection 
4. Pong - response for Ping request (if time between Ping and Pong is to big connection will close)
5. room - space of communication, where server can be connected to couple of users at the same time

Websocket test tools:
[amritb](https://amritb.github.io/socketio-client-tool/)
[amritb2](https://amritb.github.io/socketio-client-tool/v1/)
