import { Route } from '..';

export interface PathMatch {
  path: String;
  match: () => Route | undefined;
}
