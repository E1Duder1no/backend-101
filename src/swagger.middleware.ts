import swaggerUiExpress from 'swagger-ui-express';
import yaml from 'yaml';
import fs from 'node:fs';

const raw = fs.readFileSync('./openapi/v1.yaml', 'utf8');
const parsed = yaml.parse(raw);

export default {
    serve: swaggerUiExpress.serve,
    ui: swaggerUiExpress.setup(parsed),
    parsed,
    raw
};