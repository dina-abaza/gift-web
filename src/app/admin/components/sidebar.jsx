"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tags,
  PackageSearch,
  Share2,
  LogOut,
  X,
  Package,
  MessageSquareQuote
} from "lucide-react";
import { useAdminAuthStore } from "../store/useAdminAuthStore";

export default function AdminSidebar({ disabled, isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { adminLogout } = useAdminAuthStore();

  const navLinks = [
    { name: "الرئيسية", href: "/admin", icon: LayoutDashboard, color: "#ef4444" },
    { name: "الأقسام", href: "/admin/categories", icon: Tags, color: "#22c55e" },
    { name: "المنتجات", href: "/admin/products", icon: PackageSearch, color: "#3b82f6" },
    { name: "الطلبات", href: "/admin/orders", icon: Package, color: "#f97316" },
    { name: "المراجعات", href: "/admin/reviews", icon: MessageSquareQuote, color: "#ec4899" },
    { name: "السوشيال", href: "/admin/social", icon: Share2, color: "#a855f7" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 ltr:left-0 rtl:right-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 p-6 flex flex-col transform ${
        isOpen ? 'ltr:translate-x-0 rtl:translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full'
      } md:ltr:translate-x-0 md:rtl:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      {/* زر الإغلاق (X) بدون خلفية */}
      <button
        onClick={() => setIsOpen(false)}
        className="md:hidden absolute top-4 ltr:right-4 rtl:left-4 p-2 bg-transparent text-gray-800 dark:text-gray-200 border-none outline-none"
      >
        <X size={30} />
      </button>

      {/* روابط التنقل مع إزاحة علوية لعدم التداخل مع زر الإغلاق */}
      <nav className="flex flex-col gap-3 mt-14">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (disabled) {
            return (
              <div key={link.href} className="flex items-center gap-3 p-2.5 rounded-xl text-gray-400 opacity-50 cursor-not-allowed">
                <Icon size={20} style={{ color: "#cbd5e1" }} />
                <span>{link.name}</span>
              </div>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-gray-800 dark:text-gray-200 no-underline transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                isActive ? "bg-gray-100 dark:bg-gray-700 text-red-600 font-bold" : ""
              }`}
            >
              <Icon size={20} style={{ color: link.color }} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* زر تسجيل الخروج */}
      {!disabled && (
        <button 
          className="mt-auto bg-red-500 text-white border-none p-3 rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-red-600 transition-colors" 
          onClick={() => {
            setIsOpen(false);
            adminLogout();
          }}
        >
          <LogOut size={18} />
          تسجيل خروج
        </button>
      )}
    </aside>
  );
}
