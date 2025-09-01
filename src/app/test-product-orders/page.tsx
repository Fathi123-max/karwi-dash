"use client";

import { useEffect, useState } from "react";

import { useAdminProductOrderStore } from "@/stores/admin-dashboard/product-order-store";

export default function TestProductOrders() {
  const { orders, loading, error, fetchOrders } = useAdminProductOrderStore();
  const [clientLoading, setClientLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setClientLoading(true);
      try {
        await fetchOrders();
      } catch (err) {
        console.error("Error in component:", err);
      } finally {
        setClientLoading(false);
      }
    };

    loadOrders();
  }, [fetchOrders]);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Test Product Orders</h1>

      {clientLoading || loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
          <button onClick={() => fetchOrders()} className="mt-2 rounded bg-blue-500 px-4 py-2 text-white">
            Retry
          </button>
        </div>
      ) : (
        <div>
          <p>Found {orders.length} orders</p>
          {orders.length > 0 && (
            <div className="mt-4">
              <h2 className="mb-2 text-xl font-semibold">First Order Details:</h2>
              <pre className="rounded bg-gray-100 p-4">{JSON.stringify(orders[0], null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
