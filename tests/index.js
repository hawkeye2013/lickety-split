const { Server, Route } = require('../dist');

const server = new Server({});

server.get('/test', () => {
  console.log('TEST');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
