import express from 'express';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { desc } from 'drizzle-orm';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

// Schema
export const ucapan = pgTable('ucapan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  komentar: text('komentar').notNull(),
  kehadiran: boolean('kehadiran').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database Connection
const dbUrl = process.env.DATABASE_URL;
let db = null;
let pool = null;

if (dbUrl) {
  try {
    pool = new Pool({
      connectionString: dbUrl,
    });
    db = drizzle(pool);
    
    // Auto-migrate tabel ke Neon Singapore pas pertama diakses
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ucapan (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          komentar TEXT NOT NULL,
          kehadiran BOOLEAN NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
} else {
  console.warn('WARNING: DATABASE_URL is not set.');
}

// API Routes
app.get('/api/ucapan', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not configured' });
  try {
    const data = await db.select().from(ucapan).orderBy(desc(ucapan.createdAt));
    res.json(data);
  } catch (err) {
    console.error('Error fetching ucapan:', err);
    res.status(500).json({ error: 'Failed to fetch ucapan' });
  }
});

app.post('/api/ucapan', async (req, res) => {
  if (!db) return res.status(500).json({ error: 'Database not configured' });
  try {
    const { nama, komentar, kehadiran } = req.body;
    if (!nama || !komentar || kehadiran === undefined) {
      return res.status(400).json({ error: 'Incomplete data' });
    }

    await db.insert(ucapan).values({
      nama,
      komentar,
      kehadiran: Boolean(kehadiran),
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Error saving ucapan:', err);
    res.status(500).json({ error: 'Failed to save ucapan' });
  }
});

// Serve static file hasil build Vite (DIJAMIN TANPA COMPILER VITE / ROLLUP)
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API Route Not Found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Jalankan port jika di lokal
if (process.env.VERCEL !== '1') {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;