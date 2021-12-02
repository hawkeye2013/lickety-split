import { ServerResponse } from 'http';
export default class Response {
  serverResponse: ServerResponse;

  constructor(rawResponse: ServerResponse) {
    this.serverResponse = rawResponse;
  }
}
