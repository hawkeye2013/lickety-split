import { HandlerMethods } from './interfaces/Base.interface';
import { IRoute } from './interfaces/Route.interface';
import {
  RouteConstructorOptions,
  RouteHandler,
} from './interfaces/Route.interface';
import { DataType } from './interfaces/Parser.interface';

class Route implements IRoute {
  method: HandlerMethods;
  path: String;
  handler: RouteHandler;
  acceptedDataType: DataType | undefined;
  constructor(options: RouteConstructorOptions) {
    this.method = options.method;
    this.path = options.path;
    this.handler = options.handler;
    this.acceptedDataType = options.acceptedDataType;
  }
  match(method: HandlerMethods, path: String): Route | undefined {
    const processedPath = path[0] === '/' ? path : `/${path}`;

    return this.method === method && this.path === processedPath
      ? this
      : undefined;
  }

  public toString = (): string => {
    return `Route (${this.method} ${this.path} ${this.handler})`;
  };
}
export { Route };
