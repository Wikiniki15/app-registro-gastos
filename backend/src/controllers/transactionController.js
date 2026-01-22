const TransactionModel = require('../models/transactionModel');

// Crear nueva transacción
exports.create = (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    const userId = req.userId;

    // Validaciones
    if (!type || !amount || !description || !date) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Tipo inválido. Debe ser "income" o "expense"' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a cero' });
    }

    // Crear transacción
    const transactionId = TransactionModel.create(
      userId,
      type,
      amount,
      description,
      category || null,
      date
    );

    res.status(201).json({
      message: 'Transacción creada exitosamente',
      transactionId
    });

  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};

// Obtener todas las transacciones del usuario (con filtros opcionales)
exports.getAll = (req, res) => {
  try {
    const userId = req.userId;
    const { category, type, startDate, endDate } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    // Filtro por categoría
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    // Filtro por tipo (income/expense)
    if (type && (type === 'income' || type === 'expense')) {
      query += ' AND type = ?';
      params.push(type);
    }

    // Filtro por rango de fechas
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const db = require('../database');
    const stmt = db.prepare(query);
    const transactions = stmt.all(...params);

    res.json({
      transactions,
      total: transactions.length,
      filters: { category, type, startDate, endDate }
    });

  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

// Eliminar transacción
exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verificar que la transacción existe y pertenece al usuario
    const transaction = TransactionModel.findById(id, userId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    // Eliminar
    const deleted = TransactionModel.delete(id, userId);

    if (deleted) {
      res.json({ message: 'Transacción eliminada exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar transacción' });
    }

  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    res.status(500).json({ error: 'Error al eliminar transacción' });
  }
};