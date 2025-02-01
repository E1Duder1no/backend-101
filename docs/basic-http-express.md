# Task #2 Basic http server with expressjs

we will practice coding an http server using expressjs and many surronding tools.

## Some theory

### http server with nodejs

you can definitley spin up an http server using only nodejs like so:

```typescript
    import http from "node:http";

    const PORT = parseInt(process.env.PORT || '8080', 10);

    const webServer = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Hello from my server');
        res.end();
    });

    webServer.listen(PORT, () => console.info('Server startd listening on http://localhost:', PORT));
```

but, it's a lot of hard and manual work.


## What is expressjs ?

express.js is a web framework on top of nodejs.

with it you can build web applications, Rest API's and more.

almost everything in express is a `middleware`.

it allows you to handle applicative routing for your apps and more.

## basics of express

### 1. Middleware functions

in express middleware is a function, like so:

```typescript
    import express, { Express, Request, Response, NextFunction } from "express";

    const PORT: number = parseInt(process.env.PORT || '8080', 10);
    const app: Express = express();

    const middleware1 = (req: Request, res: Response, next: NextFunction) => {
        // middleware handling goes here
    };

    app.use(middleware1);

    //...rest of code goes here...
```

a middleware gets 3 parameters:

1. request - a representation of the http request (headers, params, body, and more);
2. response - the api with witch you control the response from the middleware.
3. next - a function that can either pass the flow onto the next middleware, or throw an error.

to understand more, the way middleware work in express, say you had 3 middleware:

```typescript
    import express, { Express, Request, Response, NextFunction } from "express";

    const PORT: number = parseInt(process.env.PORT || '8080', 10);
    const app: Express = express();

    const middleware1 = (req: Request, res: Response, next: NextFunction) => {
        // middleware handling goes here
        console.log('1');
        next();
    };
    const middleware2 = (req: Request, res: Response, next: NextFunction) => {
        // middleware handling goes here
        console.log('2');
        next();
    };
    const middleware3 = (req: Request, res: Response, next: NextFunction) => {
        // middleware handling goes here
        console.log('3');
        next();
    };

    app.use(middleware1, middleware2, middleware3);

    //...rest of code goes here...
```

the output in your terminal (stdout)  would be:
```sh
1
2
3
```

> **note**: we have to run the `next()` function for the execution to pass onto the next middleware. (ps: order of execution matters here).

> **ps**: you can also have async middelware if you need.

```typescript 
import { RequestHandler } from "express";

const asyncMiddleware: RequestHandler = async (req, res, next) => {};
```

middleware are used as kind of "filters", meaning it can be the one to handle the http request, and it can just do one action and then pass the request on to the next middleware. untill one middleware finnaly returns a response, or throws an error.

```typescript
    const asyncMiddleware: RequestHandler = async (req, res, next) => {
        res.status(200).json({
            message:' response!'
        });
    };
```

### 2. Http basics

in http - we use messages to exchange information between client and server (a client can also be another server, and vice versa).

