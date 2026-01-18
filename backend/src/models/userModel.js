const db = require('../database');

class UserModel {
  // Crear un nuevo usuario
  static create(name, email, hashedPassword) {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, hashedPassword);
    return result.lastInsertRowid;
  }

  // Buscar usuario por email
  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  // Buscar usuario por ID
  static findById(id) {
    const stmt = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }
}

module.exports = UserModel;