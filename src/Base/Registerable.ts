import { Route, Router } from '..';
import { HandlerMethods } from '../interfaces/Base.interface';
import { removeLeadingSlash } from '../utils/removeLeadingSlash';

export class Registerable {
  protected routes: Array<Router | Route>;

  constructor() {
    this.routes = new Array<Router | Route>();
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
      ).then(
        intermediateRouter => {
          this.routes.push(intermediateRouter);
        }
      ).catch(error => {throw error});

      
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

  private _register(method: HandlerMethods, path: String, handler: Function) {
    const newRoute = new Route({ method, path, handler });
    this.routes.push(newRoute); 
    this.register(newRoute);
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
