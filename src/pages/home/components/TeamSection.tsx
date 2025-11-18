import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface TeamContent {
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
  // 新增團隊優勢欄位
  advantage1_title?: string;
  advantage1_description?: string;
  advantage2_title?: string;
  advantage2_description?: string;
  advantage3_title?: string;
  advantage3_description?: string;
  // 新增服務承諾欄位
  commitment_title?: string;
  commitment1?: string;
  commitment2?: string;
  commitment3?: string;
  commitment4?: string;
}

interface CustomerReview {
  id: string;
  customer_name: string;
  customer_title: string;
  company_name: string;
  rating: number;
  review_content: string;
  display_order: number;
  is_active: boolean;
  avatar_url?: string; // 新增頭像欄位
}

const TeamSection = () => {
  const [content, setContent] = useState<TeamContent>({
    title: '專業服務團隊',
    subtitle: '深懂市場實務的行銷夥伴',
    content: '我們不是在賣理論，而是每天都實際操作社群、剪影片、設計內容、投廣告、做網站。這支團隊懂市場、懂轉換，也懂中小型品牌真正需要什麼，我們用實際執行來證明效果。',
    description: '',
    background_color: 'bg-gray-50',
    text_color: 'text-gray-800',
    text_size: 'text-4xl lg:text-5xl',
    text_shadow: '',
    button_text: '',
    button_url: '',
    // 預設團隊優勢內容
    advantage1_title: '豐富經驗',
    advantage1_description: '十年以上網路行銷經驗，成功輔導近2000家企業',
    advantage2_title: '專業背景',
    advantage2_description: '碩士級專業團隊，具備深厚的理論基礎與實戰經驗',
    advantage3_title: '品質保證',
    advantage3_description: '認真負責的服務態度，確保每個專案都能達到最佳效果',
    // 預設服務承諾內容
    commitment_title: '服務承諾',
    commitment1: '專業諮詢與策略規劃',
    commitment2: '快速響應與執行',
    commitment3: '定期成效追蹤與優化',
    commitment4: '透明化報告與溝通'
  });

  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    fetchContent();
    fetchCustomerReviews();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', 'team')
        .eq('section_key', 'team')
        .single();

      if (error) {
        console.error('Error fetching team content:', error);
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
          // 從資料庫讀取團隊優勢內容
          advantage1_title: data.advantage1_title || content.advantage1_title,
          advantage1_description: data.advantage1_description || content.advantage1_description,
          advantage2_title: data.advantage2_title || content.advantage2_title,
          advantage2_description: data.advantage2_description || content.advantage2_description,
          advantage3_title: data.advantage3_title || content.advantage3_title,
          advantage3_description: data.advantage3_description || content.advantage3_description,
          // 從資料庫讀取服務承諾內容
          commitment_title: data.commitment_title || content.commitment_title,
          commitment1: data.commitment1 || content.commitment1,
          commitment2: data.commitment2 || content.commitment2,
          commitment3: data.commitment3 || content.commitment3,
          commitment4: data.commitment4 || content.commitment4
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCustomerReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(4);

      if (error) {
        console.error('Error fetching customer reviews:', error);
        return;
      }

      setCustomerReviews(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 判斷背景顏色是否為漸層
  const isGradient = content.background_color.includes('from-') || content.background_color.includes('gradient');
  
  // 判斷文字顏色是否為 Tailwind 類別
  const isTextClass = content.text_color.startsWith('text-');

  // 渲染星星評分
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < rating ? 'fill' : 'line'} text-yellow-400`}
      ></i>
    ));
  };

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
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
            {content.title}
          </h2>
          <p 
            className={`text-xl ${isTextClass ? 'text-gray-600' : ''} mb-6`}
            style={!isTextClass ? { color: content.text_color } : {}}
          >
            {content.subtitle}
          </p>
          {content.content && (
            <div 
              className={`text-lg max-w-4xl mx-auto ${isTextClass ? 'text-gray-700' : ''}`}
              style={!isTextClass ? { color: content.text_color } : {}}
            >
              {content.content.split('\n').map((line, index) => (
                <p key={index} className="mb-4">{line}</p>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">團隊優勢</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-award-line text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{content.advantage1_title}</h4>
                    <p className="text-gray-600 text-sm">{content.advantage1_description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-graduation-cap-line text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{content.advantage2_title}</h4>
                    <p className="text-gray-600 text-sm">{content.advantage2_description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-shield-check-line text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{content.advantage3_title}</h4>
                    <p className="text-gray-600 text-sm">{content.advantage3_description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{content.commitment_title}</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <i className="ri-check-line text-yellow-300"></i>
                  <span>{content.commitment1}</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="ri-check-line text-yellow-300"></i>
                  <span>{content.commitment2}</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="ri-check-line text-yellow-300"></i>
                  <span>{content.commitment3}</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="ri-check-line text-yellow-300"></i>
                  <span>{content.commitment4}</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={content.image_url || "https://readdy.ai/api/search-image?query=professional%20marketing%20team%20meeting%20in%20modern%20office%2C%20diverse%20group%20of%20marketing%20experts%20discussing%20strategy%20around%20conference%20table%2C%20bright%20corporate%20environment%2C%20business%20professional%20atmosphere&width=600&height=400&seq=team-meeting&orientation=landscape"}
                alt="專業團隊會議"
                className="w-full rounded-2xl shadow-lg"
                onError={(e) => {
                  console.log('圖片載入失敗，使用預設圖片');
                  e.currentTarget.src = "https://readdy.ai/api/search-image?query=professional%20marketing%20team%20meeting%20in%20modern%20office%2C%20diverse%20group%20of%20marketing%20experts%20discussing%20strategy%20around%20conference%20table%2C%20bright%20corporate%20environment%2C%20business%20professional%20atmosphere&width=600&height=400&seq=team-meeting&orientation=landscape";
                }}
              />
              
              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">10+</div>
                  <div className="text-sm text-gray-600">年經驗</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2000+</div>
                  <div className="text-sm text-gray-600">成功案例</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Customer Reviews Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">客戶好評</h3>
          
          {/* 修復網格佈局，確保所有好評都能正常顯示 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {customerReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg text-center group hover:shadow-xl transition-all duration-300 w-full"
              >
                <div className="mb-4">
                  {review.avatar_url ? (
                    <img 
                      src={review.avatar_url} 
                      alt={`${review.customer_name}的頭像`}
                      className="w-16 h-16 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300 border-2 border-gray-200"
                      onError={(e) => {
                        // 如果圖片載入失敗，顯示姓名首字母
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300 ${review.avatar_url ? 'hidden' : 'flex'}`}
                  >
                    {review.customer_name.charAt(0)}
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-gray-800 mb-1">{review.customer_name}</h4>
                <p className="text-sm text-teal-600 font-medium mb-1">{review.customer_title}</p>
                <p className="text-xs text-gray-500 mb-3">{review.company_name}</p>
                
                <div className="flex justify-center mb-3 space-x-1">
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  "{review.review_content}"
                </p>
              </motion.div>
            ))}
          </div>
          
          {/* 如果好評數量少於4個，顯示提示 */}
          {customerReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暫無客戶好評</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
