const db = require('../database');

class TransactionModel {
  // Crear una nueva transacción
  static create(userId, type, amount, description, category, date) {
    const stmt = db.prepare(
      'INSERT INTO transactions (user_id, type, amount, description, category, date) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(userId, type, amount, description, category, date);
    return result.lastInsertRowid;
  }

  // Obtener todas las transacciones de un usuario
  static findByUserId(userId) {
    const stmt = db.prepare(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC'
    );
    return stmt.all(userId);
  }

  // Obtener una transacción por ID
  static findById(id, userId) {
    const stmt = db.prepare(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?'
    );
    return stmt.get(id, userId);
  }

  // Eliminar una transacción
  static delete(id, userId) {
    const stmt = db.prepare(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?'
    );
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }
}

module.exports = TransactionModel;