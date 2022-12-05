const express = require('express');
const dotenv = require('dotenv');
const mainRouter = require('./mainRouter');
const errorHandler = require('./middlewares/errorHandler');
const cors = require('cors');

const { HttpError } = require('./helpers/httpError');
const { PAGE_NOT_FOUND } = require('./helpers/errors');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // для разработки пусть будут все домены
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use('/api', mainRouter);

// 404
app.use((req, res, next) => next(new HttpError(404, PAGE_NOT_FOUND)));

// Обработка ошибок / 500
app.use(errorHandler);

const port = (process.env.APP_PORT || 3000);
const host = (process.env.APP_HOST || 'localhost');
app.listen(port, host, () => {
  console.log(`Server listening on ${host}:${port}`);
});
