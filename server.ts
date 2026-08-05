// import express from 'express';
// import path from 'path';
// import { createServer as createViteServer } from 'vite';
// import cors from 'cors';
// import 'dotenv/config';

// // Driver PostgreSQL
// import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
// import { pgTable, serial as pgSerial, text as pgText, timestamp as pgTimestamp, boolean as pgBoolean, varchar as pgVarchar } from 'drizzle-orm/pg-core';
// import { Pool } from 'pg';

// // Driver MySQL (Laragon)
// import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
// import { mysqlTable, serial as mySerial, text as myText, timestamp as myTimestamp, boolean as myBoolean, varchar as myVarchar } from 'drizzle-orm/mysql-core';
// import mysql from 'mysql2/promise';

// import { desc } from 'drizzle-orm';

// // --- SCHEMA POSTGRES (Untuk Vercel / Neon) ---
// export const ucapanPg = pgTable('ucapan', {
//   id: pgSerial('id').primaryKey(),
//   nama: pgVarchar('nama', { length: 255 }).notNull(),
//   komentar: pgText('komentar').notNull(),
//   kehadiran: pgBoolean('kehadiran').notNull(),
//   createdAt: pgTimestamp('created_at').defaultNow().notNull(),
// });

// // --- SCHEMA MYSQL (Untuk Laragon Lokal) ---
// export const ucapanMy = mysqlTable('ucapan', {
//   id: mySerial('id').primaryKey(),
//   nama: myVarchar('nama', { length: 255 }).notNull(),
//   komentar: myText('komentar').notNull(),
//   kehadiran: myBoolean('kehadiran').notNull(),
//   createdAt: myTimestamp('created_at').defaultNow().notNull(),
// });

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// async function startServer() {
//   const dbUrl = process.env.DATABASE_URL;
//   let db: any = null;
//   let currentSchema: any = null;
//   const isMysql = dbUrl?.startsWith('mysql://');

//   if (dbUrl) {
//     try {
//       if (isMysql) {
//         // --- KONEKSI MYSQL LOKAL ---
//         const connection = await mysql.createConnection(dbUrl);
//         db = drizzleMysql(connection);
//         currentSchema = ucapanMy;

//         // Auto-create table MySQL
//         await connection.query(`
//           CREATE TABLE IF NOT EXISTS ucapan (
//             id INT AUTO_INCREMENT PRIMARY KEY,
//             nama VARCHAR(255) NOT NULL,
//             komentar TEXT NOT NULL,
//             kehadiran BOOLEAN NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
//           );
//         `);
//         console.log('Connected to MySQL Local (Laragon)');
//       } else {
//         // --- KONEKSI POSTGRES VERCEL ---
//         const pool = new Pool({ connectionString: dbUrl });
//         db = drizzlePg(pool);
//         currentSchema = ucapanPg;

//         // Auto-create table Postgres
//         await pool.query(`
//           CREATE TABLE IF NOT EXISTS ucapan (
//             id SERIAL PRIMARY KEY,
//             nama VARCHAR(255) NOT NULL,
//             komentar TEXT NOT NULL,
//             kehadiran BOOLEAN NOT NULL,
//             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
//           );
//         `);
//         console.log('Connected to PostgreSQL (Neon/Vercel)');
//       }
//     } catch (err) {
//       console.error('Failed to initialize database:', err);
//     }
//   } else {
//     console.warn('WARNING: DATABASE_URL is not set. Database features will not work.');
//   }

//   // API Routes
//   app.get('/api/ucapan', async (req, res) => {
//     if (!db) return res.status(500).json({ error: 'Database not configured' });
//     try {
//       const data = await db.select().from(currentSchema).orderBy(desc(currentSchema.createdAt));
//       res.json(data);
//     } catch (err) {
//       console.error('Error fetching ucapan:', err);
//       res.status(500).json({ error: 'Failed to fetch ucapan' });
//     }
//   });

//   app.post('/api/ucapan', async (req, res) => {
//     if (!db) return res.status(500).json({ error: 'Database not configured' });
//     try {
//       const { nama, komentar, kehadiran } = req.body;
//       if (!nama || !komentar || kehadiran === undefined) {
//         return res.status(400).json({ error: 'Incomplete data' });
//       }

//       await db.insert(currentSchema).values({
//         nama,
//         komentar,
//         kehadiran: Boolean(kehadiran),
//       });

//       res.status(201).json({ success: true });
//     } catch (err) {
//       console.error('Error saving ucapan:', err);
//       res.status(500).json({ error: 'Failed to save ucapan' });
//     }
//   });

//   // Routing Static File: Vercel vs Local
//   if (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production') {
//     const distPath = path.join(process.cwd(), 'dist');
//     app.use(express.static(distPath));

//     app.get('*', (req, res) => {
//       if (req.path.startsWith('/api/')) {
//         return res.status(404).json({ error: 'API Route Not Found' });
//       }
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   } else {
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: "spa",
//     });
//     app.use(vite.middlewares);
//   }

//   if (process.env.VERCEL !== '1') {
//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   }
// }

// startServer();

// export default app;