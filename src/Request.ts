import { IncomingMessage } from "http";

export default class Request extends IncomingMessage {
    parameters: any = {};
    setParams(parameterMap: any ){
        this.parameters = parameterMap;
    }

    getParams(){
        return this.parameters;
    }

}
