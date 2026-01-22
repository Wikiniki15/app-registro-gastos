const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener todas las categorías
router.get('/', categoryController.getAll);

// Crear categoría personalizada
router.post('/', categoryController.create);

// Actualizar categoría personalizada
router.put('/:id', categoryController.update);

// Eliminar categoría personalizada
router.delete('/:id', categoryController.delete);

module.exports = router;