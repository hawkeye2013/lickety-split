import { Socket } from 'dgram';
import { IncomingMessage } from 'http';
import { JSONParser } from '../../../src/Parsers/JSON.parser';
import Request from '../../../src/Request';
describe('Creates Parser', () => {
  test('Parser Is Created', () => {
    const parser = new JSONParser();

    expect(parser).not.toBeUndefined();
  });
});

describe('Parser Function', () => {
  test('Parses string to json', () => {
    const parser = new JSONParser();

    const dataToParse = '{ "hello": "world" }';

    expect(parser.parseData(dataToParse)).toMatchObject({
      hello: 'world',
    });
  });
});
