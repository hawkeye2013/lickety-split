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
  match(): Route | undefined {
    return this;
  }

  public toString = (): string => {
    return `Route (${this.method} ${this.path} ${this.handler})`;
  };
}
export { Route };
