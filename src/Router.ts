import fs from 'fs';
import { Route } from './Route';
import {
  IRouter,
  RouterConstructorOptions,
} from './interfaces/Router.interface';
import { HandlerMethods } from './interfaces/Base.interface';
import { removeLeadingSlash } from './utils/removeLeadingSlash';

class Router implements IRouter {
  path: String;
  method: HandlerMethods = 'GET';
  routes: Array<Router | Route>;

  constructor(options: RouterConstructorOptions) {
    this.routes = new Array<Router | Route>();
    this.path = options.path;
    this.method = options.method ? options.method : 'GET';
  }

  async register(artifact: Route | Router) {
    if (artifact instanceof Router) {
      await this.registerRouter(artifact as Router);
    } else {
      await this.registerRoute(artifact as Route);
    }
    return this;
  }

  async registerRouter(artifact: Router): Promise<Router> {
    artifact.path = removeLeadingSlash(artifact.path);
    const pathElements = artifact.path.split('/');
    if (!this.match(artifact.method, artifact.path)) {
      if (pathElements.length > 1) {
        let intermediateRouter = new Router({
          path: pathElements[0],
        });

        intermediateRouter = await intermediateRouter.register(
          new Router({
            path: pathElements.slice(1).join('/'),
          }),
        );

        this.routes.push(intermediateRouter);
      } else {
        this.routes.push(artifact);
      }
    }
    return this;
  }

  registerRoute(artifact: Route) {
    if (!this.match(artifact.method, artifact.path)) {
      const newRoute = artifact;
      if (artifact.path === '/' || artifact.path === '') {
        newRoute.path === '/';
      }
      this.routes.push(newRoute);
    }
    return this;
  }

  match(method: HandlerMethods, path: String): Route | undefined {
    const pathElements = path.split('/');

    for (const element of this.routes) {
      const match = element.match(
        method,
        pathElements.length > 1
          ? pathElements.slice(1).join('/')
          : pathElements.join('/'),
      );

      if (match) {
        return match;
      }
    }

    return undefined;
  }

  private _register(method: HandlerMethods, path: String, handler: Function) {
    const newRoute = new Route({ method, path, handler });
    this.routes.push(newRoute);
    this.register(newRoute)
      .then((r) => {})
      .catch((error) => {
        throw error;
      });
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

export { Router };
