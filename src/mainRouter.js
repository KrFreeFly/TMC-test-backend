const { Router } = require('express');
const Storage = require('./storage');
const validator = require('./helpers/mainValidator');

const storage = new Storage();
const router = Router();

// GET

router.get(
  '/options',
  validator.getOpts,
  (req, res, next) => {
    try {
      const {
        limit,
        page,
        sortColumn,
        sortDirection,
        lastOptions,
        filterFirstName,
        filterLastName,
      } = req.query;
      if (lastOptions !== true) storage.setLastOptions({ sortColumn, sortDirection, filterFirstName, filterLastName });
      const result = storage.select({
        limit,
        page,
        sortColumn,
        sortDirection,
        lastOptions,
        filterFirstName,
        filterLastName,
      });
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
);

router.get(
  '/options/saved',
  (req, res, next) => {
    try {
      const result = storage.selectSaved();
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
);

router.get(
  '/options/search',
  validator.searchOpts,
  (req, res, next) => {
    try {
      const { name } = req.query;
      const result = storage.search({ name });
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
);

// PATCH

router.patch(
  '/options/:id',
  validator.updateOpts,
  (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = storage.save({ id });
      return res.status(201).json(result);
    } catch (e) {
      return next(e);
    }
  }
);

// PUT

router.put(
  '/options',
  validator.customSort,
  (req, res, next) => {
    try {
      storage.saveCustomSorted({ sortedOptions: req.body.options });
    } catch (e) {
      return next(e);
    }
  }
)

// DELETE

router.delete(
  '/options/:id',
  validator.updateOpts,
  (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = storage.delete({ id });
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
)

module.exports = router;
