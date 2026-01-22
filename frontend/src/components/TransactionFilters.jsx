import { useState, useEffect } from 'react';
import * as categoryService from '../services/categoryService';

function TransactionFilters({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategory,
      type: selectedType,
      startDate,
      endDate
    };
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedType('');
    setStartDate('');
    setEndDate('');
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Filtro por tipo */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Tipo
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro por fecha desde */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Fecha desde
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por fecha hasta */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Fecha hasta
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={handleClearFilters}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition duration-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}

export default TransactionFilters;