lets analyse the anatomy of an http request (it's the same for a response):

```
    POST http://localhost:8080/ HTTP/1.1        --> the start line describes the http version & request method
    Host: developer.mozzila.org                 --> from this point on these are all headers
    User-Agent: curl/8.6.0
    Accept: */*
    Content-Type: application/json
    Content-Length: 345
    {                                           --> this is where the request body starts
        "data": "some data"
    }
```

there are some basic http verbs (and many more):

- GET - a get request, has no **body**
- POST - has a **body** (usually for creating resources).
- PUT - has a **body**, (usually for updating a part of a resource or more).
- PATCH - has a **body**, (usually for entirely replacing a resource).
- DELETE - can have a **body**, (used to delete a resource).

#### Routing in express.js
---
 
example routes: 

```typescript
    import express from "express";

    const app = express();

    const mainRouter = express.Router();

    mainRouter.get('/some-path', (req, res, next) => res.status(200).json({ message: 'hello' }));

    app.use('/api', mainRouter);
```

#### Path parameters
---

express takes strings as path's as well as regular expressions.

as part of the path you may add route paramters - these are usefull when you want to query the route.

all incoming route parameters are turned into strings, you'll need to parse them into whatever you need.

for example:

```typescript
    import express from "express";

    const app = express();

    app.get('/users/:userId/books/:bookId', (req, res, next) => {
        console.log(req.params) // => { userId: string, bookId: string }
        console.log(req.params.userId) // => '1'
        console.log(req.params.bookId) // => f431-f134-f134-f1343 (uuid)
        res.send(req.params);
    });
```

## Task details

1. choose a resource to manage (e.g  task/todo/person)

2. create a folder by that name under `/src` as well as needed files. run the following:

```bash
mkdir src/<resource_name>
touch src/<resource_name>/{routes.ts,controller.ts,service.ts,entity.ts,repository.ts,interfaces.ts}
```

3. go to the root routes folder and connect your new module to the main app. like so:

```typescript
import express from 'express';
import resourceNameRoutes from './resource-name/routes';

const mainRoutes = express.Router();

mainRoutes.use('/resource-name', resourceNameRoutes);

export default mainRoutes;

```

4. go to your routes, and add CRUD (create-read-update-delete) routes like so:

```typescript
import express from 'express';
import controller from './controller';

const resourceNameRoutes = express.Router();

resourceNameRoutes.get('', controller.list);
resourceNameRoutes.get('/:resource_id', controller.getOne);
resourceNameRoutes.post('', controller.createOne);
resourceNameRoutes.put('/:resource_id', controller.updateOne);
resourceNameRoutes.delete('/:resource_id', controller.removeOne);

export default resourceNameRoutes;
```

5. lets type out our basic resource shape in entity.ts:

```typescript
export interface IResource {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}
```

6. let's go ahead and implement our interfaces in the interfaces file we created. this will be our contract with the outside world (the way we communicate data).

```typescript
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { IResource } from './entity.ts';

interface ResourceIdRouteParameter {
    resource_id: string;
}

interface CreateResourceDto extends Pick<IResource, 'name'> {}

interface UpdateResourceDto extends Partial<Omit<IResource, 'id'>> {}

export interface ListResourceResponse extends Response<{
    resources: IResource[];
    total: number;
}> {}

export interface ListResourceRequest extends Request<ParamsDictionary, ListResourceResponse> {}

export interface GetOneResourceResponse extends Response<IResource> {}

export interface GetOneResourceRequest extends Request<ResourceIdRouteParameter, GetOneResourceResponse> {}

export interface CreateResourceResponse extends Response<IResource> {}

export interface CreateResourceRequest extends Request<ParamsDictionary, CreateResourceResponse> {}

export interface UpdateResourceRequest extends Request<ResourceIdRouteParameter, Response<void>> {} // this is because status 204 omits the response body

export interface RemoveResourceRequest extends Request<ResourceIdRouteParameter> {}

export interface RemoveResourceResponse extends Response<void> {} // this is because status 204 omits the response body
```

7. let's implement our controller:

```typescript
import { RequestHandler } from 'express';
import { ListResourceRequest, GetOneResourceRequest, CreateResourceRequest, UpdateResourceRequest, RemoveResourceRequest } from './interfaces';

const controller: Record<string, RequestHandler> = {
    list: async (req: ListResourceRequest, res, next) => {}
    getOne: async (req: GetOneResourceRequest, res, next) => {}
    createOne: async (req: CreateResourceRequest, res, next) => {}
    updateOne: async (req: UpdateResourceRequest, res, next) => {}
    deleteOne: async (req: RemoveResourceRequest, res, next) => {}
}

export default controller;
```

8. lets implement our service


[Home](https://github.com/E1Duder1no/backend-101/blob/main/README.md)