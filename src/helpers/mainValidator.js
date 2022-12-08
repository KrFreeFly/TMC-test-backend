const Joi = require('joi');
const {
  validateParams, validateQuery,
} = require('../middlewares/validatorMiddleware');

const getOpts = validateQuery(
  Joi.object({
    limit: Joi.number().integer().min(1),
    page: Joi.number().integer().min(1),
    sortColumn: Joi.string().valid('firstName', 'lastName', 'id', '').default('id'),
    sortDirection: Joi.string().valid('asc', 'desc', '').default('asc'),
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

module.exports = {
  getOpts,
  updateOpts,
  searchOpts,
};
