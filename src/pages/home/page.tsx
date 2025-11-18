
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

    // 添加首頁的結構化數據
    const addStructuredData = () => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "十三洋行 - 專業數位行銷服務",
        "description": "十三洋行提供專業數位行銷服務，透過共享行銷部門模式，為企業提供行銷策略規劃、品牌設計、廣告投放等一站式解決方案",
        "url": `${import.meta.env.VITE_SITE_URL || 'https://example.com'}/`,
        "mainEntity": {
          "@type": "Organization",
          "name": "十三洋行",
          "description": "專業數位行銷服務提供商",
          "url": import.meta.env.VITE_SITE_URL || 'https://example.com',
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "數位行銷服務",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "社群經營",
                  "description": "專業社群媒體經營與內容策劃"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "網站架設",
                  "description": "客製化網站設計與開發"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service", 
                  "name": "平面設計",
                  "description": "品牌視覺設計與平面設計服務"
                }
              }
            ]
          }
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "首頁",
              "item": import.meta.env.VITE_SITE_URL || 'https://example.com'
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
