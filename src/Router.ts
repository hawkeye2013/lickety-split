import { Route } from './Route';
import { IRouter } from './interfaces/Router.interface';
import { RouterConstructorOptions } from './interfaces/Router.interface';
import { HandlerMethods } from './interfaces/Base.interface';
import { removeLeadingSlash } from './utils/removeLeadingSlash';
import { IncomingMessage } from 'http';

class Router implements IRouter {
  path: String;
  private routes: Array<Router | Route>;
  constructor(options: RouterConstructorOptions) {
    this.routes = new Array<Router | Route>();
    this.path = options.path;
  }
  route(request: IncomingMessage): Function {
    throw new Error('Method not implemented.');
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
    this.routes.push(artifact);
  }

  registerRoute(artifact: Route) {
    const { path } = artifact;

    if (path === '/' || path === '') {
      this.registerRouteOnRootPath(artifact);
    } else {
      this.registerRouteOnSubPath(artifact);
    }
  }

  registerRouteOnRootPath(artifact: Route) {
    const { method, path, handler } = artifact;

    if (
      this.getRoutes().find(
        (route) => route.method === method && route.path === '/',
      )
    ) {
      throw Error(
        `Route has already been registered with ${method} ${path} ${handler}`,
      );
    } else {
      let route = new Route({ method, path: '/', handler });
      this.routes.push(route);
    }
  }

  registerRouteOnSubPath(artifact: Route) {
    const { path, method } = artifact;

    let pathElements = removeLeadingSlash(path).split('/');

    this.routes.push(artifact);
  }

  hasExistingPath(method: HandlerMethods, path: String) {
    this.routes.find((route) => {
      if (route instanceof Route) {
        return route.method === method && route.path === path;
      } else {
        return route.path === path;
      }
    });
  }

  match(): Route | undefined {
    return new Route({
      path: '/',
      method: 'GET',
      handler: () => {},
    });
  }
}
export { Router };
