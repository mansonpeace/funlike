import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_class: string;
  display_order: number;
  is_active: boolean;
}

interface SectionData {
  title: string;
  subtitle: string;
}

export default function ServicesSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [sectionData, setSectionData] = useState<SectionData>({
    title: '專業服務團隊',
    subtitle: '我們擁有完整的專業團隊，為您提供全方位的服務解決方案'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 獲取服務項目
      const { data: servicesData, error: servicesError } = await supabase
        .from('service_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
      } else {
        setServices(servicesData || []);
      }

      // 獲取區塊標題和副標題
      const { data: sectionInfo, error: sectionError } = await supabase
        .from('page_sections')
        .select('title, subtitle')
        .eq('section_key', 'services')
        .single();

      if (sectionError) {
        console.error('Error fetching section data:', sectionError);
      } else if (sectionInfo) {
        setSectionData({
          title: sectionInfo.title || '專業服務團隊',
          subtitle: sectionInfo.subtitle || '我們擁有完整的專業團隊，為您提供全方位的服務解決方案'
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {sectionData.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {sectionData.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionData.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-gray-50 p-8 rounded-xl hover:bg-teal-50 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors duration-300">
                <i className={`${service.icon_class} text-2xl text-teal-600`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
