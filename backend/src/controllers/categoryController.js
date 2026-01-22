const CategoryModel = require('../models/categoryModel');

// Obtener todas las categorías (predefinidas + personalizadas del usuario)
exports.getAll = (req, res) => {
  try {
    const userId = req.userId;
    const categories = CategoryModel.findAll(userId);

    res.json({
      categories,
      total: categories.length
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

// Crear categoría personalizada
exports.create = (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    // Validaciones
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }

    if (name.length > 30) {
      return res.status(400).json({ error: 'El nombre no puede exceder 30 caracteres' });
    }

    // Verificar si ya existe
    if (CategoryModel.existsByName(userId, name.trim())) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    }

    // Crear categoría
    const categoryId = CategoryModel.create(userId, name.trim());

    res.status(201).json({
      message: 'Categoría creada exitosamente',
      categoryId
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
};

// Actualizar categoría personalizada
exports.update = (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.userId;

    // Validaciones
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }

    if (name.length > 30) {
      return res.status(400).json({ error: 'El nombre no puede exceder 30 caracteres' });
    }

    // Verificar que la categoría existe y pertenece al usuario
    const category = CategoryModel.findById(id, userId);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (category.is_default === 1) {
      return res.status(403).json({ error: 'No se pueden editar categorías predefinidas' });
    }

    // Actualizar
    const updated = CategoryModel.update(id, userId, name.trim());

    if (updated) {
      res.json({ message: 'Categoría actualizada exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al actualizar categoría' });
    }

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
};

// Eliminar categoría personalizada
exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verificar que la categoría existe y pertenece al usuario
    const category = CategoryModel.findById(id, userId);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    if (category.is_default === 1) {
      return res.status(403).json({ error: 'No se pueden eliminar categorías predefinidas' });
    }

    // Reasignar transacciones a "Otros" antes de eliminar
    const db = require('../database');
    const updateStmt = db.prepare(
      'UPDATE transactions SET category = ? WHERE category = ? AND user_id = ?'
    );
    updateStmt.run('Otros', category.name, userId);

    // Eliminar categoría
    const deleted = CategoryModel.delete(id, userId);

    if (deleted) {
      res.json({ message: 'Categoría eliminada exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar categoría' });
    }

  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
};