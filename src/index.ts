console.log('index.ts 1');
import { Server } from './Server';
import { Router } from './Router';
import { LicketySplit } from './LicketySplit';
export { Server, Router };
import {IncomingMessage, ServerResponse} from "http";

const app = LicketySplit();
app.get('/', (request: IncomingMessage, response: ServerResponse) => {
    response.end(JSON.stringify({
        'ROOT': 'I AM ROOT'
    }))
});
app.get('/boogity', (request: IncomingMessage, response: ServerResponse) => {
    response.end(JSON.stringify({
        'BOOGITY': 'WOOGITY'
    }))
});
app.listen(5001, () => {});