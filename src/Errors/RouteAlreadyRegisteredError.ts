import { Route } from '..';

export class RouteAlreadyRegisteredError extends Error {
  constructor(route: Route) {
    super();

    const { method, path } = route;

    this.name = 'RouteAlreadyRegisteredError';
    this.message = `Route has already been registered with ${method} ${path}`;
  }
}
