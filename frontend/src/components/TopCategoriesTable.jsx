function TopCategoriesTable({ topCategories }) {
  if (!topCategories || topCategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Top 5 Categorías de Mayor Gasto
        </h3>
        <p className="text-center text-gray-500">No hay gastos registrados</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Top 5 Categorías de Mayor Gasto
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Monto Total</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {topCategories.map((cat, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-800">{cat.category}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-semibold text-red-600">
                    {formatCurrency(cat.total)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 text-sm w-12 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopCategoriesTable;