const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./src/database');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const statisticsRoutes = require('./src/routes/statisticsRoutes');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente!' });
});

// Usar rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/statistics', statisticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});