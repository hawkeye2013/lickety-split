import { DataType, Parser } from '../interfaces/Parser.interface';
import { IncomingMessage } from 'http';

class JSONParser implements Parser {
  acceptedDataType: DataType;

  constructor() {
    this.acceptedDataType = 'application/json';
  }

  parseData(data: string) {
    return JSON.parse(data);
  }
  async getDataFromRequest(request: IncomingMessage): Promise<string> {
    let body = '';
    let bodyPromise = await new Promise<string>((resolve, reject) => {
      request.on('data', (chunk) => {
        body += chunk;
      });
      request.on('end', () => {
        resolve(body);
      });
    });
    return bodyPromise;
  }
  async parse(request: IncomingMessage): Promise<any> {
    let requestData = await this.getDataFromRequest(request);
    return this.parseData(requestData);
  }
}

export { JSONParser };
