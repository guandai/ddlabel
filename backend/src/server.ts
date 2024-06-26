// backend/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import connection from './db';

const app = express();

app.use(express.json());
app.use(cors());

interface Package {
  id: number;
  name: string;
  created_at?: Date;
}

type PackageEntity = { name: string, id: number, created_at: Date };

app.get('/api/packages', (req: Request, res: Response) => {
  connection.query('SELECT * FROM packages', (err: Error, results: PackageEntity[]) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/packages', (req: Request, res: Response) => {
  const { name } = req.body;
  const query = 'INSERT INTO packages (name) VALUES (?)';
  connection.query(query, [name], (err: Error | null, results: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newPackage: Package = { id: results.insertId, name };
    res.status(201).json(newPackage);
  });
});

app.delete('/api/packages/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const query = 'DELETE FROM packages WHERE id = ?';
  connection.query(query, [id], (err: Error | null, _results: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).send();
  });
});

// New update endpoint
app.put('/api/packages/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = 'UPDATE packages SET name = ? WHERE id = ?';
  connection.query(query, [name, id], (err: Error | null, results: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.status(200).json({ id, name });
  });
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
