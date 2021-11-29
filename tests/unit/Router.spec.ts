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
  test('Matches on sub route', () => {
    const subRoute = new Route({
      method: 'GET',
      path: 'test',
      handler: () => {},
    });

    mainRouter.register(subRoute);

    expect(mainRouter.match('GET', 'test')).toEqual(subRoute);
  });
});


describe('register() ', () => {
  test('should not register duplicate route', () => {
    const subroute1 = new Route({
      method: 'GET', 
      path: 'my-route',
      handler: () => {}
    })
    const subroute2 = new Route({
      method: 'GET', 
      path: 'my-route',
      handler: () => {}
    })
    const subRouter = new Router({
      path: 'duplicate-test'
    })
    subRouter.register(subroute1).register(subroute2); 
    // should not register 2, it's duplicate (path & method are same)
    expect(subRouter.routes).toEqual([subroute1])

    const subroute3 = new Route({
      method: 'GET', 
      path: 'my-route2',
      handler: () => {}
    })
    const subroute4 = new Route({
      method: 'POST', 
      path: 'my-route2',
      handler: () => {}
    })
    const subRouter2 = new Router({
      path: 'duplicate-test2'
    })
    subRouter2.register(subroute3).register(subroute4);
    // should register both, method is d/f
    expect(subRouter2.routes).toEqual([subroute3, subroute4]);
  });
});
