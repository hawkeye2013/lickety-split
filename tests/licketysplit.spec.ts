import request from "supertest"; 
// data to test post request
import postme from './data/postme.json';
// get the expected results from JSON files
import expectedGetRootResult from './data/expectedGetRootResult.json';
import expectedGetActiveResult from './data/expectedGetActiveResult.json';
import expectedPostResult from './data/expectedPostResult.json';
import expected404Response from "./data/expected404Response.json"
import licketySplitApp from "./licketySplitApp";

// const request(licketySplitApp) = request(http.createServer(licketySplitApp.callback()));

describe("Test Express App GET /", () => {
  test("Should respond with full database", () => {
    return request(licketySplitApp)
      .get("/")
      .then(response => {
        var msg = "";
        response.on('data', (chunk) => {
          msg += chunk.toString();
        }).on('end', () => { 
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(msg)).toMatchObject(expectedGetRootResult);
        });
      })
  });
});

describe("Test Express App GET /active", () => {
  test("Should respond with only active users ", () => {
    return request(licketySplitApp)
      .get("/active")
      .then(response => {
        var msg = "";
        response.on('data', (chunk) => {
          msg += chunk.toString();
        }).on('end', () => { 
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(msg)).toMatchObject(expectedGetActiveResult);
        });
      })
  });
});


describe("Test Express App POST / sample data", () => {
  test("Should respond with id, age and name of posted user", () => {
    return request(licketySplitApp)
      .post("/")
      .send(postme)
      .then(response => {
        var msg = "";
        response.on('data', (chunk) => {
          msg += chunk.toString();
        }).on('end', () => { 
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(msg)).toMatchObject(expectedPostResult);
        });
      })
  });
});



describe("Test Express App GET / again, should now include POSTed data", () => {
  test("Should respond with full database", () => {
    return request(licketySplitApp)
      .get("/")
      .then(response => {
        var msg = "";
        response.on('data', (chunk) => {
          msg += chunk.toString();
        }).on('end', () => {
          const expected = expectedGetRootResult;
          expected.push(postme);
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(msg)).toMatchObject(expected);
        });
        
      })
  });
});

describe("Test Express App GET /friends/_id with id of POSTed person, friends should match POSTed friends", () => {
  test("Should respond with full database", () => {
    return request(licketySplitApp)
      .get(`/friends/${postme._id}`)
      .then(response => {
        var msg = "";
        response.on('data', (chunk) => {
          msg += chunk.toString();
        }).on('end', () => {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(msg)).toMatchObject(postme.friends);
        });
        
      })
  });
});

describe("Test 404 GET /invalid ", () => {
  test("Should respond with 404", () => {
    return request(licketySplitApp)
      .get(`/invalid`)
      .then(response => {
        var msg = "";
        response.on('data', (chunk) => {
          msg += chunk.toString();
        }).on('end', () => {
          expect(response.statusCode).toBe(200);
          expect(JSON.parse(msg)).toMatchObject(expected404Response);
        });
      })
  });
});