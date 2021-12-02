import { DataType, Parser } from '../interfaces/Parser.interface';

class JSONParser implements Parser {
  acceptedDataType: DataType;

  constructor() {
    this.acceptedDataType = 'application/json';
  }

  parse(body: string): any {
    return JSON.parse(body);
  }
}

export { JSONParser };
