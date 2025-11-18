import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface HeroContent {
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
  avatar1_url?: string;
  avatar2_url?: string;
  main_display_image_url?: string;
  button_text?: string;
  button_url?: string;
  chat_bubble1_name?: string;
  chat_bubble1_time?: string;
  chat_bubble1_message?: string;
  chat_bubble2_name?: string;
  chat_bubble2_time?: string;
  chat_bubble2_message?: string;
}

const HeroSection = () => {
  const [content, setContent] = useState<HeroContent>({
    title: '創意行銷 讓你被看見',
    subtitle: '讓企業擁有更完整的行銷團隊',
    content: '光速執行力 • 一條龍服務 • 誠信負責任',
    description: '我們致力於為企業提供全方位的數位行銷解決方案，從品牌策略到執行落地，一站式服務讓您的品牌在市場中脫穎而出。',
    background_color: 'from-teal-400 via-cyan-300 to-blue-400',
    text_color: 'text-white',
    text_size: 'text-5xl lg:text-7xl',
    text_shadow: 'drop-shadow-lg',
    button_text: '預約行銷健診',
    button_url: '#contact',
    chat_bubble1_name: '行銷主管Clara',
    chat_bubble1_time: '7AM',
    chat_bubble1_message: '公司內部行銷人力不足',
    chat_bubble2_name: '十三洋行',
    chat_bubble2_time: '9AM',
    chat_bubble2_message: '沒問題!我們可以提供整合解決方案'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'hero')
        .single();

      if (error) {
        console.error('Error fetching hero content:', error);
        return;
      }

      if (data) {
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
          avatar1_url: data.avatar1_url,
          avatar2_url: data.avatar2_url,
          main_display_image_url: data.main_display_image_url,
          button_text: data.button_text || content.button_text,
          button_url: data.button_url || content.button_url,
          chat_bubble1_name: data.chat_bubble1_name || content.chat_bubble1_name,
          chat_bubble1_time: data.chat_bubble1_time || content.chat_bubble1_time,
          chat_bubble1_message: data.chat_bubble1_message || content.chat_bubble1_message,
          chat_bubble2_name: data.chat_bubble2_name || content.chat_bubble2_name,
          chat_bubble2_time: data.chat_bubble2_time || content.chat_bubble2_time,
          chat_bubble2_message: data.chat_bubble2_message || content.chat_bubble2_message
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 判斷背景顏色是否為漸層
  const isGradient = content.background_color.includes('from-') || content.background_color.includes('gradient');
  
  // 判斷文字顏色是否為 Tailwind 類別
  const isTextClass = content.text_color.startsWith('text-');

  // 預設背景圖片
  const defaultBackgroundImage = 'https://readdy.ai/api/search-image?query=modern%20digital%20marketing%20workspace%20with%20creative%20team%20collaboration%2C%20bright%20professional%20office%20environment%20with%20computers%20and%20marketing%20materials%2C%20vibrant%20teal%20and%20blue%20color%20scheme%2C%20clean%20minimalist%20design%2C%20high%20quality%20business%20photography%2C%20energetic%20atmosphere%2C%20natural%20lighting%20from%20large%20windows&width=1920&height=1080&seq=hero-bg&orientation=landscape';

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${content.image_url || defaultBackgroundImage}')`
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/80 to-blue-500/60"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={isTextClass ? content.text_color : ''}
            style={!isTextClass ? { color: content.text_color } : {}}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`${content.text_size} font-bold mb-6 leading-tight ${content.text_shadow}`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {content.title.includes('行銷您品牌') ? (
                <>
                  {content.title.split('行銷您品牌')[0]}
                  <span className="text-yellow-300">行銷您品牌</span>
                </>
              ) : (
                content.title
              )}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              {content.content.split(' • ').map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <i className={`${index === 0 ? 'ri-flash-line' : index === 1 ? 'ri-team-line' : 'ri-shield-check-line'} text-yellow-300 text-xl`}></i>
                  <span className="text-lg font-semibold">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl lg:text-2xl mb-8 leading-relaxed"
            >
              {content.subtitle}
            </motion.p>

            {content.description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-lg mb-8 leading-relaxed opacity-90"
              >
                {content.description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {content.button_text && content.button_url && (
                <a
                  href={content.button_url}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
                >
                  {content.button_text}
                </a>
              )}
              <a
                href="#services"
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm whitespace-nowrap cursor-pointer"
              >
                查看專屬服務
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={content.main_display_image_url || content.secondary_image_url || "https://www.13media.com.tw/wp-content/uploads/2025/05/十三洋行Banner-電腦.png"}
                alt="十三洋行行銷服務展示"
                className="w-full max-w-2xl mx-auto"
              />
              
              {/* Floating Chat Bubbles */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute top-16 left-8 bg-white rounded-2xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={content.avatar1_url || "https://readdy.ai/api/search-image?query=professional%20asian%20female%20marketing%20manager%20headshot%2C%20clean%20business%20portrait%2C%20friendly%20smile%2C%20modern%20office%20background%2C%20high%20quality%20corporate%20photography%2C%20professional%20lighting&width=100&height=100&seq=avatar1&orientation=squarish"}
                    alt={content.chat_bubble1_name || "行銷主管"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{content.chat_bubble1_name || '行銷主管Clara'}</p>
                    <p className="text-sm text-gray-600">{content.chat_bubble1_time || '7AM'}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{content.chat_bubble1_message || '公司內部行銷人力不足'}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="absolute bottom-16 right-8 bg-teal-500 text-white rounded-2xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={content.avatar2_url || "https://readdy.ai/api/search-image?query=professional%20asian%20male%20business%20consultant%20headshot%2C%20confident%20expression%2C%20modern%20corporate%20portrait%2C%20clean%20background%2C%20high%20quality%20business%20photography%2C%20professional%20attire&width=100&height=100&seq=avatar2&orientation=squarish"}
                    alt={content.chat_bubble2_name || "十三洋行"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{content.chat_bubble2_name || '十三洋行'}</p>
                    <p className="text-sm opacity-90">{content.chat_bubble2_time || '9AM'}</p>
                  </div>
                </div>
                <p className="text-sm">{content.chat_bubble2_message || '沒問題!我們可以提供整合解決方案'}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white text-center cursor-pointer"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <i className="ri-arrow-down-line text-2xl"></i>
          <p className="text-sm mt-2">向下滾動</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
