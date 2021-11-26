import { HandlerMethods } from './interfaces/Base.interface';
import { IRoute } from './interfaces/Route.interface';
import {
  RouteConstructorOptions,
  RouteHandler,
} from './interfaces/Route.interface';

class Route implements IRoute {
  method: HandlerMethods;
  path: String;
  handler: RouteHandler;
  constructor(options: RouteConstructorOptions) {
    this.method = options.method;
    this.path = options.path;
    this.handler = options.handler;
  }
  match(method: HandlerMethods, path: String): Route | undefined {
    return this.method === method && this.path === path ? this : undefined;
  }

  public toString = (): string => {
    return `Route (${this.method} ${this.path} ${this.handler})`;
  };
}
export { Route };
