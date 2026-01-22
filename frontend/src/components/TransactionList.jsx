function TransactionList({ transactions, onDelete }) {
  const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const handleDelete = (id, description) => {
    if (window.confirm(`¿Estás seguro de eliminar "${description}"?`)) {
      onDelete(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">
          No hay transacciones registradas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Mis Transacciones
      </h2>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      transaction.type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                  </span>
                  {transaction.category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {transaction.category}
                    </span>
                  )}
                </div>

                <p className="text-gray-800 font-medium text-lg">
                  {transaction.description}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(transaction.date)}
                </p>
              </div>

              <div className="text-right ml-4">
                <p
                  className={`text-2xl font-bold ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatAmount(transaction.amount)}
                </p>
                <button
                  onClick={() => handleDelete(transaction.id, transaction.description)}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;