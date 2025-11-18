import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    logo_image_url: '',
    logo_text: '瘋來客',
    logo_subtitle: '讓品牌被看見',
    logo_size: 'w-12 h-12',
    header_height: 'py-4'
  });

  useEffect(() => {
    document.title = `網站後台管理 - 瘋來客`;
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('website_settings').select('*').single();
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setSettings({
        logo_image_url: data.logo_image_url,
        logo_text: data.logo_text || '瘋來客',
        logo_subtitle: data.logo_subtitle || '讓品牌被看見',
        logo_size: data.logo_size || 'w-12 h-12',
        header_height: data.header_height || 'py-4'
      });
    }
    setLoading(false);
  };

  const updateSettings = async () => {
    const { error } = await supabase
      .from('website_settings')
      .update(settings)
      .eq('id', 1);

    if (error) console.error(error);
    else alert('網站設定已更新！');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">網站 LOGO 與 Header 設定（瘋來客）</h1>

      {/* Logo 圖片上傳 */}
      <div className="mb-6">
        <label className="font-semibold">Logo 圖片網址（自動上傳後會更新）</label>
        <input
          type="text"
          value={settings.logo_image_url || ''}
          onChange={(e) => setSettings({ ...settings, logo_image_url: e.target.value })}
          placeholder="例如：https://yourdomain.com/logo.png"
          className="w-full p-3 mt-2 border rounded"
        />
        {settings.logo_image_url && (
          <img
            src={settings.logo_image_url}
            alt="瘋來客頭貼"
            className="w-20 h-20 mt-4 object-contain border rounded"
          />
        )}
      </div>

      {/* Logo 文字 */}
      <div className="mb-6">
        <label className="font-semibold">Logo 文字（主標）</label>
        <input
          type="text"
          value={settings.logo_text}
          onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
          placeholder="例如：瘋來客"
          className="w-full p-3 mt-2 border rounded"
        />
      </div>

      {/* Logo 副標 */}
      <div className="mb-6">
        <label className="font-semibold">Logo 副標</label>
        <input
          type="text"
          value={settings.logo_subtitle}
          onChange={(e) => setSettings({ ...settings, logo_subtitle: e.target.value })}
          placeholder="例如：讓品牌被看見"
          className="w-full p-3 mt-2 border rounded"
        />
      </div>

      {/* Logo 圖示大小 */}
      <div className="mb-6">
        <label className="font-semibold">Logo 大小（Tailwind class）</label>
        <input
          type="text"
          value={settings.logo_size}
          onChange={(e) => setSettings({ ...settings, logo_size: e.target.value })}
          placeholder="例如：w-12 h-12"
          className="w-full p-3 mt-2 border rounded"
        />
      </div>

      {/* Header 高度 */}
      <div className="mb-6">
        <label className="font-semibold">Header 高度</label>
        <input
          type="text"
          value={settings.header_height}
          onChange={(e) => setSettings({ ...settings, header_height: e.target.value })}
          placeholder="例如：py-4"
          className="w-full p-3 mt-2 border rounded"
        />
      </div>

      {/* Submit */}
      <button
        onClick={updateSettings}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
      >
        儲存設定
      </button>
    </div>
  );
}
