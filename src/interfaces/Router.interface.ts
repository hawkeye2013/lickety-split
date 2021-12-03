import http from 'http';
import { RouteHandler } from './Route.interface';
import { PathMatch } from './PathMatch.interface';
import { Route, Router } from '..';
import { HandlerMethods } from './Base.interface';

export interface IRouter extends PathMatch {
  register(artifact: Route | Router): void;
  method?: HandlerMethods;
}

export type RouterConstructorOptions = {
  path: String;
  method?: HandlerMethods;
};
