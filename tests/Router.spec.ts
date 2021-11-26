import { Router } from '../src/Router';
import { Route } from '../src/Route';

describe('Constructor', () => {
  test('Create Route', () => {
    const router = new Router({
      path: '/',
    });

    expect(router).not.toBeUndefined();
  });
});

describe('Register Sub Router', () => {
  test('Register Sub Router On Register', () => {
    const mainRouter = new Router({
      path: '/',
    });

    const subRouter = new Router({
      path: 'test',
    });

    mainRouter.register(subRouter);

    expect(mainRouter).not.toBeUndefined();
  });

  test('Register Route On Register', () => {
    const mainRouter = new Router({
      path: '/',
    });

    const subRoute = new Route({
      method: 'GET',
      path: 'test',
      handler: () => {},
    });

    mainRouter.register(subRoute);

    console.log(mainRouter);

    expect(mainRouter).not.toBeUndefined();
  });
});
