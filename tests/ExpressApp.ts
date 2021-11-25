// create an express app as a control variable against which LicketySplit can be compared

import express from 'express';
import data from './data/db.json';
const expressApp = express();

// body parser middleware to parse json body of post requests
expressApp.use(express.json());

// GET /
// get all persons from db
expressApp.get('/', (req: express.Request, res: express.Response) => {
  res.send(data);
});

// GET /active
// get all persons with isActive: true
expressApp.get('/active', (req: express.Request, res: express.Response) => {
  res.send(data.filter((item) => item.isActive === true));
});

// GET /friends/_id
// Get the friends of a specific person by their id
expressApp.get(
  '/friends/:_id',
  (req: express.Request, res: express.Response) => {
    res.send(data.find((item) => item._id === req.params._id)?.friends);
  },
);

// POST /
expressApp.post('/', (req: express.Request, res: express.Response) => {
  data.push(req.body);
  res.json({
    _id: req.body._id,
    name: req.body.name,
    age: req.body.age,
  });
});

export default expressApp;
