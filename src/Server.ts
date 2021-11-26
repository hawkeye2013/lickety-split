import http from 'http';
import { Router } from './Router';
import { RequestListener } from 'http';
import Request from './Request';
import Response from './Response';
import { ServerConstructorOptions } from './interfaces/Server.interface';
import { Route } from './Route';
import { HandlerMethods } from './interfaces/Base.interface';
import { convertMethodToEnum } from './utils/convertMethodToEnum';

class Server {
  rootRouter: Router;
  private routes: Array<Router | Route>;
  cb: RequestListener | undefined;
  serverOptions: ServerConstructorOptions;

  constructor(options: ServerConstructorOptions) {
    this.serverOptions = options;

    this.rootRouter = new Router({
      path: '/',
    });

    this.routes = [];

    this.setCallback();
  }

  setCallback() {
    this.cb = (
      request: http.IncomingMessage,
      response: http.ServerResponse,
    ) => {
      try {
        const { method, url } = request;

        const parsedMethod = convertMethodToEnum(method);

        if (parsedMethod !== undefined && url !== undefined) {
          const handler = this.rootRouter.match(parsedMethod, url);
          if (!handler) {
            response.writeHead(404);
            response.end(JSON.stringify({ error: 'Resource not found' }));
          } else {
            // TODO: Execute Function and get response code from that
            response.writeHead(200);
            response.end(handler!(request, response));
          }
        } else {
          // TODO: Add Handler if these are undefined, they shouldn't be but who knows...
        }
      } catch (error) {
        console.log(error);
        response.writeHead(500);
        response.end(JSON.stringify({ error: error }));
      }
    };
  }

  listen(port: number, callback: () => void) {
    const server = http.createServer(this.cb);
    return server.listen(port, callback);
  }

  _register(method: HandlerMethods, path: String, handler: Function) {
    const newRoute = new Route({ method, path, handler });

    this.routes.push(newRoute);

    this.rootRouter.register(newRoute);
  }

  get(path: String, handler: Function) {
    this._register('GET', path, handler);
  }

  post(path: String, handler: Function) {
    this._register('POST', path, handler);
  }

  put(path: String, handler: Function) {
    this._register('PUT', path, handler);
  }

  delete(path: String, handler: Function) {
    this._register('DELETE', path, handler);
  }
}
export { Server };
