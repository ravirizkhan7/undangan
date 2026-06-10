import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, timestamp, boolean, varchar } from 'drizzle-orm/pg-core';
import { desc } from 'drizzle-orm';
import { Pool } from 'pg';
import cors from 'cors';

// Schema
export const ucapan = pgTable('ucapan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  komentar: text('komentar').notNull(),
  kehadiran: boolean('kehadiran').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Deklarasikan instance Express di luar function agar bisa di-export untuk Vercel Serverless Runtime
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function startServer() {
  // Database Connection
  const dbUrl = process.env.DATABASE_URL;
  let db: ReturnType<typeof drizzle> | null = null;
  let pool: Pool | null = null;

  if (dbUrl) {
    try {
      pool = new Pool({
        connectionString: dbUrl,
      });
      db = drizzle(pool);
      
      // Auto-migrate table ke Neon Singapore
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
    console.warn('WARNING: DATABASE_URL is not set. Database features will not work.');
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

  // Routing Static File: Deteksi apakah berjalan di Serverless Vercel atau Local Dev
  if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      // Mencegah API routing nyasar nge-serve HTML
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API Route Not Found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Mode Sandbox AI Studio / Local Development biasa
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Hanya jalankan app.listen jika TIDAK sedang dideploy di Serverless Vercel
  if (process.env.VERCEL !== '1') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

// Jalankan inisialisasi database dan routing middleware
startServer();

// Wajib diexport agar dibaca dengan benar oleh vercel.json -> @vercel/node
export default app;