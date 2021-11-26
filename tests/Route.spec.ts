import { Route } from '../src/Route';

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
