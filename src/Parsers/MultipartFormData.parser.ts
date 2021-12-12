import { DataType, Parser } from '../interfaces/Parser.interface';
import { parse } from 'parse-multipart-data';
import { IncomingMessage } from 'http';

class MultipartFormDataParser implements Parser {
  acceptedDataType: DataType;
  request: any;
  constructor() {
    this.acceptedDataType = 'application/json';
    this.request = undefined;
  }

  setRequest(req: any) {
    this.request = req;
    return this;
  }

  getBoundary(req: IncomingMessage) {
    // get the boundary from the Content Type header
    let contentTypeHeader = this.getContentTypeHeader(req)!;
    if (contentTypeHeader.includes('boundary=')) {
      return contentTypeHeader.split('boundary=').at(-1);
    } else {
      // get the line with --------------, that is the boundary. THIS is the boundary; probably not a great assumption, needs to be improved but how?
      let lines = contentTypeHeader.split('\r');
      let boundaryFlag = '-------';
      for (var l in lines) {
        if (l.includes(boundaryFlag)) {
          return l;
        }
      }
    }
  }

  getContentTypeHeader(req: IncomingMessage) {
    let rawHeaders = req.rawHeaders;
    if (rawHeaders) {
      for (var i = 0; i < rawHeaders.length; i++) {
        if (rawHeaders[i].toLowerCase() == 'content-type') {
          return rawHeaders[i + 1];
        }
      }
    }
    // Does it make sense to return '' as default boundary string?
    return '';
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

  parseData(data: string) {
    // request may not be set for unit testing
    let response = undefined;
    if (this.request) {
      let boundary = this.getBoundary(this.request);
      response = parse(Buffer.from(data, 'utf8'), boundary!);
    } else {
      response = Buffer.from(data, 'utf8');
    }
    return response;
  }

  async parse(req: IncomingMessage): Promise<any> {
    this.request = req;
    let body = await this.getDataFromRequest(req);
    let response = this.parseData(body);
    return response;
  }
}

export { MultipartFormDataParser };
//npm run build && node tests/index.js
