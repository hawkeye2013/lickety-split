import { HandlerMethods } from './interfaces/Base.interface';
import {
  RouteConstructorOptions,
  RouteHandler,
} from './interfaces/Route.interface';

class Route {
  type = 'ROUTE';
  method: HandlerMethods;
  path: String;
  handler: RouteHandler | undefined;
  constructor(options: RouteConstructorOptions) {
    this.method = options.method;
    this.path = options.path;
    this.handler = options.handler;
  }
  public toString = (): string => {
    return `Route (${this.method} ${this.path} ${this.handler})`;
  };
}
export { Route };
