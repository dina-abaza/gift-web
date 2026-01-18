"use client";
import React, { useEffect, useState } from "react";
import { reviewService } from "@/app/services/reviewservice";
import { toast } from "react-toastify";
import Activity from "@/app/loading";
import { 
  Trash2, EyeOff, Eye, MessageSquare, Star, Filter, ClipboardList, User, CornerDownLeft 
} from "lucide-react";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filter !== "all") params.status = filter;
      const { data } = await reviewService.adminGetList(params);

      const mappedReviews = data.reviews.map(rev => ({
        ...rev,
        reply: rev.adminReply?.content || "",
        enabled: rev.status === "enabled"
      }));

      setReviews(mappedReviews);
    } catch (error) {
      toast.error("فشل في تحميل المراجعات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filter]);

  const handleToggle = async (id, currentEnabledStatus) => {
    try {
      const newStatus = !currentEnabledStatus;
      await reviewService.adminToggle(id, newStatus); 
      toast.success(newStatus ? "تم التفعيل" : "تم الإخفاء");
      setReviews(prev => prev.map(rev => 
        rev._id === id ? { ...rev, enabled: newStatus } : rev
      ));
    } catch (error) {
      toast.error("فشل تحديث الحالة");
    }
  };

  const handleReply = async (id, currentReply) => {
    const content = window.prompt("اكتب رد المتجر الرسمي:", currentReply || "");
    if (content !== null) {
      try {
        await reviewService.adminReply(id, content);
        toast.success("تم تحديث الرد");
        setReviews(prev => prev.map(rev => 
          rev._id === id ? { ...rev, reply: content } : rev
        ));
      } catch (error) {
        toast.error("فشل إرسال الرد");
      }
    }
  };

  const handleDelete = async (id) => {
    const reason = window.prompt("سبب الحذف:");
    if (reason) {
      try {
        await reviewService.adminDelete(id, reason);
        toast.success("تم الحذف بنجاح");
        setReviews(prev => prev.filter(rev => rev._id !== id));
      } catch (error) {
        toast.error("فشل الحذف");
      }
    }
  };

  if (loading) return <Activity />;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">
            <ClipboardList className="text-blue-600" /> إدارة المراجعات
          </h1>

          <div className="w-full md:w-auto flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <Filter size={16} className="text-gray-400 mr-2" />
            <select 
              className="bg-transparent border-none text-sm outline-none font-bold text-gray-600 cursor-pointer w-full"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">كل الحالات</option>
              <option value="enabled">المراجعات النشطة</option>
              <option value="disabled">المراجعات المخفية</option>
            </select>
          </div>
        </div>

        {/* Reviews Table/Cards Container */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          
          {/* Desktop Table View */}
          <table className="w-full text-right border-collapse hidden md:table">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs">
              <tr>
                <th className="p-4 font-bold">المنتج والعميل</th>
                <th className="p-4 font-bold text-center">التقييم</th>
                <th className="p-4 font-bold">المراجعة والرد</th>
                <th className="p-4 font-bold text-center">الحالة</th>
                <th className="p-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reviews.map((rev) => (
                <tr key={rev._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition align-top">
                  <td className="p-4">
                    <div className="font-bold text-blue-600 mb-1">{rev.productId?.name || "منتج عام"}</div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <User size={12} /> {rev.userId?.username || "عميل"}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center text-yellow-400 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-gray-800 font-medium mb-2">{rev.comment}</div>
                    {rev.reply ? (
                      <div className="bg-blue-50 text-blue-800 p-2 rounded-lg text-xs flex gap-2 items-start border-r-2 border-blue-400">
                        <CornerDownLeft size={14} className="mt-0.5 shrink-0" />
                        <div><span className="font-bold block mb-0.5">رد المتجر:</span>{rev.reply}</div>
                      </div>
                    ) : (
                      <div className="text-gray-300 text-[10px] italic font-bold">لا يوجد رد حالياً</div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${rev.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {rev.enabled ? "نشط" : "مخفي"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-4 justify-center items-center">
                      <ActionButton onClick={() => handleReply(rev._id, rev.reply)} icon={<MessageSquare size={16}/>} label={rev.reply ? "تعديل" : "رد"} color="text-blue-500" />
                      <ActionButton onClick={() => handleToggle(rev._id, rev.enabled)} icon={rev.enabled ? <EyeOff size={16}/> : <Eye size={16}/>} label={rev.enabled ? "إخفاء" : "إظهار"} color={rev.enabled ? "text-orange-500" : "text-green-600"} />
                      <ActionButton onClick={() => handleDelete(rev._id)} icon={<Trash2 size={16}/>} label="حذف" color="text-red-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-blue-600">{rev.productId?.name || "منتج عام"}</div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                      <User size={12} /> {rev.userId?.username || "عميل"}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${rev.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {rev.enabled ? "نشط" : "مخفي"}
                  </span>
                </div>

                <div className="flex text-yellow-400 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                  ))}
                </div>

                <div className="text-gray-800 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {rev.comment}
                </div>

                {rev.reply && (
                   <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs flex gap-2 items-start border-r-2 border-blue-400">
                    <CornerDownLeft size={14} className="mt-0.5 shrink-0" />
                    <div><span className="font-bold block mb-0.5">رد المتجر:</span>{rev.reply}</div>
                  </div>
                )}

                {/* Actions Bottom Bar for Mobile */}
                <div className="flex justify-center gap-8 items-center pt-2 border-t border-gray-50">
                  <ActionButton onClick={() => handleReply(rev._id, rev.reply)} icon={<MessageSquare size={18}/>} label={rev.reply ? "تعديل" : "رد"} color="text-blue-500" />
                  <ActionButton onClick={() => handleToggle(rev._id, rev.enabled)} icon={rev.enabled ? <EyeOff size={18}/> : <Eye size={18}/>} label={rev.enabled ? "إخفاء" : "إظهار"} color={rev.enabled ? "text-orange-500" : "text-green-600"} />
                  <ActionButton onClick={() => handleDelete(rev._id)} icon={<Trash2 size={18}/>} label="حذف" color="text-red-400" />
                </div>
              </div>
            ))}
          </div>

          {reviews.length === 0 && <div className="p-10 text-center text-gray-400 font-bold">لا توجد مراجعات حالياً.</div>}
        </div>
      </div>
    </div>
  );
};

// Component Helper for buttons to keep code clean
const ActionButton = ({ onClick, icon, label, color }) => (
  <button onClick={onClick} className={`${color} hover:opacity-70 flex flex-col items-center gap-1 transition-all active:scale-95`}>
    {icon}
    <span className="text-[10px] font-extrabold uppercase tracking-tighter">{label}</span>
  </button>
);

export default AdminReviews;
