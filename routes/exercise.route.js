const express = require('express');
const router = express.Router();
const db = require('../database/database');

router.post('/exercises/:_id/exercise', (req, res) => {
    const { _id: userId } = req.params;
    const { description, duration, date } = req.body;

    db.run(
        `INSERT INTO exercise (userId, duration, description, date) VALUES (?, ?, ?, ?)`,
        [userId, duration, description, date || new Date().toISOString().split('T')[0]],
        function (err) {
            if (err) {
                if (err.message.includes("FOREIGN KEY constraint failed")) {
                    return res.status(400).json({
                        error: 'Foreign key violation: The specified userId does not exist.'
                    });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: 'Exercise created successfully',
                response: {
                    id: this.lastID,
                    userId,
                    description,
                    duration,
                    date: date || new Date().toISOString().split('T')[0],
                }
            });
        }
    );
});


router.get('/exercises/:_id/logs', (req, res) => {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    if (!_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    if (!from) {
        return res.status(400).json({ error: 'From is required' });
    }

    const fromDate = from ? from : null;
    const toDate = to ? to : null;
    const limitValue = limit ? parseInt(limit) : -1;

    const query = `
    SELECT e.description, e.duration, e.date, u.username 
    FROM exercise e 
    JOIN users u ON e.userId = u.id
    WHERE e.userId = ? 
    AND (e.date >= ? OR ? IS NULL) 
    AND (e.date <= ? OR ? IS NULL) 
    ORDER BY e.date ASC
    LIMIT ?;
  `;


    db.all(query, [_id, fromDate, fromDate, toDate, toDate, limitValue], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch logs' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No exercises found' });
        }

        const logs = rows.map(row => ({
            description: row.description,
            duration: row.duration,
            date: row.date
        }));

        res.json({
            username: rows[0].username,
            count: logs.length,
            log: logs
        });
    });
});



module.exports = router;
