const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.post('/users', (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username is required' });
  }

  db.run('INSERT INTO users (username) VALUES (?)', [username], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create user' });
    }
    res.status(201).json({
      message: 'User created successfully',
      response: { username, _id: this.lastID }
    });
  });
});

router.get('/users', (_, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json({ message: 'Success', users: rows });
  });
});

module.exports = router;
