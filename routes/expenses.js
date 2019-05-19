const express = require('express');
const expenses = require('../data/expenses');

const router = express.Router();

// List expenses
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 25;
  const offset = parseInt(req.query.offset, 10) || 0;
  const sort = (req.query.sort || 'desc').toLowerCase();

  res.status(200).send({
    expenses: expenses
      .sort((a, b) => {
        const dateA = Date.parse(a.date);
        const dateB = Date.parse(b.date);

        switch (sort) {
          case 'asc': {
            return dateA - dateB;
          }

          default: {
            return dateB - dateA;
          }
        }
      })
      .slice(offset, offset + limit),
    total: expenses.length,
  });
});

// Get expense by ID
router.get('/:id', (req, res) => {
  const expense = expenses.find(exp => exp.id === req.params.id);

  if (expense) {
    res.status(200).send(expense);
  } else {
    res.status(404).send('Expense not found');
  }
});

// Update expense by ID
router.post('/:id', (req, res) => {
  const expense = expenses.find(exp => exp.id === req.params.id);

  if (expense) {
    if (req.body.comment !== undefined) {
      expense.comment = req.body.comment;
    }

    if (req.body.category !== undefined) {
      expense.category = req.body.category;
    }

    res.status(200).send(expense);
  } else {
    res.status(404).send('Expense not found');
  }
});

// Upload receipt to expense by ID
router.post('/:id/receipts', (req, res) => {
  if (Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded');
  } else {
    const expense = expenses.find(exp => exp.id === req.params.id);
    const { receipt } = req.files;
    const receiptId = `${req.params.id}-${expense.receipts.length}`;
    const receiptPath = `/receipts/${receiptId}.jpg`;

    if (expense) {
      receipt.mv(`${process.cwd()}${receiptPath}`, err => {
        if (err) {
          res.status(500).send(err);
        } else {
          expense.receipts.push({
            url: receiptPath,
          });

          res.status(200).send(expense);
        }
      });
    } else {
      res.status(404).send('Expense not found');
    }
  }
});

module.exports = router;
