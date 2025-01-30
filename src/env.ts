import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

const dotenvConfig = dotenv.config({ path: envFile });

if (dotenvConfig.error) {
    throw new Error(dotenvConfig.error.message);
}

if (!dotenvConfig.parsed) {
    throw new Error('could not parse config for some reason.');
}

const config = {
    SERVER_PORT: parseInt(dotenvConfig.parsed.PORT || '8080', 10),
    ROUTES_PREFIX: dotenvConfig.parsed.ROUTES_PREFIX || '/api',
    API_VERSION: parseInt(dotenvConfig.parsed.API_VERSION || '1', 10),
};

export default config;