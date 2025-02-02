import { ErrorRequestHandler, RequestHandler } from 'express';
import createHttpError from 'http-errors';
import docsMiddleware from './swagger.middleware';
import yaml from 'yaml';

const healthCheck: RequestHandler = (_, res) => {
    console.log(_.path, _.url, _.baseUrl, _.originalUrl);
    res.status(200).json({
        message: 'Ok',
    });
};

const catchAll: RequestHandler = (_, __, next) => next(createHttpError.NotFound());

const errorHandler: ErrorRequestHandler = (error, _, res, __) => {
    if (createHttpError.isHttpError(error)) {
        res.status(error.status).send({
            status: error.status,
            message: error.message,
            name: error.name,
        });
    } else {
        res.status(500).send({
            status: 500,
            message: 'Uh-oh - Something went terribly wrong',
            name: 'Internal Server Error',
        });
    }
};

const jsonDocs: RequestHandler = (_, res, next) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(docsMiddleware.parsed);
    } catch (error) {
        next(error);
    }
}

const yamlDocs: RequestHandler = (_, res, next) => {
    try {
        const formattedYaml = yaml.stringify(docsMiddleware.parsed);
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(formattedYaml);
    } catch (error) {
        next(error);
    }
}

const middleware = {
    healthCheck,
    catchAll,
    errorHandler,
    docs: [...docsMiddleware.serve, docsMiddleware.ui],
    jsonDocs,
    yamlDocs,
};

export default middleware;
