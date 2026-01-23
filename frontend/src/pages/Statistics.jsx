import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as statisticsService from '../services/statisticsService';
import SummaryCards from '../components/SummaryCards';
import ExpensesPieChart from '../components/ExpensesPieChart';
import MonthlyTrendChart from '../components/MonthlyTrendChart';
import TopCategoriesTable from '../components/TopCategoriesTable';
import CurrentMonthStats from '../components/CurrentMonthStats';
import * as transactionService from '../services/transactionService';

function Statistics() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [categoriesData, setCategoriesData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [monthStats, setMonthStats] = useState({ income: 0, expenses: 0, balance: 0, transactionCount: 0, avgDailyExpense: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStatistics();
  }, []);

  const loadAllStatistics = async () => {
    try {
      setLoading(true);
      
      const [summaryData, categoryData, trendDataRes, topCatData, monthData] = await Promise.all([
        statisticsService.getSummary(),
        statisticsService.getByCategory(),
        statisticsService.getMonthlyTrend(),
        statisticsService.getTopCategories(),
        statisticsService.getCurrentMonth()
      ]);

      setSummary(summaryData);
      setCategoriesData(categoryData.categories);
      setTrendData(trendDataRes.trend);
      setTopCategories(topCatData.topCategories);
      setMonthStats(monthData);

    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setLoading(false);
    }
  };

    const handleExportCSV = async () => {
    try {
        await transactionService.exportToCSV();
        alert('Archivo CSV descargado exitosamente');
    } catch (err) {
        console.error('Error al exportar CSV:', err);
        alert('Error al exportar archivo CSV');
    }
    };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard - Estadísticas
          </h1>
          <div className="flex items-center gap-4">
            <button
                onClick={handleExportCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
            Exportar a CSV
            </button>
            <button
                onClick={() => navigate('/dashboard')}
                className="text-blue-600 hover:text-blue-800 font-semibold"
            >
            Volver a Transacciones
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
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* Tarjetas de resumen */}
            <SummaryCards summary={summary} />

            {/* Gráficos principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ExpensesPieChart categoriesData={categoriesData} />
              <MonthlyTrendChart trendData={trendData} />
            </div>

            {/* Tablas y estadísticas adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopCategoriesTable topCategories={topCategories} />
              <CurrentMonthStats monthStats={monthStats} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Statistics;