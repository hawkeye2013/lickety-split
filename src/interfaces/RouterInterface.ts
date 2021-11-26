import http from 'http';
import { RoutingBase } from './RoutingBase';
import { RouteHandler } from './Route.interface';

export interface Router extends RoutingBase {
  register(method: String, path: String, handler: RouteHandler): void;
  route(request: http.IncomingMessage): RouteHandler;
}

export type RouterConstructorOptions = {};
