import http from 'http';
import { RouteHandler } from './Route.interface';
import { PathMatch } from './PathMatch.interface';
import { Route, Router } from '..';

export interface IRouter extends PathMatch {
  register(artifact: Route | Router): void;
}

export type RouterConstructorOptions = {
  path: String;
};
