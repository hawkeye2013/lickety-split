import { Route } from '../../src/Route';

describe('Constructor', () => {
  test('Create Route', () => {
    const route = new Route({
      method: 'GET',
      path: 'test',
      handler: () => {},
    });

    expect(route).not.toBeUndefined();
  });
});

describe('match()', () => {
  test.only('Success', () => {
    const route = new Route({
      path: 'testing',
      method: 'GET',
      handler: () => {},
    });

    expect(route.match('GET', 'testing')).toEqual(route);
  });

  test('Fail', () => {
    const route = new Route({
      path: 'testing',
      method: 'GET',
      handler: () => {},
    });

    expect(route.match('GET', 'test123')).toBeUndefined();
  });
});
