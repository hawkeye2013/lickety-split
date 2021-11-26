import { Route } from '..';
import { HandlerMethods } from './Base.interface';

export interface PathMatch {
  path: String;
  match: (method: HandlerMethods, path: String) => Route | undefined;
}
