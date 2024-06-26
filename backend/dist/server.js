"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/api/packages', (req, res) => {
    db_1.default.query('SELECT * FROM packages', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.post('/api/packages', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO packages (name) VALUES (?)';
    db_1.default.query(query, [name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newPackage = { id: results.insertId, name };
        res.status(201).json(newPackage);
    });
});
app.delete('/api/packages/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM packages WHERE id = ?';
    db_1.default.query(query, [id], (err, _results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send();
    });
});
// New update endpoint
app.put('/api/packages/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const query = 'UPDATE packages SET name = ? WHERE id = ?';
    db_1.default.query(query, [name, id], (err, results) => {
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
