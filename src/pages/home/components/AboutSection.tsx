import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface AboutContent {
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
  // 新增的欄位
  feature1_title?: string;
  feature1_image_url?: string;
  feature1_hover_image_url?: string;
  feature2_title?: string;
  feature2_image_url?: string;
  feature2_hover_image_url?: string;
  feature3_title?: string;
  feature3_image_url?: string;
  feature3_hover_image_url?: string;
  section2_title?: string;
  section2_subtitle?: string;
  section2_content?: string;
  section2_description?: string;
  section3_title?: string;
  section3_content?: string;
  section3_button_text?: string;
  section3_button_url?: string;
  benefit1_title?: string;
  benefit2_title?: string;
  benefit3_title?: string;
}

const AboutSection = () => {
  const [content, setContent] = useState<AboutContent>({
    // ===== 這一段是「預設文案」：全部改成瘋來客版 =====
    title: '你值得被看見',
    subtitle: '讓您專心做生意，我們來幫你行銷',
    content: '在這個什麼都可以被搜尋的年代，品牌如果不被看見，就等於不存在。',
    description:
      '瘋來客是一群長期協助中小企業成長的數位行銷夥伴。我們擅長用簡單好懂的方式，把複雜的行銷策略拆解成可以一步步落實的行動，從品牌定位、內容企劃、廣告投放到社群經營，陪你一起找到適合自己、又真的做得到的行銷做法。',
    background_color: 'bg-gray-50',
    text_color: 'text-gray-800',
    text_size: 'text-4xl lg:text-5xl',
    text_shadow: '',
    button_text: '認識瘋來客',
    button_url: '#about-detail',

    // 特色卡片：改成中性圖片＋新標題（不再使用 13media 網址）
    feature1_title: '實戰經驗豐富',
    feature1_image_url:
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
    feature1_hover_image_url:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',

    feature2_title: '專業分工團隊',
    feature2_image_url:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
    feature2_hover_image_url:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',

    feature3_title: '穩定合作與陪跑',
    feature3_image_url:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    feature3_hover_image_url:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',

    section2_title: '專屬你的外包行銷部門',
    section2_subtitle: '不必再自己摸索，我們把整套行銷流程準備好給你',
    section2_content:
      '許多老闆都知道要做數位行銷，卻常常卡在「不知道從哪裡開始」。瘋來客會先幫你釐清目標與預算，再一起規劃最適合現在階段的行銷組合，讓每一分投入都看得見方向與成效。',
    section2_description:
      '我們不是只幫你「投廣告」，而是從文案、素材、頁面動線到成效檢視，一路協助優化。讓你在有限的人力與預算下，仍能建立穩定、可複製的行銷流程，而不是只靠一次性的爆量曝光。',

    section3_title: '瘋來客可以為你帶來什麼？',
    section3_content:
      '我們就像是你的外包行銷部門：有人負責策略，有人專心做內容，有人盯數據與成效。你不需要再自己扛下所有行銷工作，專心把服務和產品做到最好，其餘交給我們。',
    section3_button_text: '看看我們怎麼合作',
    section3_button_url: '#team',

    benefit1_title: '長期可累積的品牌資產',
    benefit2_title: '減少試錯與溝通成本',
    benefit3_title: '依產業客製的行銷策略'
    // ===== 預設內容到這裡結束 =====
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'about')
        .single();

      if (error) {
        console.error('Error fetching about content:', error);
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
          button_text: data.button_text || content.button_text,
          button_url: data.button_url || content.button_url,
          // 新增欄位
          feature1_title: data.feature1_title || content.feature1_title,
          feature1_image_url:
            data.feature1_image_url || content.feature1_image_url,
          feature1_hover_image_url:
            data.feature1_hover_image_url || content.feature1_hover_image_url,
          feature2_title: data.feature2_title || content.feature2_title,
          feature2_image_url:
            data.feature2_image_url || content.feature2_image_url,
          feature2_hover_image_url:
            data.feature2_hover_image_url || content.feature2_hover_image_url,
          feature3_title: data.feature3_title || content.feature3_title,
          feature3_image_url:
            data.feature3_image_url || content.feature3_image_url,
          feature3_hover_image_url:
            data.feature3_hover_image_url || content.feature3_hover_image_url,
          section2_title: data.section2_title || content.section2_title,
          section2_subtitle:
            data.section2_subtitle || content.section2_subtitle,
          section2_content: data.section2_content || content.section2_content,
          section2_description:
            data.section2_description || content.section2_description,
          section3_title: data.section3_title || content.section3_title,
          section3_content: data.section3_content || content.section3_content,
          section3_button_text:
            data.section3_button_text || content.section3_button_text,
          section3_button_url:
            data.section3_button_url || content.section3_button_url,
          benefit1_title: data.benefit1_title || content.benefit1_title,
          benefit2_title: data.benefit2_title || content.benefit2_title,
          benefit3_title: data.benefit3_title || content.benefit3_title
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 判斷背景顏色是否為漸層
  const isGradient =
    content.background_color.includes('from-') ||
    content.background_color.includes('gradient');

  // 判斷文字顏色是否為 Tailwind 類別
  const isTextClass = content.text_color.startsWith('text-');

  // 特色卡片資料
  const featureCards = [
    {
      image: content.feature1_image_url,
      hoverImage: content.feature1_hover_image_url,
      title: content.feature1_title
    },
    {
      image: content.feature2_image_url,
      hoverImage: content.feature2_hover_image_url,
      title: content.feature2_title
    },
    {
      image: content.feature3_image_url,
      hoverImage: content.feature3_hover_image_url,
      title: content.feature3_title
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`${content.text_size} font-bold mb-6 ${content.text_shadow} ${
              isTextClass ? content.text_color : ''
            }`}
            style={!isTextClass ? { color: content.text_color } : {}}
          >
            <strong>{content.title}</strong>
          </h2>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3
              className={`text-3xl font-bold mb-6 ${
                isTextClass ? content.text_color : 'text-gray-800'
              }`}
              style={!isTextClass ? { color: content.text_color } : {}}
            >
              {content.subtitle}
            </h3>
            <p
              className={`text-xl mb-6 ${
                isTextClass ? 'text-gray-700' : 'text-gray-700'
              }`}
              style={!isTextClass ? { color: content.text_color } : {}}
            >
              {content.content}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-gray-600 leading-relaxed">
              {content.description}
            </p>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
            >
              <div className="relative h-64">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                  src={card.hoverImage}
                  alt={`${card.title} 詳細說明`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Shared Marketing Department Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {content.section2_title}
            </h3>
            <p className="text-xl text-gray-700 font-medium">
              {content.section2_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  我們的服務理念
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {content.section2_content}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  為什麼選擇我們
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {content.section2_description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shared Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {content.section3_title}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                <i className="ri-check-line text-teal-500 mr-2"></i>
                {content.section3_content}
              </p>

              {content.section3_button_text && content.section3_button_url && (
                <a
                  href={content.section3_button_url}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300 inline-block whitespace-nowrap cursor-pointer mb-8"
                >
                  {content.section3_button_text}
                </a>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">
                    {content.benefit1_title}
                  </h4>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">
                    {content.benefit2_title}
                  </h4>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">
                    {content.benefit3_title}
                  </h4>
                </div>
              </div>
            </div>

            <div>
              <img
                src={
                  content.secondary_image_url ||
                  'https://readdy.ai/api/search-image?query=professional%20marketing%20team%20collaboration%20workspace%20with%20modern%20office%20setup%2C%20diverse%20team%20members%20working%20on%20digital%20marketing%20projects%2C%20clean%20bright%20environment%2C%20business%20professional%20atmosphere&width=600&height=400&seq=team-workspace&orientation=landscape'
                }
                alt="專業行銷團隊工作環境"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
