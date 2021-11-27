import http from 'http';
import { Router } from './Router';
import { RequestListener } from 'http';
import { ServerConstructorOptions } from './interfaces/Server.interface';
import { Route } from './Route';
import { HandlerMethods } from './interfaces/Base.interface';
import { convertMethodToEnum } from './utils/convertMethodToEnum';
import { removeLeadingSlash } from './utils/removeLeadingSlash';

class Server {
  rootRouter: Router;
  private routes: Array<Router | Route>;
  cb: RequestListener | undefined;
  server: http.Server;
  serverOptions: ServerConstructorOptions;

  constructor(options: ServerConstructorOptions) {
    this.serverOptions = options;

    this.rootRouter = new Router({
      path: '/',
    });

    this.routes = [];

    this.setCallback();

    this.server = http.createServer(
      {
        IncomingMessage: http.IncomingMessage,
        ServerResponse: http.ServerResponse,
      },
      this.cb,
    );
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
          const matchingRoute = this.rootRouter.match(parsedMethod, url);

          if (!matchingRoute) {
            response.writeHead(404);
            response.end(JSON.stringify({ error: 'Resource not found' }));
          } else {
            // TODO: Execute Function and get response code from that
            response.writeHead(200);
            response.end(matchingRoute.handler!(request, response));
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

  address() {
    return this.server.address();
  }

  callback() {
    return this.cb;
  }

  listen(port: number, callback: () => void) {
    return this.server.listen(port, callback);
  }

  private _register(method: HandlerMethods, path: String, handler: Function) {
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
