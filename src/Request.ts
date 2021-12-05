import { IncomingMessage } from 'http';

export default class Request {
  incomingMessage: IncomingMessage;
  parameters: Map<string, any> = new Map<string, any>();

  constructor(rawRequest: IncomingMessage) {
    this.incomingMessage = rawRequest;
  }  
}
