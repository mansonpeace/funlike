import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/feature/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // 添加首頁的結構化數據（已改成瘋來客）
    const addStructuredData = () => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: '瘋來客 - 專業數位行銷服務',
        description:
          '瘋來客提供專業數位行銷服務，包含行銷健診、策略擬定、內容執行與品牌經營等一站式解決方案，協助企業有效被看見並穩定帶來客源。',
        url: `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/`,
        mainEntity: {
          '@type': 'Organization',
          name: '瘋來客',
          description: '專注於協助中小企業與個人品牌成長的數位行銷團隊',
          url: import.meta.env.VITE_SITE_URL || 'https://example.com',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: '數位行銷服務',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '社群經營',
                  description: '專業社群媒體經營、貼文企劃與帳號經營策略'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '網站架設',
                  description: '品牌官網與行銷頁面規劃、設計與開發'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: '平面與品牌設計',
                  description: '品牌視覺規劃、Logo、DM、活動素材等設計服務'
                }
              }
            ]
          }
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: '首頁',
              item: import.meta.env.VITE_SITE_URL || 'https://example.com'
            }
          ]
        }
      });
      document.head.appendChild(script);
    };

    addStructuredData();

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">載入中...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <ContactSection />
      </main>
    </div>
  );
};

export default HomePage;