import { JSONParser } from '../../../src/Parsers/JSON.parser';

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

    expect(parser.parse(dataToParse)).toMatchObject({
      hello: 'world',
    });
  });
});
