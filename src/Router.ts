import { Route } from "./Route";
import Request from "./Request";
import http from "http";
class Router {
    /* _routes is a top level Route array containing one root path (/) route
    for each HTTP method; subroutes are defined recursively on each of those top
    level routes */
    _routes: Array<Route>;
    constructor() {
        this._routes = new Array<Route>();
    }

    _fallback_handler = (request: Request, response: http.ServerResponse) => {
        response.end(JSON.stringify({
            'error': `no handler defined for ${request.method} ${request.url}`
        }))
    }

    _register_recursive(method: String, path_elems: Array<String>, handler: Function): Route {
        /* Recursive helper method for route registration */
        if (path_elems.length == 1) {
            // end of path, apply handler to this route
            return new Route(method, path_elems.shift()!, handler);
        } else {
            // more subpaths to traverse; handler does not apply to this path yet
            let currentPathElem = path_elems.shift();
            let currentPathRoute = new Route(method, currentPathElem!);
            return currentPathRoute.addSubRoute(this._register_recursive(method, path_elems, handler));
        }
    }

    register(method: String, path: String, handler: Function) {
        /* Register a new route */
        if (path === '/' || path === '') {
            let rootRoute = new Route(method, '/', handler);
            this._routes.push(rootRoute);
        } else {
            let path_elems = path.split('/');
            if (path_elems[0] === '') path_elems.shift();
            let rootRouteForCurrMethod = this._routes.find(
                route => route.method === method && route.path === '/'
            );
            if (! rootRouteForCurrMethod){
                throw Error('You need to register a root path (/) handler for the ' + method + ' method');
            }
            return rootRouteForCurrMethod.addSubRoute(
                this._register_recursive(method, path_elems, handler)
            );
        }
    }


    // FIXME: need to implement stack mechanism so you can try a subpath and return to try another subpath if that one fails
    _recursive_route(request: Request, request_method: String, request_path_elems: Array<String>, traversedRoute: Route, parameterMap: any) : Route | undefined{
        if (request_path_elems.length == 1){
            console.log('Route Base Case, path elems = ' + request_path_elems);
            console.log('Traversed so far: ' + traversedRoute);
            let currentPathElem = request_path_elems.shift();
            let subroute = traversedRoute.subRoutes.find(
                route => route.method === request_method &&
                ( route.path === currentPathElem || route.path.includes(':'))
            )
            console.log('subroute: ' + subroute);
            if (subroute) {
                if (subroute?.path.includes(':')){
                    console.log('updating parameter map!')
                    parameterMap[subroute!.path.slice(1)] = currentPathElem;
                    console.log(parameterMap);
                }
                try{
                // update request with parameter map before executing handler
                // which takes the request as argument
                console.log('updating request with parameter map');
                request.setParams(parameterMap);
                console.log('successfully updated request with parameter map');
                } catch(error){
                    console.log(error);
                }             }
            // fixme: do something with parameter map, needs to be added to request before handler execution
            return subroute;
        } else {
            console.log('Path elems = ' + request_path_elems);
            console.log('Traversed so far: ' + traversedRoute);
            let currentPathElem = request_path_elems.shift();
            console.log('Current path elem: ' + currentPathElem);
            console.log('Available subroutes: ' + traversedRoute.subRoutes);
            let subroute = traversedRoute.subRoutes.find(
                route => route.method === request_method &&
                    (route.path === currentPathElem || route.path.includes(':') )
            )
            if (subroute && subroute?.path.includes(':')){
                console.log('updating parameter map');
                parameterMap[subroute!.path.slice(1)] = currentPathElem;
                console.log(parameterMap);
            }
            console.log('subroute found? ' + subroute);
            return (subroute) ? this._recursive_route(request, request_method, request_path_elems, subroute, parameterMap) : undefined;
        }
    }

    route(req: http.IncomingMessage) {
        let request = req as Request;
        let route = undefined;
        // FIXME: this assumes that root route / has been registered
        console.log('Request: ' + request.method + ' ' + request.url);
        let rootRoute = this._routes.find(
            route => route.method === request.method && route.path === '/'
        );
        if (! rootRoute){
            throw Error('You need to register a handler for your root path "/"');
        }
        if (request.url === '/' || request.url === ''){
            route = rootRoute;
        } else {
            // more than just root. match on first element, then next, then next,
            // until no match or until match last element of request URL.
            console.log('Recursing to find route');
            let request_path_elems = request.url?.split('/')!;
            if (request_path_elems[0] === '') {
                console.log('empty string');
                request_path_elems.shift();
            }
            route = this._recursive_route(request, request.method!, request_path_elems, rootRoute!, {})
            console.log('result of recursive route: ' + route);
        }
        return (route === undefined) ? null : route.handler;
    }



}
export { Router };