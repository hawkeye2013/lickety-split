class Route {
    // a route consists of an HTTP method, a URL path, and a handler function 
    method : String ;
    path : String ;
    handler : Function ;

    constructor(method: String, path: String, handler: Function){
        this.method = method;
        this.path = path;
        this.handler = handler;
    }
}
export {Route};
