import { Server } from '../../src/Server';

describe('Server Constructor', () => {
  test('Sets Server Options', () => {
    const server = new Server({});

    expect(server).not.toBeUndefined();
  });

  test('Callback Set In Constructor', () => {
    const server = new Server({});

    expect(server.cb).not.toBeUndefined();
  });
});
