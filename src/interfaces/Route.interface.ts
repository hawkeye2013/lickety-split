import { DataType } from './Parser.interface';
import { HandlerMethods } from './Base.interface';
import { PathMatch } from './PathMatch.interface';

export type RouteHandler = Function;

export interface IRoute extends PathMatch {
  method: HandlerMethods;
  handler: RouteHandler;
}

export type RouteConstructorOptions = {
  method: HandlerMethods;
  path: String;
  handler: RouteHandler;
  acceptedDataType?: DataType;
};
