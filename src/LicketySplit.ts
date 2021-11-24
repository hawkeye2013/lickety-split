import {Server} from "./Server";
class _LicketySplit {
    server: Server;

    constructor(){
        this.server = new Server();
    }

    callback(){
        return this.server.callback();
    }

    listen(port: number, callback: () => void){
        return this.server.listen(port, callback);
    }

    address(){
        return this.server.server.address();
    }

    get(path: String, handler: Function){
        // register a handler function for HTTP GET method for this path
        this.server.get(path, handler);
    }

    post(path: String, handler: Function){
        // register a handler function for HTTP POST method for this path
        this.server.post(path, handler);
    }

    put(path: String, handler: Function){
        // register a handler function for HTTP PUT method for this path
        this.server.put(path, handler);
    }

    delete(path: String, handler: Function){
        // register a handler function for HTTP DELETE method for this path
        this.server.delete(path, handler);
    }
}
// so you don't have to use new keyword when creating LicketySplit server
const licketysplit = () => { return new _LicketySplit();};
export {licketysplit};