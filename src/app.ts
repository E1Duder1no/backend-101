import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

import middleware from './middleware';
import mainRoutes from './routes';
import config from './env';

const routesPrefix = config.ROUTES_PREFIX.concat(`/v${config.API_VERSION}`);

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }), morgan('dev'), cors(), helmet());

app.use('/docs', middleware.docs);
app.use('/docs.json', middleware.jsonDocs);
app.use('/docs.yaml', middleware.yamlDocs);

app.use(routesPrefix, mainRoutes);

app.get('/health', middleware.healthCheck);

app.use('*', middleware.catchAll);

app.use(middleware.errorHandler);

export default app;
