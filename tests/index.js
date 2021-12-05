const {
  Server,
  Route,
  getRequestData,
  MultipartFormDataParser,
} = require('../dist');
const server = new Server({});

/* Need to make request body / payload easily accessible to handler definition */

server.get('/test', () => {
  console.log('TEST');
});

server.post('/uploadfile', (request, response, body) => {
  console.log('You have posted');
  console.log(body);
  response.end(body);
});
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
