const express = require('express');
const uuidv4 = require('uuid/v4');
let categories = require('../data/categories');
const expenses = require('../data/expenses');

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
router.delete('/:id', (req, res) => {
  const category = categories.find(cat => cat.id === req.params.id);

  if (!category) {
    return res.status(404).send('Category not found');
  }

  expenses.forEach(expense => {
    if (expense.category && expense.category.id === category.id) {
      expense.category = null;
    }
  });

  categories = categories.filter(cat => cat.id !== category.id);

  return res.status(200).send({ category, expenses, total: categories.length });
});

module.exports = router;
