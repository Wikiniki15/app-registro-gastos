import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import * as transactionService from '../services/transactionService';
import TransactionFilters from '../components/TransactionFilters';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});

  // Cargar transacciones al montar el componente
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      const data = await transactionService.getTransactions(appliedFilters);
      setTransactions(data.transactions);
      setError('');
    } catch (err) {
      console.error('Error al cargar transacciones:', err);
      setError('Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = async (transactionData) => {
    try {
      await transactionService.createTransaction(transactionData);
      loadTransactions(); // Recargar lista
      alert('Transacción agregada exitosamente');
    } catch (err) {
      console.error('Error al crear transacción:', err);
      alert('Error al agregar transacción');
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      loadTransactions(); // Recargar lista
      alert('Transacción eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar transacción:', err);
      alert('Error al eliminar transacción');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFilterChange = (newFilters) => {
  setFilters(newFilters);
  loadTransactions(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Control de Gastos
          </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/statistics')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Ver Estadísticas
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Gestionar Categorías
          </button>
          <span className="text-gray-600">
            Hola, {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <TransactionForm onTransactionAdded={handleTransactionAdded} />

        <TransactionFilters onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando transacciones...</p>
          </div>
        ) : (
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;