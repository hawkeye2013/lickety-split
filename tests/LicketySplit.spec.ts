import licketySplitApp from './LicketySplitApp';
import request from 'supertest';
// data to test post request
import postMe from './data/postMe.json';
// get the expected results from JSON files
import expectedGetRootResult from './data/expectedGetRootResult.json';
import expectedGetActiveResult from './data/expectedGetActiveResult.json';
import expectedPostResult from './data/expectedPostResult.json';
import expected404Response from './data/expected404Response.json';

// const request(licketySplitApp) = request(http.createServer(licketySplitApp.callback()));

describe('Test Express App GET /', () => {
  test('Should respond with full database', () => {
    return request(licketySplitApp)
      .get('/')
      .then((response) => {
        var msg = '';

        response
          .on('data', (chunk) => {
            msg += chunk.toString();
          })
          .on('end', () => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(msg)).toMatchObject(expectedGetRootResult);
            // done();
          });
      });
  });
});

describe('Test Express App GET /active', () => {
  test('Should respond with only active users ', () => {
    return request(licketySplitApp)
      .get('/active')
      .then((response) => {
        var msg = '';
        response
          .on('data', (chunk) => {
            msg += chunk.toString();
          })
          .on('end', () => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(msg)).toMatchObject(expectedGetActiveResult);
          });
      });
  });
});

describe('Test Express App POST / sample data', () => {
  test.skip('Should respond with id, age and name of posted user', () => {
    return request(licketySplitApp)
      .post('/')
      .send(postMe)
      .then((response) => {
        var msg = '';
        response
          .on('data', (chunk) => {
            msg += chunk.toString();
          })
          .on('end', () => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(msg)).toMatchObject(expectedPostResult);
          });
      });
  });
});

describe('Test Express App GET / again, should now include POSTed data', () => {
  test('Should respond with full database', () => {
    return request(licketySplitApp)
      .get('/')
      .then((response) => {
        var msg = '';
        response
          .on('data', (chunk) => {
            msg += chunk.toString();
          })
          .on('end', () => {
            const expected = expectedGetRootResult;
            expected.push(postMe);
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(msg)).toMatchObject(expected);
          });
      });
  });
});

describe('Test Express App GET /friends/_id with id of POSTed person, friends should match POSTed friends', () => {
  test('Should respond with full database', () => {
    return request(licketySplitApp)
      .get(`/friends/${postMe._id}`)
      .then((response) => {
        var msg = '';
        response
          .on('data', (chunk) => {
            msg += chunk.toString();
          })
          .on('end', () => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(msg)).toMatchObject(postMe.friends);
          });
      });
  });
});

describe('Test 404 GET /invalid ', () => {
  test('Should respond with 404', () => {
    return request(licketySplitApp)
      .get(`/invalid`)
      .then((response) => {
        var msg = '';
        response
          .on('data', (chunk) => {
            msg += chunk.toString();
          })
          .on('end', () => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(msg)).toMatchObject(expected404Response);
          });
      });
  });
});
