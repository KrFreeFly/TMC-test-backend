const { HttpError } = require('../helpers/httpError');
const { VALIDATION_ERROR } = require('../helpers/errors');

const getDetailErrors = (error) => {
  if (!error) {
    return [];
  }

  return error.details.map((detail) => ({
    type: detail.type,
    value: detail.context.value,
    path: detail.path,
  }));
};

/**
 * Общая функция валидирования
 * @param reqField {string}
 * @param schema {Object}
 * @returns {function(e.Request, e.Response, e.NextFunction): Promise<*>}
 */
const validate = (
  reqField,
  schema,
) => (req, res, next) => {
  const { error, value } = schema.validate(req[reqField], { abortEarly: false });
  const errors = getDetailErrors(error);
  if (errors.length > 0) {
    const httpError = new HttpError(422, VALIDATION_ERROR, errors);
    return next(httpError);
  }
  req[reqField] = value;
  return next();
};

/**
 * Функции валидирования конкретных частей запроса
 * @param schema {Object}
 */
const validateBody = (
  schema,
) => validate('body', schema);

const validateQuery = (
  schema,
) => validate('query', schema);

const validateParams = (
  schema,
) => validate('params', schema);

module.exports = {
  validateQuery,
  validateBody,
  validateParams,
};
