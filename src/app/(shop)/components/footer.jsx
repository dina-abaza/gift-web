 "use client";
import React, { useEffect, useState } from 'react';
import { Facebook, MessageCircle, Instagram, Video, Phone, Mail } from 'lucide-react';
import api from "@/app/api";

const Footer = () => {
  const [settings, setSettings] = useState({
    footerText: "",
    contactEmail: "",
    phone: "",
    facebookLink: "",
    instagramLink: "",
    whatsappLink: "",
    tiktokLink: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setSettings(res.data || {});
      } catch (e) {
        // تجاهل الخطأ وإظهار قيم افتراضية
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#f2f2f2] border-t border-gray-200 pt-10 pb-6 mt-10" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* الجزء العلوي: مقسم لأعمدة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-center md:text-right">
          
          {/* العمود الأول: تواصل معنا */}
          <div>
            <h3 className="text-lg font-bold text-[#8a8a8a] mb-4">تواصل معنا</h3>
            <div className="flex flex-col gap-3 items-center md:items-start">
              {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-[#8a8a8a] hover:text-red-600 transition" dir="ltr">
                <Phone size={18} />
                <span>{settings.phone}</span>
              </a>
              )}
              {settings.contactEmail && (
              <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-2 text-[#8a8a8a] hover:text-red-600 transition">
                <Mail size={18} />
                <span>{settings.contactEmail}</span>
              </a>
              )}
            </div>
          </div>

          {/* العمود الثاني: السوشيال ميديا */}
          <div>
            <h3 className="text-lg font-bold text-[#8a8a8a] mb-4">تابعنا على</h3>
            <div className="flex justify-center md:justify-start gap-5">
              {/* فيسبوك */}
              {settings.facebookLink && (
                <a href={settings.facebookLink} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full shadow-sm text-[#8a8a8a] hover:text-[#1877F2] transition">
                  <Facebook size={22} />
                </a>
              )}
              {/* واتساب */}
              {settings.whatsappLink && (
                <a href={settings.whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full shadow-sm text-[#8a8a8a] hover:text-[#25D366] transition">
                  <MessageCircle size={22} />
                </a>
              )}
              {/* تيك توك */}
              {settings.tiktokLink && (
                <a href={settings.tiktokLink} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full shadow-sm text-[#8a8a8a] hover:text-black transition">
                  <Video size={22} /> 
                </a>
              )}
              {/* انستجرام */}
              {settings.instagramLink && (
                <a href={settings.instagramLink} target="_blank" rel="noopener noreferrer" className="bg-white p-2 rounded-full shadow-sm text-[#8a8a8a] hover:text-[#E4405F] transition">
                  <Instagram size={22} />
                </a>
              )}
            </div>
          </div>

          {/* العمود الثالث: عن المتجر */}
          <div>
            <h3 className="text-lg font-bold text-[#8a8a8a] mb-4">عن المتجر</h3>
            <p className="text-[#8a8a8a] text-sm leading-relaxed">
              نوفر لك افضل انواع الهدايا رجالي ونسائي اختر هديتك معنا من الالف للياء وتوصيل لحد باب بيتك
            </p>
          </div>
        </div>

        {/* الخط الفاصل السفلي */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* الجزء السفلي: حقوق النشر */}
        <div className="text-center text-[#8a8a8a] text-sm font-medium">
          <p>{settings.footerText || `© ${new Date().getFullYear()} جميع الحقوق محفوظة لمتجرنا`}</p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
