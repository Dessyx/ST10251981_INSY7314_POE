import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './server.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8443;
const HTTP_REDIRECT_PORT = process.env.HTTP_REDIRECT_PORT || 8080;
const key = path.join(__dirname, 'certs', 'server.key');
const crt = path.join(__dirname, 'certs', 'server.crt');

if (fs.existsSync(key) && fs.existsSync(crt)) {
  https.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(crt) }, app)
    .listen(PORT, () => console.log(`HTTPS https://localhost:${PORT}`));
  http.createServer((req, res) => {
    const host = (req.headers.host || 'localhost').split(':')[0];
    res.writeHead(301, { Location: `https://${host}:${PORT}${req.url}` });
    res.end();
  }).listen(HTTP_REDIRECT_PORT);
} else {
  console.warn('⚠️ TLS certs missing. Put server.key/crt in api-server/certs/');
  http.createServer(app).listen(HTTP_REDIRECT_PORT, () => console.log(`HTTP http://localhost:${HTTP_REDIRECT_PORT}`));
}

