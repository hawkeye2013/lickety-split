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

    mainRouter.register(subRouter).then(
      mainRouter => {
        expect(mainRouter.routes).toEqual([subRouter]);
      }
    ).catch(error=>{throw error}); 
  });

  test('Register Router With Leading Slash', () => {
    const subRouter = new Router({
      path: '/test',
    });

    mainRouter.register(subRouter).then(
      mainRouter => {
        expect(mainRouter.routes).toEqual([
          new Router({
            path: 'test',
          }),
        ]);
      }
    ).catch(error=>{throw error}); 
  });

  test('Register Multi Path Router', () => {
    const subRouter = new Router({
      path: 'test/abc',
    });

    mainRouter.register(subRouter).then(
      mainRouter => {
        const expectedRouterStructure = new Router({
          path: 'test',
        });
    
        expectedRouterStructure.register(
          new Router({
            path: 'abc',
          }),
        ).then(
          expectedRouterStructure => {
            expect(mainRouter.routes).toEqual([expectedRouterStructure]);
          }
        ).catch(error=>{throw error}); 
      }
    ).catch(error => {throw error}) 
  });
});

describe('Register Route', () => {
  test('Register Route On Register', () => {
    const subRoute = new Route({
      method: 'GET',
      path: 'test',
      handler: () => {},
    });

    mainRouter.register(subRoute).then(
      mainRouter => {
        expect(mainRouter).not.toBeUndefined();
      }
    ).catch(error => {throw error}); 
  });
});



describe('match()', () => {
  test('Matches on sub route', () => {
    const subRoute = new Route({
      method: 'GET',
      path: '/test',
      handler: () => {},
    });

    mainRouter.register(subRoute).then(
      mainRouter => {
        expect(mainRouter.match('GET', '/test')).toEqual(subRoute);
      }
    ).catch(error => {throw error}) 
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
    subRouter.register(subroute1).then(
      subRouter => {
        subRouter.register(subroute2).then(
          subRouter => {
            expect(subRouter.routes).toEqual([subroute1])
          }
        ).catch(error => {throw error})
      }
    ).catch(error => {throw error}); 

    // const subroute3 = new Route({
    //   method: 'GET', 
    //   path: 'my-route2',
    //   handler: () => {}
    // })
    // const subroute4 = new Route({
    //   method: 'POST', 
    //   path: 'my-route2',
    //   handler: () => {}
    // })
    // const subRouter2 = new Router({
    //   path: 'duplicate-test2'
    // })
    // subRouter2.register(subroute3).then(
    //   subRouter2 => {
    //     subRouter2.register(subroute4).then(
    //       subRouter2 => {
    //         expect(subRouter2.routes).toEqual([subroute3, subroute4]);
    //       }
    //     ).catch(error => {throw error})
    //   }
    // ).catch(error => {throw error}) 
  });
});
