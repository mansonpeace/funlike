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
    title: '立即聘用一群真懂行銷的部門',
    subtitle: '數位行銷已成企業生存工具,當網路應用普及人才更為欠缺。',
    content: '有好商品,更需搭建溝通橋樑通往消費者',
    description: '在數位時代企業注重行銷策略,也要有靈活且專業的執行團隊。我們透過共享模式整合各領域專才,不僅能降低企業人力負擔,更精準補強專案執行力,確保行銷效益最大化,助企業穩健成長',
    background_color: 'bg-gray-50',
    text_color: 'text-gray-800',
    text_size: 'text-4xl lg:text-5xl',
    text_shadow: '',
    button_text: '關於共享行銷部',
    button_url: '#about-detail',
    // 預設值
    feature1_title: '經驗豐富',
    feature1_image_url: 'https://www.13media.com.tw/wp-content/uploads/2025/03/經驗豐富-標題_0.jpg',
    feature1_hover_image_url: 'https://www.13media.com.tw/wp-content/uploads/2025/03/經驗豐富-內文.jpg',
    feature2_title: '碩士領軍',
    feature2_image_url: 'https://www.13media.com.tw/wp-content/uploads/2025/03/碩士領軍-標題_0.jpg',
    feature2_hover_image_url: 'https://www.13media.com.tw/wp-content/uploads/2025/03/碩士領軍-內文_0.jpg',
    feature3_title: '認真負責',
    feature3_image_url: 'https://www.13media.com.tw/wp-content/uploads/2025/03/認真負責-標題_0.jpg',
    feature3_hover_image_url: 'https://www.13media.com.tw/wp-content/uploads/2025/03/認真負責-內文_0.jpg',
    section2_title: '專屬您的行銷部門',
    section2_subtitle: '全新服務型態,成為企業堅實行銷團隊',
    section2_content: '憑藉多年實戰經驗與跨領域專業團隊，我們提供從品牌策略、形象建立到廣告與社群經營的全方位行銷解決方案。不僅協助企業被看見，更讓品牌實現成長、提升轉換、創造營收。',
    section2_description: '鑒於目前數位廣告投放工具精準多元,但企業在執行數位行銷轉換成效大多遭遇瓶頸,其主要原因多為圖文呈現不良,或是行銷動線不佳而導致。因此十三致力培養一群懂如何完善圖文及優化消費者瀏覽動線,努力追求企業最優成效之夥伴,並將此專業人才之知識共享給所有企業客戶。',
    section3_title: '十三共享行銷部為企業準備專業人才',
    section3_content: '透過知識共享、經驗共享、人材共享,我們將專業服務提供給合作企業,協助提升行銷轉換成效,解決內部執行困境,讓每一個銷售專案都能發揮最佳價值。',
    section3_button_text: '認識十三高效團隊',
    section3_button_url: '#team',
    benefit1_title: '豐沛行銷資源',
    benefit2_title: '節省溝通成本',
    benefit3_title: '客製行銷策略'
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
          feature1_image_url: data.feature1_image_url || content.feature1_image_url,
          feature1_hover_image_url: data.feature1_hover_image_url || content.feature1_hover_image_url,
          feature2_title: data.feature2_title || content.feature2_title,
          feature2_image_url: data.feature2_image_url || content.feature2_image_url,
          feature2_hover_image_url: data.feature2_hover_image_url || content.feature2_hover_image_url,
          feature3_title: data.feature3_title || content.feature3_title,
          feature3_image_url: data.feature3_image_url || content.feature3_image_url,
          feature3_hover_image_url: data.feature3_hover_image_url || content.feature3_hover_image_url,
          section2_title: data.section2_title || content.section2_title,
          section2_subtitle: data.section2_subtitle || content.section2_subtitle,
          section2_content: data.section2_content || content.section2_content,
          section2_description: data.section2_description || content.section2_description,
          section3_title: data.section3_title || content.section3_title,
          section3_content: data.section3_content || content.section3_content,
          section3_button_text: data.section3_button_text || content.section3_button_text,
          section3_button_url: data.section3_button_url || content.section3_button_url,
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
  const isGradient = content.background_color.includes('from-') || content.background_color.includes('gradient');
  
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
            className={`${content.text_size} font-bold mb-6 ${content.text_shadow} ${isTextClass ? content.text_color : ''}`}
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
              className={`text-3xl font-bold mb-6 ${isTextClass ? content.text_color : 'text-gray-800'}`}
              style={!isTextClass ? { color: content.text_color } : {}}
            >
              {content.subtitle}
            </h3>
            <p 
              className={`text-xl mb-6 ${isTextClass ? 'text-gray-700' : 'text-gray-700'}`}
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
            <p 
              className="text-gray-600 leading-relaxed"
            >
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
            <h3 className="text-3xl font-bold text-gray-800 mb-4">{content.section2_title}</h3>
            <p className="text-xl text-gray-700 font-medium">{content.section2_subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">我們的服務理念</h4>
                <p className="text-gray-600 leading-relaxed">
                  {content.section2_content}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">為什麼選擇我們</h4>
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
                  <h4 className="font-semibold text-gray-800">{content.benefit1_title}</h4>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">{content.benefit2_title}</h4>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <h4 className="font-semibold text-gray-800">{content.benefit3_title}</h4>
                </div>
              </div>
            </div>

            <div>
              <img
                src={content.secondary_image_url || "https://readdy.ai/api/search-image?query=professional%20marketing%20team%20collaboration%20workspace%20with%20modern%20office%20setup%2C%20diverse%20team%20members%20working%20on%20digital%20marketing%20projects%2C%20clean%20bright%20environment%2C%20business%20professional%20atmosphere&width=600&height=400&seq=team-workspace&orientation=landscape"}
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
