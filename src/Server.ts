import http from 'http';

class Server {
  server: http.Server | undefined = undefined;

  listen(port: number, cb: Function) {
    this.server = http.createServer(function (req, res) {
      res.writeHead(200);
      res.end('Hello, World!');
    });

    this.server.listen(port);
  }
}

export { Server };
