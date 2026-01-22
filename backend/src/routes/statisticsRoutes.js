const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener resumen general
router.get('/summary', statisticsController.getSummary);

// Obtener gastos por categoría
router.get('/by-category', statisticsController.getByCategory);

// Obtener tendencia mensual
router.get('/monthly-trend', statisticsController.getMonthlyTrend);

// Obtener top 5 categorías
router.get('/top-categories', statisticsController.getTopCategories);

// Obtener estadísticas del mes actual
router.get('/current-month', statisticsController.getCurrentMonth);

module.exports = router;