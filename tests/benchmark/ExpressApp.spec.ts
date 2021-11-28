import request from 'supertest';
import expressApp from './ExpressApp';

// data to test post requests
import postMe from '../data/postMe.json';

// get the expected results from JSON files
import expectedGetRootResult from '../data/expectedGetRootResult.json';
import expectedGetActiveResult from '../data/expectedGetActiveResult.json';
import expectedPostResult from '../data/expectedPostResult.json';

describe('Test Express App GET /', () => {
  test('Should respond with full database', () => {
    return request(expressApp)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedGetRootResult);
      });
  });
});

describe('Test Express App GET /active', () => {
  test('Should respond with only active users ', () => {
    return request(expressApp)
      .get('/active')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedGetActiveResult);
      });
  });
});

describe('Test Express App POST / sample data', () => {
  test('Should respond with id, age and name of posted user', () => {
    return request(expressApp)
      .post('/')
      .send(postMe)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expectedPostResult);
      });
  });
});

describe('Test Express App GET / again, should now include POSTed data', () => {
  test('Should respond with full database', () => {
    return request(expressApp)
      .get('/')
      .then((response) => {
        const expected = expectedGetRootResult;
        expected.push(postMe);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expected);
      });
  });
});

describe('Test Express App GET /friends/_id with id of POSTed person, friends should match POSTed friends', () => {
  test('Should respond with full database', () => {
    return request(expressApp)
      .get(`/friends/${postMe._id}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(postMe.friends);
      });
  });
});
