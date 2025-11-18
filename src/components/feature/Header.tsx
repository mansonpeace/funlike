import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface WebsiteSettings {
  logo_image_url?: string;
  logo_text?: string;
  logo_subtitle?: string;
  logo_size?: string;
  header_height?: string; // 新增導航列高度欄位
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings>({
    logo_text: '十三洋行',
    logo_subtitle: '共享廚房',
    logo_size: 'w-12 h-12',
    header_height: 'py-4' // 預設高度
  });

  useEffect(() => {
    fetchSettings();

    // 訂閱 website_settings 資料表的即時更新
    const channel = supabase
      .channel('website_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_settings'
        },
        (payload) => {
          console.log('LOGO 設定已更新:', payload);
          // 當資料更新時，重新讀取設定
          fetchSettings();
        }
      )
      .subscribe();

    // 清理訂閱
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }

      if (data) {
        console.log('讀取到的 LOGO 設定:', data);
        setSettings({
          logo_image_url: data.logo_image_url,
          logo_text: data.logo_text || settings.logo_text,
          logo_subtitle: data.logo_subtitle || settings.logo_subtitle,
          logo_size: data.logo_size || 'w-12 h-12',
          header_height: data.header_height || 'py-4' // 讀取導航列高度設定
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 簡單的滾動函數
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false); // 關閉手機選單
  };

  // 導航項目
  const navItems = [
    { name: '首頁', id: 'hero' },
    { name: '關於我們', id: 'about' },
    { name: '服務項目', id: 'services' },
    { name: '團隊介紹', id: 'team' },
    { name: '聯絡我們', id: 'contact' }
  ];

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg fixed w-full top-0 z-50">
      <div className={`container mx-auto px-4 ${settings.header_height || 'py-4'}`}>
        <div className="flex items-center justify-between">
          {/* Logo區域 */}
          <div className="flex items-center space-x-3">
            {settings.logo_image_url ? (
              <img 
                src={settings.logo_image_url} 
                alt={settings.logo_text || 'Logo'} 
                className={`${settings.logo_size || 'w-12 h-12'} object-contain`}
                key={settings.logo_image_url}
              />
            ) : (
              <div className={`${settings.logo_size || 'w-12 h-12'} bg-black rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">13</span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{settings.logo_text}</h1>
              {settings.logo_subtitle && (
                <p className="text-sm opacity-90">{settings.logo_subtitle}</p>
              )}
            </div>
          </div>

          {/* 桌面版導航選單 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-blue-200 transition-colors duration-200 font-medium cursor-pointer"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* 免費諮詢按鈕 */}
          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full font-medium transition-colors duration-200 text-white cursor-pointer"
          >
            免費諮詢
          </button>

          {/* 手機選單按鈕 */}
          <button 
            className="md:hidden text-white cursor-pointer" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
          </button>
        </div>

        {/* 手機版導航選單 */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white border-opacity-30">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-blue-200 transition-colors duration-200 py-2 text-left cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}