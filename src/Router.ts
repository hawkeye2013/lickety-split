import { Route } from "./Route";
import http from "http";
class Router {
    _routes: Array<Route> = new Array<Route>();
    _fallback_handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
        response.end(JSON.stringify({
            'error': `no handler defined for ${request.method} ${request.url}`
        }))
    } 

    register(method: String, path: String, handler: Function){
        this._routes.push(new Route(method, path, handler));
    }

    
    route(request: http.IncomingMessage){
        // route a given request to the appropriate handler based on the method and URL. 
        // return the handler ; if no route, use fall back handler
        let route = this._routes.find(
            route =>  route.method === request.method && route.path === request.url
        );
        return (route === undefined) ? this._fallback_handler : route.handler;
    }
}

export { Router };
