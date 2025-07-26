import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState('');

  useEffect(() => {
    fetchProducts();

    const socket = io('http://localhost:5000');
    socket.on('connect', () => console.log('🟢 WebSocket connected'));
    socket.on('product-updated', () => fetchProducts());
    return () => socket.disconnect();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError('❌ API Error: ' + err.message);
    }
  };

  const handleEdit = (id, currentStock) => {
    setEditingId(id);
    setNewStock(currentStock);
  };

  const saveStock = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        stock: parseInt(newStock),
      });
      setEditingId(null);
      fetchProducts();
    } catch {
      alert('❌ Failed to update stock');
    }
  };

  const lowStock = products.filter(p => p.stock <= p.threshold);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">📦 Inventory Dashboard</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 border border-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
          {lowStock.length > 0 && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded border border-yellow-300 animate-pulse">
              🚨 Low Stock Items: {lowStock.length}
            </div>
          )}
          <button
            onClick={fetchProducts}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Add Product Form */}
        <div className="bg-white p-4 rounded shadow mb-6 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">➕ Add New Product</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const data = {
                name: form.name.value,
                sku: form.sku.value,
                stock: parseInt(form.stock.value),
                threshold: parseInt(form.threshold.value),
              };
              try {
                await axios.post('http://localhost:5000/api/products', data);
                form.reset();
                fetchProducts();
              } catch {
                alert('❌ Failed to add product');
              }
            }}
            className="space-y-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input name="name" placeholder="Name" required className="border p-2 rounded w-full" />
              <input name="sku" placeholder="SKU" required className="border p-2 rounded w-full" />
              <input name="stock" type="number" placeholder="Stock" required className="border p-2 rounded w-full" />
              <input name="threshold" type="number" placeholder="Threshold" required className="border p-2 rounded w-full" />
            </div>
            <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
              ➕ Add Product
            </button>
          </form>
        </div>

        {/* Product Table */}
        <div className="overflow-auto rounded border bg-white shadow mb-8">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">No products available</td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className={p.stock <= p.threshold ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">
                      {editingId === p.id ? (
                        <input
                          type="number"
                          value={newStock}
                          onChange={e => setNewStock(e.target.value)}
                          className="border px-2 py-1 rounded w-20"
                        />
                      ) : (
                        p.stock
                      )}
                    </td>
                    <td className="p-3">{p.threshold}</td>
                    <td className="p-3 flex gap-2 items-center">
                      {editingId === p.id ? (
                        <button
                          onClick={() => saveStock(p.id)}
                          className="text-green-600 hover:underline transition"
                        >
                          💾 Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(p.id, p.stock)}
                          className="text-blue-600 hover:underline transition"
                        >
                          ✏️ Edit
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (confirm(`Delete ${p.name}?`)) {
                            await axios.delete(`http://localhost:5000/api/products/${p.id}`);
                            fetchProducts();
                          }
                        }}
                        className="text-red-600 hover:underline transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stock Chart */}
        <h2 className="text-xl font-semibold mb-2 text-gray-700">📊 Top 5 Products by Stock</h2>
        <div className="bg-white p-4 rounded shadow border">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...products].sort((a, b) => b.stock - a.stock).slice(0, 5)}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
