const Database = require('better-sqlite3');
const path = require('path');

// Crear la base de datos en la raíz del proyecto
const db = new Database(path.join(__dirname, '..', 'expense_tracker.db'));

// Habilitar claves foráneas
db.pragma('foreign_keys = ON');

// Crear tabla de usuarios
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Base de datos inicializada correctamente');

module.exports = db;