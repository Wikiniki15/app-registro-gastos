const db = require('../database');

// Obtener resumen general (ingresos totales, gastos totales, balance)
exports.getSummary = (req, res) => {
  try {
    const userId = req.userId;

    const stmt = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpenses
      FROM transactions 
      WHERE user_id = ?
    `);

    const result = stmt.get(userId);
    
    const totalIncome = result.totalIncome || 0;
    const totalExpenses = result.totalExpenses || 0;
    const balance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance
    });

  } catch (error) {
    console.error('Error al obtener resumen:', error);
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};

// Obtener gastos por categoría
exports.getByCategory = (req, res) => {
  try {
    const userId = req.userId;

    const stmt = db.prepare(`
      SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND category IS NOT NULL
      GROUP BY category
      ORDER BY total DESC
    `);

    const categories = stmt.all(userId);

    res.json({ categories });

  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener gastos por categoría' });
  }
};

// Obtener tendencia mensual (últimos 6 meses)
exports.getMonthlyTrend = (req, res) => {
  try {
    const userId = req.userId;

    const stmt = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
      FROM transactions 
      WHERE user_id = ? 
        AND date >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `);

    const trend = stmt.all(userId);

    res.json({ trend });

  } catch (error) {
    console.error('Error al obtener tendencia mensual:', error);
    res.status(500).json({ error: 'Error al obtener tendencia mensual' });
  }
};

// Obtener top 5 categorías de mayor gasto
exports.getTopCategories = (req, res) => {
  try {
    const userId = req.userId;

    // Primero obtener el total de gastos
    const totalStmt = db.prepare(`
      SELECT SUM(amount) as total
      FROM transactions 
      WHERE user_id = ? AND type = 'expense'
    `);
    const totalResult = totalStmt.get(userId);
    const totalExpenses = totalResult.total || 1; // Evitar división por cero

    // Obtener top 5 categorías
    const stmt = db.prepare(`
      SELECT 
        category,
        SUM(amount) as total,
        ROUND((SUM(amount) * 100.0 / ?), 2) as percentage
      FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND category IS NOT NULL
      GROUP BY category
      ORDER BY total DESC
      LIMIT 5
    `);

    const topCategories = stmt.all(totalExpenses, userId);

    res.json({ topCategories });

  } catch (error) {
    console.error('Error al obtener top categorías:', error);
    res.status(500).json({ error: 'Error al obtener top categorías' });
  }
};

// Obtener estadísticas del mes actual
exports.getCurrentMonth = (req, res) => {
  try {
    const userId = req.userId;

    const stmt = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses,
        COUNT(*) as transactionCount
      FROM transactions 
      WHERE user_id = ? 
        AND strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
    `);

    const result = stmt.get(userId);
    
    const income = result.income || 0;
    const expenses = result.expenses || 0;
    const balance = income - expenses;
    const transactionCount = result.transactionCount || 0;

    // Calcular promedio diario de gastos del mes
    const currentDay = new Date().getDate();
    const avgDailyExpense = currentDay > 0 ? expenses / currentDay : 0;

    res.json({
      income,
      expenses,
      balance,
      transactionCount,
      avgDailyExpense: Math.round(avgDailyExpense * 100) / 100
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del mes:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del mes' });
  }
};