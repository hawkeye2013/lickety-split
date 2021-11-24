class Route {
    // a route consists of an HTTP method, a URL path, and a handler function
    method : String ;
    path : String ;
    handler : Function | undefined;
    subRoutes: Array<Route>;
    constructor(method: String, path: String, handler?: Function){
        this.method = method;
        this.path = path;
        this.handler = handler;
        this.subRoutes = new Array<Route>();
    }
    addSubRoute(subRoute: Route){
        this.subRoutes.push(subRoute);
        return this;
    }

    public toString = () : string => {
        return `Route (${this.method} ${this.path} ${this.handler})`
    }
}
export {Route};
