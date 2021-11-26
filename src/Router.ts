import { Route } from './Route';
import Request from './Request';
import { RouterConstructorOptions } from './interfaces/RouterInterface';
import { HandlerMethods } from './interfaces/Base.interface';
class Router {
  type = 'ROUTER';
  private routes: Array<Router | Route>;
  constructor(options: RouterConstructorOptions) {
    this.routes = new Array<Router | Route>();
  }

  // _fallback_handler = (request: Request, response: http.ServerResponse) => {
  //   response.end(
  //     JSON.stringify({
  //       error: `no handler defined for ${request.method} ${request.url}`,
  //     }),
  //   );
  // };

  // _register_recursive(
  //   method: String,
  //   pathElements: Array<String>,
  //   handler: Function,
  //   previousRoute: Route,
  // ): Route | undefined {
  //   /* Recursive helper method for route registration */
  //   if (pathElements.length == 1) {
  //     // end of path, apply handler to this route
  //     let currentPathElem = pathElements.shift()!;
  //     // FIXME: only create a new route if there are no existing routes at this level with the same method and path
  //     let existingRoute = previousRoute.subRoutes.find(
  //       (route) => route.method === method && route.path === currentPathElem,
  //     );
  //     if (existingRoute) {
  //       return existingRoute.setHandler(handler);
  //     } else {
  //       return new Route(method, currentPathElem, handler);
  //     }
  //   } else {
  //     // more subpaths to traverse; handler does not apply to this path yet
  //     let currentPathElem = pathElements.shift();
  //     // FIXME: only create a new route if there are no existing routes at this level with the same method and path
  //     let existingRoute = previousRoute.subRoutes.find(
  //       (route) => route.method === method && route.path === currentPathElem,
  //     );
  //     let currentPathRoute = existingRoute
  //       ? existingRoute
  //       : new Route(method, currentPathElem!);
  //     let subroute = this._register_recursive(
  //       method,
  //       pathElements,
  //       handler,
  //       currentPathRoute,
  //     );
  //     let route;
  //     if (subroute) {
  //       route = currentPathRoute.addSubRoute(subroute);
  //     } else {
  //       route = currentPathRoute.setHandler(handler);
  //     }
  //     return route;
  //   }
  // }

  register(artifact: Route | Router) {
    if (artifact instanceof Router) {
      this.registerRouter(artifact)
    } else {
      this.registerRoute(artifact)
    }
    
  }

  registerRouter(artifact: Router) {

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
    if (
      this.routes.find(
        (route) =>
          route.method === method &&
          route.path === '/' &&
          route.handler === handler,
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
    const {path, method } = this
    // register a more complex path, e.g. /path/to/something
    let pathElements = path.split('/');
    if (pathElements[pathElements.length - 1] === '') {
      pathElements.pop();
    }
    if (pathElements[0] === '') {
      pathElements.shift();
    }
    let rootRouteForThisMethod = this.routes.find(
      (route) => route.method === method && route.path === '/',
    );

    if (!rootRouteForThisMethod) {
      throw Error(
        'You need to register a root path (/) handler for the ' +
          method +
          ' method',
      );
    }

    let subroute = this._register_recursive(
      method,
      pathElements,
      handler,
      rootRouteForThisMethod,
    )!;
    return rootRouteForThisMethod.addSubRoute(subroute);
  }

  hasExistingPath(method: , path) {
    this.routes.find(
      (route) =>
        route.method === method &&
        route.path === '/' &&
        route.handler === handler,
    );
  }

  matchRoute(request: Request): Function {
    
  }

  // _recursive_route(
  //   request: Request,
  //   request_method: String,
  //   request_pathElements: Array<String>,
  //   traversedRoute: Route,
  //   parameterMap: any,
  //   ignoreRoutes: Array<Route>,
  // ): Route | undefined {
  //   if (request_pathElements.length == 1) {
  //     let currentPathElem = request_pathElements.shift();
  //     let subroute = traversedRoute.subRoutes.find(
  //       (route) =>
  //         route.method === request_method &&
  //         (route.path === currentPathElem || route.path.includes(':')),
  //     );
  //     if (subroute) {
  //       if (subroute?.path.includes(':')) {
  //         parameterMap[subroute!.path.slice(1)] = currentPathElem;
  //       }
  //       try {
  //         // update request with parameter map before executing handler
  //         // which takes the request as argument
  //         request.setParams(parameterMap);
  //       } catch (error) {
  //         console.trace();
  //       }
  //     }
  //     // subroute may be undefined anyway; even if it is not, only
  //     // return it if it's not to be ignored
  //     return subroute && !ignoreRoutes.includes(subroute)
  //       ? subroute
  //       : undefined;
  //   } else {
  //     // more than one path element
  //     let currentPathElem = request_pathElements.shift();
  //     let subroute = traversedRoute.subRoutes.find(
  //       (route) =>
  //         route.method === request_method &&
  //         (route.path === currentPathElem || route.path.includes(':')),
  //     );
  //     if (subroute && subroute?.path.includes(':')) {
  //       parameterMap[subroute!.path.slice(1)] = currentPathElem;
  //     }
  //     if (subroute) {
  //       let route = this._recursive_route(
  //         request,
  //         request_method,
  //         request_pathElements,
  //         subroute,
  //         parameterMap,
  //         ignoreRoutes,
  //       );
  //       return route;
  //     } else {
  //       return undefined;
  //     }
  //   }
  // }

  // route(req: http.IncomingMessage) {
  //   let request = req as Request;
  //   let route = undefined;
  //   let rootRoute = this._routes.find(
  //     (route) => route.method === request.method && route.path === '/',
  //   );
  //   if (!rootRoute) {
  //     throw Error('You need to register a handler for your root path "/"');
  //   }
  //   if (request.url?.trim() === '/' || request.url?.trim() === '') {
  //     route = rootRoute;
  //   } else {
  //     // more than just root. match on first element, then next, then next,
  //     // until no match or until match last element of request URL.

  //     let request_pathElements = request.url?.split('/')!;

  //     if (request_pathElements[request_pathElements.length - 1] === '') {
  //       request_pathElements.pop();
  //     }
  //     if (request_pathElements[0] === '') {
  //       request_pathElements.shift();
  //     }

  //     // in case there is potential to match the first of multiple parent paths where the first is not the right one
  //     // last parameter says "ignore these routes"
  //     route = this._recursive_route(
  //       request,
  //       request.method!,
  //       request_pathElements,
  //       rootRoute!,
  //       {},
  //       [],
  //     );
  //     let improper_matches = [];
  //     while (route != undefined && route.handler == undefined) {
  //       improper_matches.push(route);
  //       console.log('trying');
  //       route = this._recursive_route(
  //         request,
  //         request.method!,
  //         request_pathElements,
  //         rootRoute!,
  //         {},
  //         improper_matches,
  //       );
  //       console.log(`route: ${route}`);
  //     }
  //   }
  //   return route === undefined ? undefined : route.handler;
  // }
}
export { Router };
