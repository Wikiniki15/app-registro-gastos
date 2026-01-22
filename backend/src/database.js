const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'expense_tracker.db'));
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

// Crear tabla de transacciones
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    amount REAL NOT NULL CHECK(amount > 0),
    description TEXT NOT NULL,
    category TEXT,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Crear tabla de categorías
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Insertar categorías predefinidas (solo si no existen)
const checkCategories = db.prepare('SELECT COUNT(*) as count FROM categories WHERE is_default = 1');
const result = checkCategories.get();

if (result.count === 0) {
  const insertDefaultCategory = db.prepare(
    'INSERT INTO categories (user_id, name, is_default) VALUES (NULL, ?, 1)'
  );
  
  const defaultCategories = [
    'Alimentación',
    'Transporte',
    'Entretenimiento',
    'Salud',
    'Educación',
    'Otros'
  ];
  
  defaultCategories.forEach(category => {
    insertDefaultCategory.run(category);
  });
  
  console.log('Categorías predefinidas creadas');
}

console.log('Base de datos inicializada correctamente');

module.exports = db;