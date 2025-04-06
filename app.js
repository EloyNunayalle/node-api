const express = require('express');
const db = require('./db.js');
const app = express();
const PORT = 3000;

app.use(express.json());

// Obtener todos los estudiantes
app.get('/students', (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Obtener un estudiante por ID
app.get('/students/:id', (req, res) => {
  db.get("SELECT * FROM students WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json(row);
  });
});

// Crear nuevo estudiante
app.post('/students', (req, res) => {
  const { nombre, apellido, edad, genero, curso } = req.body;
  if (!nombre || !apellido || !edad || !genero || !curso) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  db.run(
    "INSERT INTO students (nombre, apellido, edad, genero, curso) VALUES (?, ?, ?, ?, ?)",
    [nombre, apellido, edad, genero, curso],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, nombre, apellido, edad, genero, curso });
    }
  );
});

// Actualizar estudiante
app.put('/students/:id', (req, res) => {
  const { nombre, apellido, edad, genero, curso } = req.body;
  if (!nombre || !apellido || !edad || !genero || !curso) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  db.run(
    "UPDATE students SET nombre = ?, apellido = ?, edad = ?, genero = ?, curso = ? WHERE id = ?",
    [nombre, apellido, edad, genero, curso, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: req.params.id, nombre, apellido, edad, genero, curso });
    }
  );
});

// Eliminar estudiante
app.delete('/students/:id', (req, res) => {
  db.run("DELETE FROM students WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Estudiante eliminado", changes: this.changes });
  });
});

// Crear tabla al iniciar
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      edad INTEGER NOT NULL,
      genero TEXT NOT NULL,
      curso TEXT NOT NULL
    )
  `);
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
