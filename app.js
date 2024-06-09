import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { todoRoutes } from './source/routes/todo-routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(express.static(join(__dirname, '/source/public')));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile("index.html", { root: join(__dirname, 'source/public') });
});

app.use("/todos", todoRoutes);
