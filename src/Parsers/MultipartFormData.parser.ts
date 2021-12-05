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
        console.log(`on end, body=${body}`);
        resolve(body);
      });
    });
    return bodyPromise;
  }

  parseData(data: string) {
    // request may not be set for unit testing
    let response = undefined;
    if (this.request) {
      console.log('request is set');
      console.log(`data=${data}`);
      let boundary = this.getBoundary(this.request);
      console.log(`boundary=${boundary}`);
      response = parse(Buffer.from(data, 'utf8'), boundary!);
    } else {
      console.log('request is not set');
      response = Buffer.from(data, 'utf8');
    }
    console.log(`returning response = ${response}`);
    return response;
  }

  async parse(req: IncomingMessage): Promise<any> {
    this.request = req;
    console.log(`req=${this.request}`);
    let body = await this.getDataFromRequest(req);
    console.log(`now calling parsedata on body=${body}`);
    let response = this.parseData(body);
    console.log(`response after parsing body= ${response}`);
    return response;
  }
}

export { MultipartFormDataParser };
//npm run build && node tests/index.js
