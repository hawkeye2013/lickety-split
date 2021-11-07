console.log('Server.ts 1');
import http from 'http';
import { Router } from './Router';
class Server {
  server: http.Server | undefined = undefined;
  router: Router = new Router();

  listen(port: number, cb: Function) {
    console.log('Server.ts 2');
    this.server = http.createServer(function (req, res) {

    });
    this.server.on('request', (request, response) => {
      // get the appropriate handler from the router 
      const handler = this.router.route(request);
      // execute handler; return response 
      console.log(request.url);
      console.log(handler);
      response.writeHead(200);
      response.end(handler(request, response));
    });
    this.server.listen(port);
  }

  _register(method: String, path: String, handler: Function) {
    this.router.register(method, path, handler);
  }

  get(path: String, handler: Function) {
    // register a handler function for HTTP GET method for this path
    this._register('GET', path, handler);
  }

  post(path: String, handler: Function) {
    // register a handler function for HTTP POST method for this path
    this._register('POST', path, handler);
  }

  put(path: String, handler: Function) {
    // register a handler function for HTTP PUT method for this path
    this._register('PUT', path, handler);
  }

  delete(path: String, handler: Function) {
    // register a handler function for HTTP DELETE method for this path
    this._register('DELETE', path, handler);
  }
}
console.log('Server.ts 3');
export { Server };