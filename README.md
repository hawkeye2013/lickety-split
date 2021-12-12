# Lickety Split

A web server library with a need for speed. If you ain't first, you're last.

## Lickety Split Origins

The goal was to build a [Node.js](https://nodejs.org/en/) library for web server development that is **faster and more lightweight** than [Express](https://expressjs.com/), which is a popular minimalist Node.js web application framework that enables quick development through a number of intuitive APIs.

### A Rundown of Terminology

#### [Node.js](https://nodejs.org)

Starting from the top - or rather, from the bottom - Node.js is an open source JavaScript runtime built on Chrome's V8 JavaScript engine. If you're a normal human being, that probably doesn't mean anything to you. To put it in simpler terms Node.js is an open source development platform that allows you to execute JavaScript code outside of the browser environment, meaning you can use JavaScript to develop full-stack applications since Node allows it to execute both server-side _and_ client-side.

#### [NPM (Node package manager)](https://docs.npmjs.com/about-npm)

NPM is a package manager for Node that offers a website ([[npmjs.com](https://www.npmjs.com/)]), a CLI (`npm ...`), and a registry of JavaScript packages. NPM makes it very easy to install packages and manage dependencies for a project. For example, to install all of of the dependencies for a Node project, you can just run `npm install` in the project folder where the `package.json` file lives, and npm automatically generates a `node_modules` folder with all of the required modules. Or, to install a specific module, like `express`, you can run `npm install express`, or shortened, `npm i express`

#### [package.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-json) and [package-lock.json](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json)

A `package.json` [(ours is here)](package.json) file is basically a manifest for a project that allows you to centralize configuration for things like name, description, versioning, dependencies, and more. This file is used by `npm` mentioned previously to store the names and versions of all the installed dependencies for a project. If you want to publish a package on the NPM registry, certain properties like `name` are more important than others.

#### Express.js - _What is it?_

If you're _not_ familiar with [Express.js](https://expressjs.com), otherwise known simply as Express, it's an open source back end web application framework for [Node.js]. It's sort of the "de facto standard" server framework for Node, because it makes web server development very straightforward. Here's an example of a web server created with Express. Assume that the `npm install express` command has already been run so this file can execute.

```
// index.js

const express = require('express')
const app = express()
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

```

The above code segment, less than ten lines, creates a web server that listens on port 3000 at the root path for HTTP GET requests, to which it responds with a 'Hello World!' message. Simple example, sure, but you can probably see why it's a common go-to for Node web server development. You can read more about using it [here](https://expressjs.com/en/starter/installing.html), but we encourage you to read on for a better option (hint: it's called _Lickety Split_)

#### The Catch - _"Express"-ing our Concerns_

While Express does make web server development very easy with its abstracted interfaces (e.g. `app.get(<the path>, <GET request handler for the path>)`), it comes with some arguably high performance overheads. For example, a quick test — in which an Express server **logs a string** to the console and **sends back a string as a response** to a **basic GET request** — showed a peak response time of **81ms**, rather high for no logic or network latency.

#### The Goal

We aimed to build our Lickety Split library such that it would enable one to create a web server that can handle **GET, POST, PUT, and DELETE requests**, and **can parse various types of data like JSON and multipart form data**. Moreover, it was to do these things with very **minimal overhead** and thus with much **faster response times** than Express.

We set out with a plan to develop Lickety Split and run [performance tests](tests/index.js) to **benchmark it against Express** so that we could report on shared functionalities between the two as well as significant performance differences.

## Using The Library

If you're familiar with [Express](https://expressjs.com/), you're already pretty familiar with Lickety Split, because the interface for LS is pretty similar (despite the much lighter-weight back end). There's also some secret sauce that'll let you do a few extra things. We'll explore that.

First things first, go ahead and install the library with NPM using the following command: `npm install lickety-split`

Then, create a `.js` file, like `index.js` or `if-you-aint-first-you're-last.js` or any other file name that you think will make your code run faster.

### First, a Very Basic Server - _Using LS Like Express_

The code below shows a very basic use case for LS. Here, we use LS very similarly to how we used `express` in the example above. We create a server, we register a GET listener on the `/test` path and a basic handler that just responds with some "hello world" JSON data. Similar to express, the handler function accepts a request (`req`) and a response (`res`) as parameters, and is able to send back data to the requesting client by writing to the response (`res.end(...)`). After defining our listener, we tell the server to listen on port 3000 and pass in a callback that executes once the server is listening. Again, similar to express, the server's `listen` method accepts a port number to listen on and a callback function to execute once it's ready and listening for requests.

```
//index.js
const Server = require("lickety-split").Server;

// create a server
const server = new Server({});

// define a GET /test listener and handler
server.get("/test", (req, res) => {
    res.end('{"hello": "world"}');
});

// start listening on port 3000
const port = 3000;
server.listen(port, () => {
    console.log(
        `This is the server listen callback function. Server is now listening on port ${port}`
    );
});

```

You can then run the file with `node <filename>`, e.g. `node index.js` in this case. Once you do that, you should see `This is the server listen callback function. Server is now listening on port 3000` printed to the console. To test the listener you set up, open a new terminal window and run `curl http://localhost:3000/test` and you should see `{"hello": "world"}` as the output.

### Next, a Slightly More Modular Server - _Registering a Route as an Independent Object_

In this case, we're going to take the same basic route we previously defined (i.e. the `GET /test` route) and we're going to define that as an independent `Route` object and register it with the server rather than tying it directly to the central `Server` object using the `.get()` approach.

```
// index.js
const Server = require("lickety-split").Server;
const Route = require("lickety-split").Route;

// create a server
const server = new Server({});

// not modular, less scalable
// server.get("/test", (req, res) => {
//     res.end('{"hello": "world"}');
// });

// modular, more scalable
const route = new Route({
    method: "GET",
    path: "/test",
    handler: (req, res) => {
        res.end('{"hello": "world"}');
    },
});
server.register(route);

const port = 3000;
server.listen(port, () => {
    console.log(
        `This is the server listen callback function. Server is now listening on port ${port}`
    );
});
```

In the above code segment, we comment out the previous `server.get(...)` code, and we define a new `Route` object, passing in options that represent the same thing we were previously doing: we want a route for a `GET` HTTP method for the `/test` path, and we want the same `handler` logic. Once we create the route, we simply register that route with the server by calling `server.register(route)` so the server knows to listen for `GET /test` requests and how to handle them.

As you may notice, this approach is a bit more verbose, but it allows for more modularity and separation of concerns (i.e. separate your routing logic and handling from your high level server creation/listening), and offers greater scalability for your app's architecture. You could perhaps organize sets of Route objects in different files and then import them into a central file with your server so they can each be registered by calling `server.register(route)` for each one.

Again, you can test this using the same approach you used to test the first Basic LS server (`node <file.js>` and `curl http://localhost:3000/test`)

### Next, a Very Modular Server - _Registering a Router as an Independent Object_

In this last example, we take things a step further by defining a separate `Router` object that is able to handle all routing for a given subpath, e.g. `/licketysplit`. `Router` objects with LS enable you to organize your application easily into a hierarchy, because a `Router` represents all routing for a given path and can register both Routes underneath it as well as other Routers. Let's look at an example.

```
// index.js
const Server = require("lickety-split").Server;
const Route = require("lickety-split").Route;
const Router = require("lickety-split").Router;

// create a server
const server = new Server({});

// not modular, less scalable
// server.get("/test", (req, res) => {
//     res.end('{"hello": "world"}');
// });

// modular, more scalable
// const route = new Route({
//     method: "GET",
//     path: "/test",
//     handler: (req, res) => {
//         res.end('{"hello": "world"}');
//     },
// });
// server.register(route);

// Very modular; very scalable; very organizable
const routerA = new Router({
    path: "/categoryA",
});
const questionA1Route = new Route({
    path: "/q1",
    method: "GET",
    handler: (req, res) => {
        console.log("This is question 1 for category A");
    },
});
const questionA2Route = new Route({
    path: "/q2",
    method: "GET",
    handler: (req, res) => {
        console.log("This is question 2 for category A");
    },
});
// Register both category A routes on routerA
routerA.register(questionA1Route);
routerA.register(questionA2Route);

const routerB = new Router({
    path: "/categoryB",
});
const questionB1Route = new Route({
    path: "/q1",
    method: "GET",
    handler: (req, res) => {
        console.log("This is question 1 for category B");
    },
});
const questionB2Route = new Route({
    path: "/q2",
    method: "GET",
    handler: (req, res) => {
        console.log("This is question 2 for category B");
    },
});
// register both category B routes on routerB
routerB.register(questionB1Route);
routerB.register(questionB2Route);

// register both routers on server
server.register(routerA);
server.register(routerB);
const port = 3000;
server.listen(port, () => {
    console.log(
        `This is the server listen callback function. Server is now listening on port ${port}`
    );
});
```

In the above example, we're creating two `Router` objects, one for a "category A" and one for a "category B". Within each category, we create two routes, each representing a "question" belonging to that parent category. For each category, once we've created a Router and two child Routes, we register both of those Routes on the Router using a `router.register(route)` method. Then, we can register the Router with the server using the same interface as before: `server.register(router)`. This further separates the Route logic from the server. Now, we have a clear 3 layer architecture consisting of the Server, the Router, and the Route, that allows high separation of concerns and very easy, hierarchically organized web server development.

To further clarify the above code segment, if you were to run that server, you should be able to request both `/q1` and `/q2` for each of the category subpaths `/categoryA` and `/categoryB`. For example, a test bash script runs through requests for each path available on the above server:

```
#!/bin/bash

for c in A B; do
    for q in 1 2; do
        curl http://localhost:3000/category$c/q$q
    done
done

```
