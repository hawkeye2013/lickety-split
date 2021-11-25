// create an express app as a control variable against which LicketySplit can be compared
import { LicketySplit } from './LicketySplit';
import url from 'url';
import data from './db.json';
import { ServerResponse } from 'http';
import Request from './Request';
const app = LicketySplit();

// GET /
// get all persons from db
app.get('/', (req: Request, res: ServerResponse) => {
  res.end(JSON.stringify(data));
});

// GET /active
// get all persons with isActive: true
app.get('/active', (req: Request, res: ServerResponse) => {
  res.end(JSON.stringify(data.filter((item) => item.isActive === true)));
});

// GET /friends/_id
// Get the friends of a specific person by their id
app.get('/friends/:_id', (req: Request, res: ServerResponse) => {
  const queryObject = url.parse(req.url!, true).query;
  res.end(
    JSON.stringify(data.find((item) => item._id === queryObject._id)?.friends),
  );
});

app.get(
  '/city/:cityId/neighborhood/:neighborhoodId/restaurants',
  (req: Request, res: ServerResponse) => {
    console.log('restaurants handler');
    res.end(
      JSON.stringify({
        restaurants: ['waffle house', 'taco bell', 'applebees', 'tony romas'],
        params: req.getParams(),
      }),
    );
  },
);

app.get('/city/:cityId/parks/:parkId/', (req: Request, res: ServerResponse) => {
  console.log('restaurants handler');
  res.end(
    JSON.stringify({
      restaurants: ['waffle house', 'taco bell', 'applebees', 'tony romas'],
      params: req.getParams(),
    }),
  );
});

app.get(
  '/city/:cityId/neighborhood/:neighborhoodId/',
  (req: Request, res: ServerResponse) => {
    res.end(
      JSON.stringify({
        params: req.getParams(),
      }),
    );
  },
);

app.get('/city/:cityId/neighborhood', (req: Request, res: ServerResponse) => {
  res.end(
    JSON.stringify({
      params: req.getParams(),
    }),
  );
});

app.get(
  '/towns/:townId/building/:buildingId/',
  (req: Request, res: ServerResponse) => {
    res.end(
      JSON.stringify({
        params: req.getParams(),
      }),
    );
  },
);

// POST /
app.post('/', (req: Request, res: ServerResponse) => {
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
const PORT = 5005;
app
  .listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  })
  .on('error', (e: Error) => {
    console.log(e.message);
  });
export default app;
