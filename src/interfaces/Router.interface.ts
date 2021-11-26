import http from 'http';
import { IRoute, RouteHandler } from './Route.interface';
import { PathMatch } from './PathMatch.interface';

export interface IRouter extends PathMatch {
  register(artifact: IRoute | IRouter): void;
  route(request: http.IncomingMessage): RouteHandler;
}

export type RouterConstructorOptions = {
  path: String;
};
