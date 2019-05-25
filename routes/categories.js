const express = require('express');
const uuidv4 = require('uuid/v4');
let categories = require('../data/categories');

const router = express.Router();

// List categories
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25;
  const offset = parseInt(req.query.offset, 10) || 0;

  res.status(200).send({
    categories: categories.slice(offset, offset + limit),
    total: categories.length,
  });
});

// Add category
router.post('/', (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(422).send('No category provided');
  }

  category.name = category.name.trim();

  if (categories.some(cat => cat.name === category.name)) {
    return res.status(409).send('Category already exists');
  }

  category.id = uuidv4();

  categories.push(category);

  return res.status(201).send({ category, total: categories.length });
});

// Delete category
router.delete('/', (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(422).send('No category provided');
  }

  if (!categories.some(cat => cat.name === category.name)) {
    return res.status(404).send('Category not found');
  }

  categories = categories.filter(cat => cat.name !== category.name);

  return res.status(201).send({ category, total: categories.length });
});

module.exports = router;
