import { useState, useEffect } from 'react';
import * as categoryService from '../services/categoryService';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data.categories);
      setError('');
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await categoryService.createCategory(newCategoryName);
      setNewCategoryName('');
      loadCategories();
      alert('Categoría creada exitosamente');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdate = async (id) => {
    try {
      await categoryService.updateCategory(id, editingName);
      setEditingId(null);
      setEditingName('');
      loadCategories();
      alert('Categoría actualizada exitosamente');
    } catch (err) {
      alert(err.response?.data?.error || 'Error al actualizar categoría');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${name}"? Las transacciones asociadas se reasignarán a "Otros".`)) {
      try {
        await categoryService.deleteCategory(id);
        loadCategories();
        alert('Categoría eliminada exitosamente');
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar categoría');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Gestión de Categorías
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Formulario para crear nueva categoría */}
      <form onSubmit={handleCreate} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nueva categoría..."
            maxLength="30"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Agregar
          </button>
        </div>
      </form>

      {/* Lista de categorías */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
          >
            {editingId === category.id ? (
              // Modo edición
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  maxLength="30"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleUpdate(category.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              // Modo visualización
              <>
                <div>
                  <span className="text-gray-800 font-medium">{category.name}</span>
                  {category.is_default === 1 && (
                    <span className="ml-2 text-xs text-gray-500 italic">(Predefinida)</span>
                  )}
                </div>
                {category.is_default === 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;