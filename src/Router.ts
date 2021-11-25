import { Route } from './Route';
import Request from './Request';
import http from 'http';
class Router {
  /* _routes is a top level Route array containing one root path (/) route
    for each HTTP method; SubRoutes are defined recursively on each of those top
    level routes */
  _routes: Array<Route>;
  constructor() {
    this._routes = new Array<Route>();
  }

  _fallback_handler = (request: Request, response: http.ServerResponse) => {
    response.end(
      JSON.stringify({
        error: `no handler defined for ${request.method} ${request.url}`,
      }),
    );
  };

  _register_recursive(
    method: String,
    path_elems: Array<String>,
    handler: Function,
    previousRoute: Route,
  ): Route | undefined {
    /* Recursive helper method for route registration */
    if (path_elems.length == 1) {
      // end of path, apply handler to this route
      let currentPathElem = path_elems.shift()!;
      // FIXME: only create a new route if there are no existing routes at this level with the same method and path
      let existingRoute = previousRoute.subRoutes.find(
        (route) => route.method === method && route.path === currentPathElem,
      );
      if (existingRoute) {
        return existingRoute.setHandler(handler);
      } else {
        return new Route(method, currentPathElem, handler);
      }
    } else {
      // more subpaths to traverse; handler does not apply to this path yet
      let currentPathElem = path_elems.shift();
      // FIXME: only create a new route if there are no existing routes at this level with the same method and path
      let existingRoute = previousRoute.subRoutes.find(
        (route) => route.method === method && route.path === currentPathElem,
      );
      let currentPathRoute = existingRoute
        ? existingRoute
        : new Route(method, currentPathElem!);
      let subroute = this._register_recursive(
        method,
        path_elems,
        handler,
        currentPathRoute,
      );
      let route;
      if (subroute) {
        route = currentPathRoute.addSubRoute(subroute);
      } else {
        route = currentPathRoute.setHandler(handler);
      }
      return route;
    }
  }

  register(method: String, path: String, handler: Function) {
    if (path === '/' || path === '') {
      if (
        this._routes.find(
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
        let route = new Route(method, '/', handler);
        this._routes.push(route);
      }
    } else {
      // register a more complex path, e.g. /path/to/something
      let path_elems = path.split('/');
      if (path_elems[path_elems.length - 1] === '') {
        path_elems.pop();
      }
      if (path_elems[0] === '') {
        path_elems.shift();
      }
      let rootRouteForThisMethod = this._routes.find(
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
        path_elems,
        handler,
        rootRouteForThisMethod,
      )!;
      return rootRouteForThisMethod.addSubRoute(subroute);
    }
  }

  _recursive_route(
    request: Request,
    request_method: String,
    request_path_elems: Array<String>,
    traversedRoute: Route,
    parameterMap: any,
    ignoreRoutes: Array<Route>,
  ): Route | undefined {
    if (request_path_elems.length == 1) {
      let currentPathElem = request_path_elems.shift();
      let subroute = traversedRoute.subRoutes.find(
        (route) =>
          route.method === request_method &&
          (route.path === currentPathElem || route.path.includes(':')),
      );
      if (subroute) {
        if (subroute?.path.includes(':')) {
          parameterMap[subroute!.path.slice(1)] = currentPathElem;
        }
        try {
          // update request with parameter map before executing handler
          // which takes the request as argument
          request.setParams(parameterMap);
        } catch (error) {
          console.trace();
        }
      }
      // subroute may be undefined anyway; even if it is not, only
      // return it if it's not to be ignored
      return subroute && !ignoreRoutes.includes(subroute)
        ? subroute
        : undefined;
    } else {
      // more than one path element
      let currentPathElem = request_path_elems.shift();
      let subroute = traversedRoute.subRoutes.find(
        (route) =>
          route.method === request_method &&
          (route.path === currentPathElem || route.path.includes(':')),
      );
      if (subroute && subroute?.path.includes(':')) {
        parameterMap[subroute!.path.slice(1)] = currentPathElem;
      }
      if (subroute) {
        let route = this._recursive_route(
          request,
          request_method,
          request_path_elems,
          subroute,
          parameterMap,
          ignoreRoutes,
        );
        return route;
      } else {
        return undefined;
      }
    }
  }

  route(req: http.IncomingMessage) {
    let request = req as Request;
    let route = undefined;
    let rootRoute = this._routes.find(
      (route) => route.method === request.method && route.path === '/',
    );
    if (!rootRoute) {
      throw Error('You need to register a handler for your root path "/"');
    }
    if (request.url?.trim() === '/' || request.url?.trim() === '') {
      route = rootRoute;
    } else {
      // more than just root. match on first element, then next, then next,
      // until no match or until match last element of request URL.

      let request_path_elems = request.url?.split('/')!;

      if (request_path_elems[request_path_elems.length - 1] === '') {
        request_path_elems.pop();
      }
      if (request_path_elems[0] === '') {
        request_path_elems.shift();
      }

      // in case there is potential to match the first of multiple parent paths where the first is not the right one
      // last parameter says "ignore these routes"
      route = this._recursive_route(
        request,
        request.method!,
        request_path_elems,
        rootRoute!,
        {},
        [],
      );
      let improper_matches = [];
      while (route != undefined && route.handler == undefined) {
        improper_matches.push(route);
        console.log('trying');
        route = this._recursive_route(
          request,
          request.method!,
          request_path_elems,
          rootRoute!,
          {},
          improper_matches,
        );
        console.log(`route: ${route}`);
      }
    }
    return route === undefined ? undefined : route.handler;
  }
}
export { Router };

