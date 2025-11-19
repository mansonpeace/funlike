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
    // ⭐ 全新預設文案（不含十三洋行）
    title: '你值得被看見',
    subtitle: '讓您專心做生意，我們來幫您行銷',
    content: '整合行銷策略 • 精準廣告投放 • 品牌形象優化',
    description:
      '瘋來客專注於協助中小企業與個人品牌，從行銷診斷、策略規劃到廣告與內容執行，提供一條龍的數位行銷服務，讓您的品牌穩定被看見、持續帶來客源。',
    background_color: 'from-teal-400 via-cyan-300 to-blue-400',
    text_color: 'text-white',
    text_size: 'text-5xl lg:text-7xl',
    text_shadow: 'drop-shadow-lg',
    button_text: '預約行銷健診',
    button_url: '#contact',

    chat_bubble1_name: '顧客 A',
    chat_bubble1_time: '8AM',
    chat_bubble1_message: '我有行銷上的問題，想增加客源',

    chat_bubble2_name: '瘋來客顧問',
    chat_bubble2_time: '8:05AM',
    chat_bubble2_message: '了解！我們可以一起規劃適合你的行銷方案'
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
          chat_bubble1_message:
            data.chat_bubble1_message || content.chat_bubble1_message,

          chat_bubble2_name: data.chat_bubble2_name || content.chat_bubble2_name,
          chat_bubble2_time: data.chat_bubble2_time || content.chat_bubble2_time,
          chat_bubble2_message:
            data.chat_bubble2_message || content.chat_bubble2_message
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isGradient =
    content.background_color.includes('from-') ||
    content.background_color.includes('gradient');

  const isTextClass = content.text_color.startsWith('text-');

  const defaultBackgroundImage =
    'https://readdy.ai/api/search-image?query=modern%20digital%20marketing%20workspace%20creative%20office%20environment&width=1600&height=900&seq=hero-bg&orientation=landscape';

  const defaultMainDisplay =
    'https://readdy.ai/api/search-image?query=digital%20marketing%20analytics%20dashboard%20ui%20on%20laptop&width=1200&height=700&seq=laptop&orientation=landscape';

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* 背景大圖 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${content.image_url || defaultBackgroundImage}')`
        }}
      ></div>

      {/* 顏色漸層罩層 */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/80 to-blue-500/60"></div>

      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* 左側文字區 */}
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
              transition={{ duration: 0.8 }}
              className={`${content.text_size} font-bold mb-6 leading-tight ${content.text_shadow}`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {content.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-4 mb-8 flex-wrap"
            >
              {content.content.split(' • ').map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <i
                    className={`${
                      index === 0
                        ? 'ri-flash-line'
                        : index === 1
                        ? 'ri-bullseye-line'
                        : 'ri-shield-check-line'
                    } text-yellow-300 text-xl`}
                  ></i>
                  <span className="text-lg font-semibold">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xl lg:text-2xl mb-8 leading-relaxed"
            >
              {content.subtitle}
            </motion.p>

            {content.description && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg mb-8 leading-relaxed opacity-90"
              >
                {content.description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {content.button_text && (
                <a
                  href={content.button_url}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {content.button_text}
                </a>
              )}

              <a
                href="#services"
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                查看專屬服務
              </a>
            </motion.div>
          </motion.div>

          {/* 右側圖片 + 對話泡泡 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={
                  content.main_display_image_url ||
                  content.secondary_image_url ||
                  defaultMainDisplay
                }
                alt="行銷示意圖"
                className="w-full max-w-2xl mx-auto rounded-xl shadow-xl"
              />

              {/* 對話泡泡 1 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute top-16 left-8 bg-white rounded-2xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      content.avatar1_url ||
                      'https://readdy.ai/api/search-image?query=business%20woman%20portrait&width=200&height=200'
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {content.chat_bubble1_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {content.chat_bubble1_time}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">
                  {content.chat_bubble1_message}
                </p>
              </motion.div>

              {/* 對話泡泡 2 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="absolute bottom-16 right-8 bg-teal-500 text-white rounded-2xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={
                      content.avatar2_url ||
                      'https://readdy.ai/api/search-image?query=business%20man%20portrait&width=200&height=200'
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {content.chat_bubble2_name}
                    </p>
                    <p className="text-sm">{content.chat_bubble2_time}</p>
                  </div>
                </div>
                <p className="text-sm">
                  {content.chat_bubble2_message}
                </p>
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
          onClick={() =>
            document
              .getElementById('about')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <i className="ri-arrow-down-line text-2xl"></i>
          <p className="text-sm mt-2">向下滾動</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
