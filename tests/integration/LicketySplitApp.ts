// create an express app as a control variable against which LicketySplit can be compared
import url from 'url';
import data from '../data/db.json';
import { ServerResponse, IncomingMessage } from 'http';
import { Server } from '../../src';

const app = new Server({});

// GET /
// get all persons from db
app.get('/', (req: IncomingMessage, res: ServerResponse) => {
  res.end(JSON.stringify(data));
});

// GET /active
// get all persons with isActive: true
app.get('/active', (req: IncomingMessage, res: ServerResponse) => {
  res.end(JSON.stringify(data.filter((item) => item.isActive === true)));
});

// GET /friends/_id
// Get the friends of a specific person by their id
app.get('/friends/:_id', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(
    JSON.stringify(data.find((item) => item._id === queryObject._id)?.friends),
  );
});

// POST /
app.post('/', (req: IncomingMessage, res: ServerResponse) => {
  var msg = '';
  req
    .on('data', function (chunk) {
      msg += chunk.toString();
    })
    .on('end', () => {
      let body = JSON.parse(msg);
      data.push(body);
      res.end(
        JSON.stringify({
          _id: body._id,
          name: body.name,
          age: body.age,
        }),
      );
    });
});

export default app;
