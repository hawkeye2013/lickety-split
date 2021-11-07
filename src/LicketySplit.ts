import { Server, Router} from ".";
import http from "http";
class _LicketySplit {
    server: Server = new Server;

    listen(port: number, cb: Function){
        this.server.listen(port, cb);
    }

    get(path: String, handler: Function){
        // register a handler function for HTTP GET method for this path
        console.log('LS get method');
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
const LicketySplit = () => { return new _LicketySplit();}
export {LicketySplit};