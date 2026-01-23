function CurrentMonthStats({ monthStats }) {
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getMonthName = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[new Date().getMonth()];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Estadísticas de {getMonthName()}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Ingresos del mes */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Ingresos</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(monthStats.income)}
          </p>
        </div>

        {/* Gastos del mes */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Gastos</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(monthStats.expenses)}
          </p>
        </div>

        {/* Balance del mes */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Balance</p>
          <p className={`text-2xl font-bold ${monthStats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(monthStats.balance)}
          </p>
        </div>

        {/* Transacciones realizadas */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Transacciones</p>
          <p className="text-2xl font-bold text-blue-600">
            {monthStats.transactionCount}
          </p>
        </div>

        {/* Promedio diario de gasto */}
        <div className="border border-gray-200 rounded-lg p-4 col-span-2">
          <p className="text-gray-500 text-sm mb-1">Promedio de gasto diario</p>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(monthStats.avgDailyExpense)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurrentMonthStats;