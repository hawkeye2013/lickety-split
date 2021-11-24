import http from 'http';
import {Router} from './Router';
import {RequestListener, IncomingMessage, ServerResponse} from "http";
import Request from './Request';
import Response from './Response';

class Server {
  server: http.Server;
  router: Router;
  cb: RequestListener;
  serverOptions: {};

  constructor(){
    this.serverOptions =  {
      IncomingMessage: Request,
      ServerResponse: Response
    }
    this.router = new Router();
    this.cb = (request, response) => {
      // get the appropriate handler from the router
      try{
        const handler = this.router.route(request);
        if (handler === undefined) {
          // no route defined
          response.writeHead(404);
          response.end(JSON.stringify({'error':'Resource not found'}))
        }
        else{
          // route defined with associated handler
          response.writeHead(200);
          response.end(handler!(request, response));
        }
      } catch (error){
        response.writeHead(500);
        response.end(JSON.stringify(
          {'error': error}
        ))
      }
    };
    this.server = http.createServer(this.serverOptions, this.cb);
  }

  callback(){
    return this.cb;
  }

  listen(port: number, callback: () => void) {
    return this.server.listen(port, callback);
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
export {Server};