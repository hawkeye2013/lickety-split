import { MultipartFormDataParser } from '../../../src/Parsers/MultipartFormData.parser';
import fs from 'fs';

describe('Creates Parser', () => {
  test('Parser Is Created', () => {
    const parser = new MultipartFormDataParser();
    expect(parser).not.toBeUndefined();
  });
});

describe('Parser Function', () => {
  test('Parses string to json', () => {
    const parser = new MultipartFormDataParser();
    fs.readFile('./tests/data/multipartFormData.txt', 'utf8', (error, data) => {
      let stringifiedBuffer = data.toString();
      expect(parser.parseData(stringifiedBuffer)).toMatchObject(
        Buffer.from('This is a multipart form data text file', 'utf8'),
      );
    });
  });
});
