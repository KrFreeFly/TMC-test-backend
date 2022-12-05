const { HttpError } = require('../helpers/httpError');
const { INTERNAL_SERVER_ERROR } = require('../helpers/errors');

/**
 * Обработчик ошибок
 * @param err {object} Error object
 * @param err.status {number} Error status
 * @param req {Request} Express request object
 * @param res {Response} Express response object
 * @param next {NextFunction} Next function
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ ...err, message: err.message });
  }
  console.error(err);
  return res.status(500).json({
    ...err,
    status: 500,
    message: INTERNAL_SERVER_ERROR,
  });
};

module.exports = errorHandler;
