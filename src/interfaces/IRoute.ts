export interface IRoute {
    // a route consists of an HTTP method, a URL path, and a handler function
    method : String ;
    path : String ;
    handler : Function ;
    routes: Array<IRoute> ;
}
