// create an express app as a control variable against which LicketySplit can be compared
import url from 'url';
import data from '../data/db.json';
import { ServerResponse, IncomingMessage } from 'http';
import { Server, Route } from '../../src';

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

app.get('/person/:id', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(JSON.stringify(data.find((item) => item._id === queryObject._id)));
});
app.get('/person/:guid', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(JSON.stringify(data.find((item) => item.guid === queryObject.guid)));
});
app.get('/person/:email', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(
    JSON.stringify(data.find((item) => item.email === queryObject.email)),
  );
});

app.get('/person/:id/name', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(
    JSON.stringify(data.find((item) => item._id === queryObject._id)?.name),
  );
});
app.get('/person/:guid/name', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(
    JSON.stringify(data.find((item) => item.guid === queryObject.guid)?.name),
  );
});
app.get('/person/:email/name', (req: IncomingMessage, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(
    JSON.stringify(data.find((item) => item.email === queryObject.email)?.name),
  );
});

// POST /
app.post('/', (req: IncomingMessage, res: ServerResponse, body: any) => {
  res.end(
    JSON.stringify({
      _id: body._id,
      name: body.name,
      age: body.age,
    }),
  );
});

let uploadRoute = new Route({
  acceptedDataType: 'multipart/form-data',
  method: 'POST',
  path: '/uploadfile',
  handler: (request: IncomingMessage, response: ServerResponse, body: any) => {
    response.end(JSON.stringify(body));
  },
});
app.register(uploadRoute);

let jsonPostRoute = new Route({
  acceptedDataType: 'application/json',
  method: 'POST',
  path: '/jsonpost',
  handler: (request: IncomingMessage, response: ServerResponse, body: any) => {
    response.end(JSON.stringify(body));
  },
});
app.register(jsonPostRoute);

export default app;
