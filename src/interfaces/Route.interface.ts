import { HandlerMethods } from './Base.interface';
import { RoutingBase } from './RoutingBase';

export type RouteHandler = Function;

export interface Route extends RoutingBase {
  method: HandlerMethods;
  path: String;
  handler: RouteHandler;
}

export type RouteConstructorOptions = {
  method: HandlerMethods;
  path: String;
  handler: RouteHandler;
};
