# Lickety Split
## To Do
- tests for put, post, and delete, benchmark tests against popular frameworks: fastify, nest, express
- JSON parsing middleware
- clean interface for plugging in middleware, e.g. JSON parsing
- improve routing, with tree structure; split on forward slash for route registration
  - interface for both routers and routes for info that gets passed through them; first function argument to router, hidden, is context for router, letting routing tree build itself
    - top level router, then sub routers; for each subrouter, execute in order so you have understanding of what's on top of that
    - in the top level, you can try matching in the order that the routes are defined, with ability to dive into a route and hop back out if it's not a proper match
  - path parameters, e.g. :id