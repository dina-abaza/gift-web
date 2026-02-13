"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PackageSearch, Edit, Trash2, PlusCircle, ImageIcon, Weight, ChevronRight, ChevronLeft, Layers, AlignRight } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    discountActive: false,
    category: "",
    weight: "",
    description: "",
  });

  // حالة للخطأ في الحقول
  const [errors, setErrors] = useState({
    name: "",
    image: "",
  });

  const BASE_URL = "https://iraqi-e-store-api.vercel.app";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/categories`);
      setCategories(res.data.categories || res.data);
    } catch (err) {
      toast.error("فشل جلب الفئات");
    }
  };

const fetchProducts = async (pageNumber = 1) => {
  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/api/products?page=${pageNumber}&limit=10`);
    setProducts(res.data.products || []);
    
    // تأكدي من السيرفر، غالباً يرسل totalPages أو حسابها يدوياً:
    // إذا كان يرسل إجمالي المنتجات 127، نقسمها على 10
    const total = res.data.totalPages || Math.ceil(127 / 10); 
    setTotalPages(total);
    
    setPage(pageNumber);
  } catch (err) {
    toast.error("فشل جلب المنتجات");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    
    // إعادة تعيين الأخطاء
    setErrors({ name: "", image: "" });
    
    // التحقق من الحقول
    let isValid = true;
    
    // التحقق من اسم المنتج (مطلوب فقط، بدون حدود على الطول)
  // التحقق من اسم المنتج
if (!form.name.trim()) {
  setErrors(prev => ({ ...prev, name: "اسم المنتج مطلوب" }));
  isValid = false;
} else if (form.name.length > 20) { 
  setErrors(prev => ({ ...prev, name: "الاسم لا يجب أن يتجاوز 20 حرفاً" }));
  isValid = false;
}

if (form.description.length > 200) { 
  toast.warn("الوصف طويل جداً، الحد الأقصى 200 حرف");
  isValid = false;
}
    
    // التحقق من الصورة (حد أقصى 5 ميجا)
    if (!editProductId && imageFile) {
      const maxSize = 5 * 1024 * 1024; // 5 ميجا
      if (imageFile.size > maxSize) {
        setErrors(prev => ({ ...prev, image: "حجم الصورة يجب أن يكون على الأكثر 5 ميجا" }));
        isValid = false;
      }
    }
    
    // التحقق من الحقول المطلوبة الأخرى
    if (!form.price || !form.category || (!editProductId && !imageFile)) {
      toast.warn("تأكد من إدخال جميع الحقول المطلوبة");
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("discountPrice", form.discountPrice || "");
    formData.append("discountActive", form.discountActive.toString());
    formData.append("category", form.category);
    formData.append("weight", form.weight || "");
    formData.append("description", form.description || "");
    if (imageFile) formData.append("image", imageFile);

    try {
      const config = { withCredentials: true };
      if (editProductId) {
        await axios.put(`${BASE_URL}/api/products/${editProductId}`, formData, config);
        toast.success("تم التحديث بنجاح");
      } else {
        await axios.post(`${BASE_URL}/api/products`, formData, config);
        toast.success("تمت الإضافة بنجاح");
      }
      await fetchProducts(page);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ في العملية");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", discountPrice: "", discountActive: false, category: "", weight: "", description: "" });
    setImageFile(null);
    setEditProductId(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const deleteProduct = async (id) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`, { withCredentials: true });
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.info("تم الحذف بنجاح");
    } catch (err) {
      toast.error("فشل الحذف");
    }
  };

  const editProduct = (product) => {
    setEditProductId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      discountPrice: product.discountActive ? (product.discountPrice || "") : "",
      discountActive: product.discountActive || false,
      category: product.category?._id || product.category || "",
      weight: product.weight || "",
      description: product.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 bg-gray-50/50 min-h-screen" dir="rtl">
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />

      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
            {editProductId ? <Edit className="text-white w-6 h-6" /> : <PackageSearch className="text-white w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {editProductId ? "تعديل المنتج" : "إضافة منتج جديد"}
            </h2>
            <p className="text-gray-500 text-xs font-medium">لوحة تحكم متجر العراق</p>
          </div>
        </div>
        {editProductId && (
          <button onClick={resetForm} className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all">
            إلغاء التعديل
          </button>
        )}
      </div>

      {/* نموذج الإدخال responsive */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl p-5 md:p-10 border border-gray-100 dark:border-gray-700">
        <form onSubmit={submitProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">اسم المنتج</label>
            <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold" value={form.name} maxLength={20} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="أدخل اسم المنتج..." required />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>

          <div className="space-y-1.5 relative">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">الفئة</label>
            <select className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl outline-none appearance-none font-bold text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">اختر الفئة...</option>
              {categories.map((cat) => ( <option key={cat._id} value={cat._id}>{cat.name}</option> ))}
            </select>
            <Layers className="absolute left-4 top-4 text-gray-400 pointer-events-none" size={18} />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">السعر الأصلي</label>
            <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">السعر بعد الخصم</label>
            <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold" type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="اختياري..." />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Weight size={16}/> الوزن (كغم)</label>
            <input className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="0.0" />
          </div>

          <div className="flex items-center gap-4 px-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
            <input type="checkbox" id="discountActive" checked={form.discountActive} onChange={(e) => setForm({ ...form, discountActive: e.target.checked })} className="w-6 h-6 rounded-lg accent-blue-600 cursor-pointer" />
            <label htmlFor="discountActive" className="font-black text-blue-700 dark:text-blue-400 cursor-pointer text-sm">تفعيل عرض الخصم</label>
          </div>

          <div className="col-span-full space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><AlignRight size={16}/> وصف المنتج</label>
            <textarea className="w-full p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" value={form.description} maxLength={200} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="اكتب تفاصيل المنتج هنا..." />
          </div>

          <div className="col-span-full space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><ImageIcon size={16}/> صورة المنتج</label>
            <div className="relative group">
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-3 md:p-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl cursor-pointer hover:border-blue-400 transition-all text-sm font-medium" required={!editProductId} />
              <div className="absolute left-4 top-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                 <PlusCircle size={20} />
              </div>
            </div>
            {errors.image && <span className="text-red-500 text-xs">{errors.image}</span>}
          </div>

          <button type="submit" disabled={submitting} className="col-span-full py-4.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-200 dark:shadow-none active:scale-[0.98] mt-4 flex justify-center items-center gap-2">
            {submitting ? "جاري المعالجة..." : (editProductId ? "تحديث المنتج" : "إضافة للمخزن")}
          </button>
        </form>
      </div>

      {/* جدول المنتجات مع تمرير أفقي */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30 dark:bg-gray-800/50">
          <h3 className="text-xl font-black flex items-center gap-3 text-gray-800 dark:text-white">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600"><PackageSearch size={20}/></div>
            المنتجات الحالية
          </h3>
          <span className="text-xs font-bold text-gray-400">إجمالي الصفحة: {products.length}</span>
        </div>

        {/* Desktop View Table - يظهر فقط في الشاشات الكبيرة lg وما فوق */}
        <div className="hidden lg:block overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[700px] text-right table-auto">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-5 font-bold">المعاينة</th>
                <th className="p-5 font-bold">اسم المنتج</th>
                <th className="p-5 font-bold">التصنيف</th>
                <th className="p-5 font-bold">السعر</th>
                <th className="p-5 font-bold">الخصم</th>
                <th className="p-5 font-bold">الوزن</th>
                <th className="p-5 text-center font-bold">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan="7" className="p-20 text-center font-black text-blue-600 animate-bounce">جاري جلب البيانات...</td></tr>
              ) : products.map((p) => (
                <tr key={p._id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                  <td className="p-5">
                    <div className="relative w-14 h-14 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-bold text-gray-800 dark:text-gray-200 block max-w-[180px] truncate text-sm">
                      {p.name}
                    </span>
                  </td>
                  <td className="p-5 text-sm font-bold text-gray-500">
                    <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                      {p.category?.name || "عام"}
                    </span>
                  </td>
                  <td className="p-5 font-black text-blue-600 whitespace-nowrap text-sm">
                    {p.price?.toLocaleString()} <span className="text-[10px]">ج.م</span>
                  </td>
                  <td className="p-5">
                    {p.discountActive ? (
                      <span className="text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-xl text-xs border border-green-100 dark:border-green-900/30">
                        {p.discountPrice?.toLocaleString()} ج.م
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="p-5 text-sm font-bold text-gray-400">
                    {p.weight ? `${p.weight}kg` : "—"}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-3 flex-wrap">
                      <button onClick={() => editProduct(p)} className="p-2.5 bg-white dark:bg-gray-700 text-yellow-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-yellow-500 hover:text-white transition-all transform hover:-translate-y-1"><Edit size={16} /></button>
                      <button onClick={() => deleteProduct(p._id)} className="p-2.5 bg-white dark:bg-gray-700 text-red-500 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet View Cards - يظهر في الشاشات الصغيرة والمتوسطة */}
        <div className="lg:hidden p-4 grid grid-cols-1 min-[910px]:grid-cols-2 gap-4">
          {loading ? (
             <div className="col-span-full p-10 text-center font-black text-blue-600 animate-bounce">جاري جلب البيانات...</div>
          ) : products.map((p) => (
            <div key={p._id} className="bg-white dark:bg-gray-700/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-600 shadow-sm flex gap-4 items-start relative overflow-hidden">
              <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-600">
                <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
              </div>
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-base line-clamp-1">{p.name}</h4>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-bold">
                    <span className="bg-gray-100 dark:bg-gray-600 px-2.5 py-1 rounded-lg">{p.category?.name || "عام"}</span>
                    {p.weight && <span className="flex items-center gap-1"><Weight size={12}/> {p.weight}kg</span>}
                    {p.discountActive && (
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-lg whitespace-nowrap">خصم</span>
                    )}
                </div>

                <div className="flex flex-wrap justify-between items-end mt-3 pt-3 border-t border-gray-50 dark:border-gray-600/50 gap-2">
                    <div className="flex flex-col">
                         {p.discountActive ? (
                            <>
                                <span className="text-xs text-gray-400 line-through font-bold">{p.price?.toLocaleString()}</span>
                                <span className="text-blue-600 font-black text-lg">{p.discountPrice?.toLocaleString()} <span className="text-xs">ج.م</span></span>
                            </>
                         ) : (
                            <span className="text-blue-600 font-black text-lg">{p.price?.toLocaleString()} <span className="text-xs">ج.م</span></span>
                         )}
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => editProduct(p)} className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-xl border border-yellow-100 dark:border-yellow-900/30 active:scale-90 transition-transform">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteProduct(p._id)} className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 active:scale-90 transition-transform">
                        <Trash2 size={18} />
                      </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* أزرار التنقل responsive */}
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row-reverse justify-center items-center gap-4 sm:gap-8">
          <button 
            onClick={() => fetchProducts(page + 1)}
           disabled={page >= totalPages || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:translate-y-0 transition-all text-sm group"
          >
            التالي
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col items-center">
             <span className="text-xs text-gray-400 font-bold mb-1">الصفحة الحالية</span>
             <span className="font-black text-gray-800 dark:text-white bg-blue-100 dark:bg-blue-900/40 w-10 h-10 flex items-center justify-center rounded-xl border border-blue-200 dark:border-blue-800 text-sm">
               {page}
             </span>
          </div>

          <button 
            onClick={() => fetchProducts(page - 1)}
            disabled={page === 1 || loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl font-bold shadow-sm hover:shadow-md disabled:opacity-30 disabled:hover:translate-y-0 transition-all text-sm group"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            السابق
          </button>
        </div>
      </div>
    </div>
  );
}