// create an express app as a control variable against which LicketySplit can be compared 
import url from "url";
import {licketysplit} from "../src/LicketySplit";
import data from "./data/db.json";
import { ServerResponse, IncomingMessage } from "http";
const licketySplitApp = licketysplit();

// GET /
// get all persons from db
licketySplitApp.get('/', (req: IncomingMessage, res: ServerResponse) => {
    console.log(data);
    res.end(JSON.stringify(data));
});

// GET /active
// get all persons with isActive: true
licketySplitApp.get('/active', (req: IncomingMessage, res: ServerResponse) => {
    res.end(JSON.stringify(data.filter(item => item.isActive === true)));
});

// GET /friends/_id
// Get the friends of a specific person by their id
licketySplitApp.get('/friends/:_id', (req: IncomingMessage, res: ServerResponse) => {
    const queryObject = url.parse(req.url!, true).query;
    res.end(JSON.stringify(data.find(item => item._id === queryObject._id)?.friends))
});

// POST /
licketySplitApp.post('/', (req: IncomingMessage, res: ServerResponse) => {
    var msg = "";
    req.on("data", function (chunk) {
        msg += chunk.toString();
    })
    .on('end', () => {
        let body = JSON.parse(msg);
        data.push(body);
        console.log('returning  from post');
        console.log(JSON.stringify(
            {
                '_id': body._id,
                'name': body.name,
                'age': body.age
            }
        ));
        res.end(
            JSON.stringify(
                {
                    '_id': body._id,
                    'name': body.name,
                    'age': body.age
                }
            )
        )
    });
});

const PORT = 5005;
licketySplitApp.listen(PORT, () => {console.log(`Server listening on ${PORT}`)});
export default licketySplitApp;