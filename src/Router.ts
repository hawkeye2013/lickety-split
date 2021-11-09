import {Route} from "./Route";
import http from "http";
class Router {
    _routes: Array<Route>;
    
    constructor(){
        this._routes = new Array<Route>();
    }

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
        // FIXME: need to handle path variables; e.g. if you register /friends/:_id,
        // need to know to route a request for /friends/5 to that route
        return (route === undefined) ? null : route.handler;
    }
}
export {Router};
