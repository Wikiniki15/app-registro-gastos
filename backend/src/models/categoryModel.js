const db = require('../database');

class CategoryModel {
  // Obtener todas las categorías (predefinidas + personalizadas del usuario)
  static findAll(userId) {
    const stmt = db.prepare(`
      SELECT * FROM categories 
      WHERE is_default = 1 OR user_id = ?
      ORDER BY is_default DESC, name ASC
    `);
    return stmt.all(userId);
  }

  // Crear categoría personalizada
  static create(userId, name) {
    const stmt = db.prepare(
      'INSERT INTO categories (user_id, name, is_default) VALUES (?, ?, 0)'
    );
    const result = stmt.run(userId, name);
    return result.lastInsertRowid;
  }

  // Buscar categoría por ID
  static findById(id, userId) {
    const stmt = db.prepare(
      'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR is_default = 1)'
    );
    return stmt.get(id, userId);
  }

  // Actualizar categoría personalizada
  static update(id, userId, name) {
    const stmt = db.prepare(
      'UPDATE categories SET name = ? WHERE id = ? AND user_id = ? AND is_default = 0'
    );
    const result = stmt.run(name, id, userId);
    return result.changes > 0;
  }

  // Eliminar categoría personalizada
  static delete(id, userId) {
    const stmt = db.prepare(
      'DELETE FROM categories WHERE id = ? AND user_id = ? AND is_default = 0'
    );
    const result = stmt.run(id, userId);
    return result.changes > 0;
  }

  // Verificar si existe una categoría con ese nombre para el usuario
  static existsByName(userId, name) {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM categories 
      WHERE name = ? AND (user_id = ? OR is_default = 1)
    `);
    const result = stmt.get(name, userId);
    return result.count > 0;
  }
}

module.exports = CategoryModel;