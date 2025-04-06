const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de la base de datos en archivo
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite en', dbPath);
  }
});

// Cerrar conexión al terminar el proceso
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la base de datos:', err.message);
    } else {
      console.log('Base de datos cerrada');
    }
  });
});

module.exports = db;
