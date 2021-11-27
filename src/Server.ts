import http from 'http';
import { Router } from './Router';
import { RequestListener } from 'http';
import { ServerConstructorOptions } from './interfaces/Server.interface';
import { Route } from './Route';
import { HandlerMethods } from './interfaces/Base.interface';
import { convertMethodToEnum } from './utils/convertMethodToEnum';
import { RouteConstructorOptions } from './interfaces/Route.interface';

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
            this.executeMatchingRoute(request, response, matchingRoute);
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

  executeMatchingRoute(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    route: Route,
  ) {
    // TODO: Execute Function and get response code from that
    response.writeHead(200);
    response.end(route.handler!(request, response));
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

  register(
    method: HandlerMethods,
    path: String,
    handler: Function,
    options?: RouteConstructorOptions,
  ) {
    const newRoute = new Route({ ...options, method, path, handler });

    this.routes.push(newRoute);

    this.rootRouter.register(newRoute);
  }

  get(path: String, handler: Function, options?: RouteConstructorOptions) {
    this.register('GET', path, handler, options);
  }

  post(path: String, handler: Function, options?: RouteConstructorOptions) {
    this.register('POST', path, handler, options);
  }

  put(path: String, handler: Function, options?: RouteConstructorOptions) {
    this.register('PUT', path, handler, options);
  }

  delete(path: String, handler: Function, options?: RouteConstructorOptions) {
    this.register('DELETE', path, handler, options);
  }
}
export { Server };
