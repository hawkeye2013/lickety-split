import http from 'http';
import { Router } from './Router';
import { RequestListener } from 'http';
import { ServerConstructorOptions } from './interfaces/Server.interface';
import { Route } from './Route';
import { HandlerMethods } from './interfaces/Base.interface';
import { convertMethodToEnum } from './utils/convertMethodToEnum';
import { removeLeadingSlash } from './utils/removeLeadingSlash';

class Server {
  private routes: Array<Router | Route>;
  cb: RequestListener | undefined;
  server: http.Server;
  serverOptions: ServerConstructorOptions;

  constructor(options: ServerConstructorOptions) {
    this.serverOptions = options;

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
          const matchingRoute = this.match(parsedMethod, url);

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

  getRouters(): Array<Router> {
    return this.routes.filter(
      (element) => element instanceof Router,
    ) as Router[];
  }

  getRoutes(): Array<Route> {
    return this.routes.filter((element) => element instanceof Route) as Route[];
  }

  register(artifact: Route | Router) {
    if (artifact instanceof Router) {
      this.registerRouter(artifact as Router);
    } else {
      this.registerRoute(artifact as Route);
    }
  }

  registerRouter(artifact: Router) {
    artifact.path = removeLeadingSlash(artifact.path);

    const pathElements = artifact.path.split('/');

    if (pathElements.length > 1) {
      const intermediateRouter = new Router({
        path: pathElements[0],
      });

      intermediateRouter.register(
        new Router({
          path: pathElements.slice(1).join('/'),
        }),
      );

      this.routes.push(intermediateRouter);
    } else {
      this.routes.push(artifact);
    }
  }

  registerRoute(artifact: Route) {
    const newRoute = artifact;

    if (artifact.path === '/' || artifact.path === '') {
      newRoute.path === '/';
    }

    this.routes.push(newRoute);
  }

  match(method: HandlerMethods, path: String): Route | undefined {
    for (const element of this.routes) {
      const match = element.match(method, path);

      if (match) {
        return match;
      }
    }

    return undefined;
  }

  private _register(method: HandlerMethods, path: String, handler: Function) {
    const newRoute = new Route({ method, path, handler });

    this.routes.push(newRoute);
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
