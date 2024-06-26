const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL password
  database: 'temple'
});

// Routes
// Get all temples
app.get('/temples', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT id, name FROM temples');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching temples:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get events for a specific temple in a month
app.get('/api/events', async (req, res) => {
  const { templeId, year, month } = req.query;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM events WHERE temple_id = ? AND YEAR(event_date) = ? AND MONTH(event_date) = ?',
      [templeId, year, month]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new event
app.post('/api/events', async (req, res) => {
  const { eventDate, eventName, description, templeId } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO events (event_date, event_name, description, temple_id) VALUES (?, ?, ?, ?)',
      [eventDate, eventName, description, templeId]
    );
    connection.release();
    res.status(201).send('Event added successfully');
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an event
app.delete('/api/events/:eventId', async (req, res) => {
  const eventId = req.params.eventId;
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM events WHERE id = ?', [eventId]);
    connection.release();
    res.send('Event deleted successfully');
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
  });