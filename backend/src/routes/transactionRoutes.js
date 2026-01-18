const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Crear transacción
router.post('/', transactionController.create);

// Obtener todas las transacciones del usuario
router.get('/', transactionController.getAll);

// Eliminar transacción
router.delete('/:id', transactionController.delete);

module.exports = router;