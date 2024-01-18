import App from './app';
import { getRestClientPort } from './configs/env-config';
const port = getRestClientPort();
const server = new App(port);
server.start();

// hii
