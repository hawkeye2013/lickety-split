import licketySplitApp from './LicketySplitApp';
import supertest from 'supertest';
// data to test post supertest
import postMe from '../data/postMe.json';
// get the expected results from JSON files
import expectedGetRootResult from '../data/expectedGetRootResult.json';
import expectedGetActiveResult from '../data/expectedGetActiveResult.json';
import expectedPostResult from '../data/expectedPostResult.json';
import expected404Response from '../data/expected404Response.json';
import fs from 'fs';
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

describe('Test JSON post', () => {
  test('Should respond with object representing uploaded file', (done) => {
    supertest(licketySplitApp)
      .post('/jsonpost')
      .send({ name: 'john' })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject({
          name: 'john',
        });
        done();
      });
  });
});

describe('Test Multipart Form Data Upload', () => {
  test('Should respond with object representing uploaded file', (done) => {
    supertest(licketySplitApp)
      .post('/uploadfile')
      .attach('image', './tests/data/multipartFormData.txt')
      .expect(200)
      .end((err, res) => {
        expect(JSON.parse(res.text)).toMatchObject([
          {
            data: {
              data: [
                84, 104, 105, 115, 32, 105, 115, 32, 97, 32, 109, 117, 108, 116,
                105, 112, 97, 114, 116, 32, 102, 111, 114, 109, 32, 100, 97,
                116, 97, 32, 116, 101, 120, 116, 32, 102, 105, 108, 101,
              ],
              type: 'Buffer',
            },
            filename: 'multipartFormData.txt',
            type: 'text/plain',
          },
        ]);
        done();
      });
  });
});
