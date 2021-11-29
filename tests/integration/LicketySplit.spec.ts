import licketySplitApp from './LicketySplitApp';
import supertest from 'supertest';
// data to test post supertest
import postMe from '../data/postMe.json';
// get the expected results from JSON files
import expectedGetRootResult from '../data/expectedGetRootResult.json';
import expectedGetActiveResult from '../data/expectedGetActiveResult.json';
import expectedPostResult from '../data/expectedPostResult.json';
import expected404Response from '../data/expected404Response.json';

describe('Test LicketySplit App GET /', () => {
  test('Should respond with a 200 status code', (done) => {
    supertest(licketySplitApp)
      .get('/')
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject(expectedGetRootResult);
        done();
      });
  });
});

describe('Test LicketySplit GET /active', () => {
  test('Should respond with only active users ', (done) => {
    supertest(licketySplitApp)
      .get('/active')
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject(expectedGetActiveResult);
        done();
      });
  });
});

describe('Test LicketySplit POST / sample data', () => {
  test.skip('Should respond with id, age and name of posted user', (done) => {
    supertest(licketySplitApp)
      .post('/')
      .send(postMe)
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject(expectedPostResult);
        done();
      });
  });
});

describe('Test LicketySplit GET / again, should now include POSTed data', () => {
  test.skip('Should respond with full database', (done) => {
    supertest(licketySplitApp)
      .get('/')
      .expect(200)
      .end((err, res) => {
        const expected = expectedGetRootResult;
        expected.push(postMe);
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.text)).toMatchObject(expected);
        done();
      });
  });
});

describe('Test LicketySplit GET /friends/_id with id of POSTed person, friends should match POSTed friends', () => {
  test.skip('Should respond with full database', (done) => {
    supertest(licketySplitApp)
      .get(`/friends/${postMe._id}`)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject(postMe.friends);
        done();
      });
  });
});

describe('Test 404 GET /invalid ', () => {
  test('Should respond with 404', (done) => {
    supertest(licketySplitApp)
      .get(`/invalid`)
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject(expected404Response);
        done();
      });
  });
});
