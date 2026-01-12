"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Package } from "lucide-react"; // استدعاء أيقونة Package

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const BASE_URL = "https://iraqi-e-store-api.vercel.app";

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`, { withCredentials: true });
      setOrders(res.data.orders || res.data);
    } catch (err) {
      toast.error("فشل جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deleteOrder = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await axios.delete(`${BASE_URL}/api/orders/${id}`, { withCredentials: true });
      setOrders(prev => prev.filter(o => o._id !== id));
      toast.info("تم حذف الطلب بنجاح");
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdating(true);
    try {
      await axios.put(`${BASE_URL}/api/orders/status`, { orderId, status }, { withCredentials: true });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      toast.success("تم تحديث حالة الطلب");
    } catch (err) {
      toast.error("فشل تحديث الحالة");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-4 bg-gray-50/50 min-h-screen" dir="rtl">
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

      {/* Header مع أيقونة Package */}
      <h2 className="text-2xl font-black text-gray-900 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Package size={28} color="#FF7F00" /> {/* أيقونة برتقالية */}
        الطلبات الحالية
      </h2>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="p-10 text-center font-black text-blue-600 animate-bounce">
            جاري جلب البيانات...
          </div>
        ) : orders.map(o => (
          <div key={o._id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold text-gray-800">#{o._id.slice(-6)}</span>

              {/* select الحالة */}
              <div className="relative inline-block">
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                  disabled={updating}
                  className=" rounded-xl p-1 text-sm font-bold pr-6 appearance-none text-right bg-orange-200 border-none outline-none"
                  style={{ direction: "rtl" }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className="text-sm font-medium text-gray-600">{o.userId?.email || "مجهول"}</div>
            <div className="text-sm font-medium text-gray-600">{o.phone}</div>
            <div className="text-sm font-medium text-gray-600 truncate">{o.address}</div>

            <div className="text-sm font-medium text-gray-600">
              <strong>المنتجات:</strong>
              {o.items.map(it => (
                <div key={it._id}> {it.name} x{it.qty}</div>
              ))}
            </div>
            
        <div className="flex justify-between items-center gap-2">
            <div className="text-sm font-bold text-orange-600">
              إجمالي الطلب: {Number(o.total || 0).toFixed(2)}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => deleteOrder(o._id)}
                className="p-2 bg-red-50 text-orange-600 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
    </div>
          </div>
        ))}
      </div>
    </div>
  );
}
