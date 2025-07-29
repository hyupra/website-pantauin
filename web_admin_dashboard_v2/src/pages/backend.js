// dependencies
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 5000;

// koneksi PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'nama_database',
  password: 'password',
  port: 5432,
});

// endpoint GET semua data alat
app.get('/api/alat', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alat');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
