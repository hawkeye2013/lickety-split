import { Router } from '../src/Router';

describe('Constructor', () => {
  test('Create Route', () => {
    const router = new Router({});

    expect(router).not.toBeUndefined();
  });
});
