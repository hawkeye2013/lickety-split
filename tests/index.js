const { Server, Route, getRequestData, MultipartFormDataParser } = require('../dist'); 
const server = new Server({});

/* Need to make request body / payload easily accessible to handler definition */ 

server.get('/test', () => {
  console.log('TEST');
});

server.post('/uploadfile', (req, resp) => {
    /* keys of request: [
  '_readableState',   '_events',
  '_eventsCount',     '_maxListeners',
  'socket',           'httpVersionMajor',
  'httpVersionMinor', 'httpVersion',
  'complete',         'rawHeaders',
  'rawTrailers',      'aborted',
  'upgrade',          'url',
  'method',           'statusCode',
  'statusMessage',    'client',
  '_consuming',       '_dumped'
]
*/   
  getRequestData(req).then(
    data => { 
      let parser = new MultipartFormDataParser(); 
      let parsed = parser.setRequest(req).parse(data); 
      console.log(parsed);
    }
  ).catch(error=> console.log(error));
 
})

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});




