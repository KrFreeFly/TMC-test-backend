const Joi = require('joi');
const {
  validateParams, validateQuery, validateBody,
} = require('../middlewares/validatorMiddleware');

const getOpts = validateQuery(
  Joi.object({
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
    sortColumn: Joi.string().valid('firstName', 'lastName', 'id'),
    sortDirection: Joi.string().valid('asc', 'desc'),
    lastOptions: Joi.boolean(),
    filterFirstName: Joi.string(),
    filterLastName: Joi.string(),
  })
);

const updateOpts = validateParams(
  Joi.object({
    id: Joi.number().integer().min(1).required(),
  })
);

const searchOpts = validateQuery(
  Joi.object({
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
    sortColumn: Joi.string().valid('firstName', 'lastName', 'id'),
    sortDirection: Joi.string().valid('ASC', 'DESC'),
    name: Joi.string().required(),
  })
)

const customSort = validateBody(
  Joi.object({
    options: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      saved: Joi.boolean().required(),
    })).required(),
  })
)

module.exports = {
  getOpts,
  updateOpts,
  searchOpts,
  customSort,
};
