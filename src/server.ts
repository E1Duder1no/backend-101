import http from 'node:http';
import app from './app';
import config from './env';

const webServer = http.createServer(app);

webServer.listen(config.SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${config.SERVER_PORT}`);
});

export default webServer;