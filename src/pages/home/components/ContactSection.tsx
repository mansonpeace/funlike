import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';

interface ContactContent {
  title: string;
  subtitle: string;
  content: string;
  description: string;
  background_color: string;
  text_color: string;
  text_size: string;
  text_shadow: string;
  image_url?: string;
  secondary_image_url?: string;
  button_text?: string;
  button_url?: string;
}

interface ContactInfo {
  contact_address?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_facebook_url?: string;
  contact_instagram_url?: string;
  contact_line_url?: string;
  contact_map_embed_url?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_class: string;
  display_order: number;
  is_active: boolean;
}

const ContactSection = () => {
  const [content, setContent] = useState<ContactContent>({
    title: '聯絡我們',
    subtitle: '預約企業行銷健檢',
    content: '專業團隊為您提供免費諮詢服務',
    description: '',
    background_color: 'from-gray-900 to-gray-800',
    text_color: 'text-white',
    text_size: 'text-3xl',
    text_shadow: '',
    button_text: '送出訊息',
    button_url: ''
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    contact_address: '220 新北市板橋區文化路二段331號6樓',
    contact_phone: '02-8252-0008',
    contact_email: 'service@13ocean.com',
    contact_facebook_url: 'https://www.facebook.com/@thirteenocean/',
    contact_instagram_url: 'https://www.instagram.com/13___ocean/',
    contact_line_url: '',
    contact_map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.109954235097!2d121.46976797605772!3d25.030342338437578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a958dab423df%3A0x5289615bc9e4b71b!2z5Y2B5LiJ5rSL6KGM5pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1740538374304!5m2!1szh-TW!2stw'
  });

  // 新增服務項目狀態
  const [serviceOptions, setServiceOptions] = useState<ServiceItem[]>([]);

  // 強制重新渲染的狀態
  const [forceRender, setForceRender] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 載入服務項目
  const loadServiceOptions = useCallback(async () => {
    try {
      console.log('🔄 載入服務項目選項...');
      
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ 載入服務項目失敗:', error);
        return;
      }

      if (data) {
        console.log('✅ 服務項目載入成功:', data);
        setServiceOptions(data);
      }
    } catch (error) {
      console.error('💥 載入服務項目時發生錯誤:', error);
    }
  }, []);

  // 載入聯絡資訊 - 修復版
  const loadContactInfo = useCallback(async () => {
    try {
      console.log('🔄 [修復版] 開始載入聯絡資訊...');
      
      const { data, error } = await supabase
        .from('website_settings')
        .select('contact_address, contact_phone, contact_email, contact_facebook_url, contact_instagram_url, contact_line_url, contact_map_embed_url')
        .limit(1)
        .single();

      if (error) {
        console.error('❌ [修復版] 載入聯絡資訊失敗:', error);
        return;
      }

      if (data) {
        console.log('✅ [修復版] 聯絡資訊載入成功:', data);
        
        const newContactInfo = {
          contact_address: data.contact_address || '220 新北市板橋區文化路二段331號6樓',
          contact_phone: data.contact_phone || '02-8252-0008',
          contact_email: data.contact_email || 'service@13ocean.com',
          contact_facebook_url: data.contact_facebook_url || 'https://www.facebook.com/@thirteenocean/',
          contact_instagram_url: data.contact_instagram_url || 'https://www.instagram.com/13___ocean/',
          contact_line_url: data.contact_line_url || '',
          contact_map_embed_url: data.contact_map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.109954235097!2d121.46976797605772!3d25.030342338437578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a958dab423df%3A0x5289615bc9e4b71b!2z5Y2B5LiJ5rSL6KGM5pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1740538374304!5m2!1szh-TW!2stw'
        };
        
        console.log('🎯 [修復版] 準備更新聯絡資訊狀態:', newContactInfo);
        
        // 使用函數式更新確保狀態正確設定
        setContactInfo(prevInfo => {
          console.log('📊 [修復版] 舊聯絡資訊:', prevInfo);
          console.log('📊 [修復版] 新聯絡資訊:', newContactInfo);
          return newContactInfo;
        });
        
        // 更新時間戳記
        const now = Date.now();
        setLastUpdate(now);
        
        // 強制重新渲染
        setForceRender(prev => {
          const newValue = prev + 1;
          console.log('🔄 [修復版] 強制重新渲染:', newValue);
          return newValue;
        });
        
        console.log('✅ [修復版] 聯絡資訊更新完成，時間戳記:', now);
      }
    } catch (error) {
      console.error('💥 [修復版] 載入聯絡資訊時發生錯誤:', error);
    }
  }, []);

  // 載入內容的函數
  const loadContent = useCallback(async () => {
    try {
      console.log('📥 [修復版] 正在載入聯絡內容...');
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'contact')
        .single();

      if (error) {
        console.error('❌ [修復版] 載入聯絡內容失敗:', error);
        return;
      }

      if (data) {
        console.log('✅ [修復版] 聯絡內容載入成功:', data);
        setContent({
          title: data.title || content.title,
          subtitle: data.subtitle || content.subtitle,
          content: data.content || content.content,
          description: data.description || content.description,
          background_color: data.background_color || content.background_color,
          text_color: data.text_color || content.text_color,
          text_size: data.text_size || content.text_size,
          text_shadow: data.text_shadow || content.text_shadow,
          image_url: data.image_url,
          secondary_image_url: data.secondary_image_url,
          button_text: data.button_text || content.button_text,
          button_url: data.button_url || content.button_url
        });
      }
    } catch (error) {
      console.error('💥 [修復版] 載入聯絡內容時發生錯誤:', error);
    }
  }, [content.title, content.subtitle, content.content, content.description, content.background_color, content.text_color, content.text_size, content.text_shadow, content.button_text, content.button_url]);

  useEffect(() => {
    console.log('🚀 [修復版] 元件初始化');
    
    // 初始載入
    loadContent();
    loadContactInfo();
    loadServiceOptions(); // 新增：載入服務項目

    // 設定即時訂閱 - 修復版本
    console.log('🔗 [修復版] 設定即時訂閱...');
    
    const channel = supabase
      .channel(`contact_realtime_fixed_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_settings'
        },
        async (payload) => {
          console.log('📡 [修復版] website_settings 資料庫變更偵測到:', payload);
          console.log('📡 [修復版] 事件類型:', payload.eventType);
          console.log('📡 [修復版] 變更資料:', payload.new);
          
          // 立即重新載入
          console.log('🔄 [修復版] 立即重新載入聯絡資訊...');
          await loadContactInfo();
          
          // 延遲重新載入確保資料同步
          setTimeout(async () => {
            console.log('🔄 [修復版] 延遲重新載入聯絡資訊...');
            await loadContactInfo();
          }, 1000);
          
          // 額外的強制更新
          setTimeout(() => {
            console.log('🔄 [修復版] 額外強制更新...');
            setForceRender(prev => prev + 1);
            setLastUpdate(Date.now());
          }, 1500);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'website_content',
          filter: 'section=eq.contact'
        },
        async (payload) => {
          console.log('📡 [修復版] website_content 聯絡內容資料庫變更:', payload);
          await loadContent();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_items'
        },
        async (payload) => {
          console.log('📡 [修復版] service_items 服務項目資料庫變更:', payload);
          await loadServiceOptions();
        }
      )
      .on(
        'broadcast', 
        { event: 'contact_info_updated' }, 
        async (payload) => {
          console.log('📡 [修復版] 收到聯絡資訊更新廣播:', payload);
          
          // 立即重新載入
          await loadContactInfo();
          
          // 延遲重新載入確保資料同步
          setTimeout(async () => {
            console.log('⏰ [修復版] 延遲重新載入聯絡資訊');
            await loadContactInfo();
          }, 1000);
          
          // 強制更新顯示
          setTimeout(() => {
            console.log('🔄 [修復版] 強制更新聯絡資訊顯示');
            setForceRender(prev => prev + 1);
            setLastUpdate(Date.now());
          }, 1500);
        }
      )
      .subscribe((status) => {
        console.log('📡 [修復版] 訂閱狀態:', status);
      });

    // 清理函數
    return () => {
      console.log('🧹 [修復版] 清理即時訂閱');
      channel.unsubscribe();
    };
  }, [loadContactInfo, loadContent, loadServiceOptions]);

  // 判斷背景顏色是否為漸層
  const isGradient = content.background_color.includes('from-') || content.background_color.includes('gradient');
  
  // 判斷文字顏色是否為 Tailwind 類別
  const isTextClass = content.text_color.startsWith('text-');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 模擬表單提交
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        services: [],
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 生成唯一的 key 確保重新渲染
  const uniqueKey = `contact-fixed-${forceRender}-${lastUpdate}`;
  
  console.log('🎨 [修復版] 渲染中...');
  console.log('📊 [修復版] forceRender:', forceRender);
  console.log('📊 [修復版] lastUpdate:', lastUpdate);
  console.log('📊 [修復版] uniqueKey:', uniqueKey);
  console.log('📍 [修復版] 當前聯絡資訊:', contactInfo);
  console.log('🛠️ [修復版] 當前服務選項:', serviceOptions);

  return (
    <section id="contact" className="py-20 bg-white" key={uniqueKey}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div 
              className="h-96 rounded-2xl bg-cover bg-center relative"
              style={{
                backgroundImage: `url('${content.image_url || "https://readdy.ai/api/search-image?query=modern%20marketing%20office%20building%20exterior%20at%20night%20with%20professional%20lighting%2C%20corporate%20headquarters%2C%20business%20district%2C%20contemporary%20architecture%20with%20glass%20facade&width=600&height=400&seq=office-building&orientation=landscape"}')`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold mb-2">{content.subtitle}</h3>
                <p className="text-gray-200">{content.content}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
          >
            <h3 className={`${content.text_size} font-bold mb-8 text-center ${content.text_shadow}`}>
              {content.title}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="你的名稱(必填)"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 transition-colors duration-300"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="聯絡電話(必填)"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="聯絡Email(必填)"
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 transition-colors duration-300"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="公司名稱"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 transition-colors duration-300"
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="填寫產業及網址或簡述需求"
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-teal-400 transition-colors duration-300 resize-none"
                />
                <div className="text-right text-sm text-gray-300 mt-1">
                  {formData.message.length}/500
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-4">
                  所需服務(可複選) <span className="text-red-400">*</span>
                </label>
                {serviceOptions.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {serviceOptions.map((service) => (
                      <label key={service.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.title)}
                          onChange={() => handleServiceChange(service.title)}
                          className="w-4 h-4 text-teal-500 bg-white/20 border-white/30 rounded focus:ring-teal-400"
                        />
                        <span className="text-sm">{service.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-300">
                    <i className="ri-loader-4-line animate-spin text-xl mb-2"></i>
                    <p className="text-sm">載入服務選項中...</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || formData.services.length === 0}
                  className="bg-teal-500 hover:bg-teal-600 disabled:bg-gray-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 whitespace-nowrap cursor-pointer"
                >
                  {isSubmitting ? '傳送中...' : content.button_text}
                </button>
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-green-400 font-semibold"
                >
                  訊息已成功送出！我們將盡快與您聯繫。
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-400 font-semibold"
                >
                  送出失敗，請稍後再試。
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Contact Info - 修復版的即時更新區塊 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
          key={`contact-info-section-${uniqueKey}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map - 修復版：完全重新載入 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <iframe
                key={`map-iframe-fixed-${forceRender}-${lastUpdate}-${contactInfo.contact_map_embed_url?.slice(-10)}`}
                src={contactInfo.contact_map_embed_url}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>

            {/* Contact Details - 修復版：強制重新渲染所有內容 */}
            <div className="space-y-8" key={`contact-details-fixed-${uniqueKey}`}>
              <div>
                <h4 className="text-2xl font-bold mb-6 text-gray-900">聯絡資訊</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4" key={`address-fixed-${forceRender}-${lastUpdate}`}>
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                      <i className="ri-map-pin-line text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">地址</p>
                      <p className="text-gray-800">
                        {contactInfo.contact_address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4" key={`phone-fixed-${forceRender}-${lastUpdate}`}>
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="ri-phone-line text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">電話</p>
                      <a 
                        href={`tel:${contactInfo.contact_phone}`} 
                        className="text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        {contactInfo.contact_phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4" key={`email-fixed-${forceRender}-${lastUpdate}`}>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <i className="ri-mail-line text-xl text-white"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a 
                        href={`mailto:${contactInfo.contact_email}`} 
                        className="text-gray-800 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        {contactInfo.contact_email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div key={`social-fixed-${forceRender}-${lastUpdate}`}>
                <h5 className="text-lg font-semibold mb-4 text-gray-900">社群媒體</h5>
                <div className="flex gap-4">
                  {contactInfo.contact_facebook_url && (
                    <a
                      href={contactInfo.contact_facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <i className="ri-facebook-fill text-xl text-white"></i>
                    </a>
                  )}
                  {contactInfo.contact_instagram_url && (
                    <a
                      href={contactInfo.contact_instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer"
                    >
                      <i className="ri-instagram-line text-xl text-white"></i>
                    </a>
                  )}
                  {contactInfo.contact_line_url && (
                    <a
                      href={contactInfo.contact_line_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer"
                    >
                      <span className="text-white font-bold text-sm">LINE</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
