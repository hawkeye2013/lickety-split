import { DataType, Parser } from '../interfaces/Parser.interface';
import {parse} from "parse-multipart-data";

class MultipartFormDataParser implements Parser {
  acceptedDataType: DataType;
  request: any;
  constructor() {
    this.acceptedDataType = 'application/json';
    this.request = {}; 
  }

  setRequest(req: any){
    this.request = req;
    return this;
  }

  getBoundary(req: any){
    // get the boundary from the Content Type header 
    return this.getContentTypeHeader(req).split('boundary=').at(-1);
  }

  getContentTypeHeader(req: any){
    let rawHeaders = req.rawHeaders; 
    for (var i = 0; i < rawHeaders.length; i++){
      if (rawHeaders[i] == 'Content-Type'){
        return rawHeaders[i+1];
      }
    }
  }

  parse(body: string): any { 
    if (!this.request){
      return parse(Buffer.from(body, 'utf8'), ""); 
    } else {
      return parse(Buffer.from(body, 'utf8'), this.getBoundary(this.request));
    }
   }
}

export { MultipartFormDataParser };
//npm run build && node tests/index.js