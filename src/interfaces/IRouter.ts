import {IRoute} from "./IRoute";
import http from "http";
export interface IRouter {
    register(method: String, path: String, handler: Function): void;
    route(request: http.IncomingMessage) : Function;
}