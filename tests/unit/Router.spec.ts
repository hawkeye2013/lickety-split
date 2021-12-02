import { Router } from '../../src/Router';
import { Route } from '../../src/Route';

let mainRouter: Router;

beforeEach(() => {
  mainRouter = new Router({
    path: '/',
  });
});

describe('Constructor', () => {
  test('Create Route', () => {
    expect(mainRouter).not.toBeUndefined();
  });
});

describe('Register Sub Router', () => {
  test('Register Sub Router On Register', () => {
    const subRouter = new Router({
      path: 'test',
    });

    mainRouter.register(subRouter);

    expect(mainRouter.routes).toEqual([subRouter]);
  });

  test('Register Router With Leading Slash', () => {
    const subRouter = new Router({
      path: '/test',
    });

    mainRouter.register(subRouter);

    expect(mainRouter.routes).toEqual([
      new Router({
        path: 'test',
      }),
    ]);
  });

  test('Register Multi Path Router', () => {
    const subRouter = new Router({
      path: 'test/abc',
    });

    mainRouter.register(subRouter);

    const expectedRouterStructure = new Router({
      path: 'test',
    });

    expectedRouterStructure.register(
      new Router({
        path: 'abc',
      }),
    );

    expect(mainRouter.routes).toEqual([expectedRouterStructure]);
  });
});

describe('Register Route', () => {
  test('Register Route On Register', () => {
    const subRoute = new Route({
      method: 'GET',
      path: 'test',
      handler: () => {},
    });

    mainRouter.register(subRoute);

    expect(mainRouter).not.toBeUndefined();
  });
});

describe('match()', () => {
  test.skip('Matches on sub route', () => {
    const subRoute = new Route({
      method: 'GET',
      path: '/test',
      handler: () => {},
    });

    mainRouter.register(subRoute);

    expect(mainRouter.match('GET', 'test')).toEqual(subRoute);
  });
});
