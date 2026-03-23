import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setQuantity("");
    setPrice("");
  };

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timer = window.setTimeout(() => setSuccess(""), 2500);
    return () => window.clearTimeout(timer);
  }, [success]);

  const saveProduct = () => {
    if (!name.trim() || !quantity || !price) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess("");

    const url = editingId
      ? `http://127.0.0.1:8000/api/products/${editingId}`
      : "http://127.0.0.1:8000/api/products";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, price }),
    })
      .then(() => {
        fetchProducts();
        setSuccess(
          editingId
            ? "Product updated successfully"
            : "Product added successfully",
        );
        resetForm();
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  };

  const deleteProduct = (id) => {
    setError(null);
    setSuccess("");

    fetch(`http://127.0.0.1:8000/api/products/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchProducts())
      .catch(() => setError("Failed to delete product"));
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setQuantity(String(product.quantity));
    setPrice(String(product.price));
  };

  const showTableLayout = products.length > 10;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300">
              Inventory Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Inventory System
            </h1>
          </div>
          <button
            onClick={() => setDarkMode((value) => !value)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>

        <div className="mb-8 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 transition-colors dark:bg-slate-900 dark:shadow-black/20 dark:ring-slate-800">
          {error && (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-red-600 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {success}
            </p>
          )}
          {loading && (
            <p className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Loading...
            </p>
          )}

          <div className="grid gap-3 md:grid-cols-[minmax(0,1.5fr)_120px_120px_auto]">
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-400 dark:focus:ring-cyan-900"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-400 dark:focus:ring-cyan-900"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <input
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-cyan-400 dark:focus:ring-cyan-900"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <button
              onClick={saveProduct}
              disabled={loading}
              className="rounded-2xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>

          {editingId && (
            <button
              onClick={resetForm}
              className="mt-3 text-sm font-medium text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Cancel editing
            </button>
          )}
        </div>

        {showTableLayout ? (
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 dark:bg-slate-900 dark:shadow-black/20 dark:ring-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Qty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4">{product.quantity}</td>
                      <td className="px-6 py-4">{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="rounded-xl bg-amber-400 px-3 py-2 text-sm font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/60 ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-2xl dark:bg-slate-900 dark:shadow-black/20 dark:ring-slate-800"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Qty: {product.quantity}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Price: {product.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(product)}
                    className="rounded-2xl bg-amber-400 px-4 py-2 font-medium text-slate-900 transition hover:-translate-y-0.5 hover:bg-amber-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="rounded-2xl bg-red-500 px-4 py-2 font-medium text-white transition hover:-translate-y-0.5 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
