import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ContentItem {
  id: string;
  section_key: string;
  section: string;
  title: string;
  subtitle: string;
  content: string;
  description: string;
  image_url: string;
  secondary_image_url: string;
  background_color: string;
  text_color: string;
  text_size: string;
  text_shadow: string;
  button_text: string;
  button_url: string;
  display_order: number;
  is_active: boolean;
  // 新增的欄位
  main_display_image_url?: string;
  avatar1_url?: string;
  avatar2_url?: string;
  // 新增聊天氣泡文字欄位
  chat_bubble1_name?: string;
  chat_bubble1_time?: string;
  chat_bubble1_message?: string;
  chat_bubble2_name?: string;
  chat_bubble2_time?: string;
  chat_bubble2_message?: string;
  // 關於我們頁面專用欄位
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
  feature1_title?: string;
  feature2_title?: string;
  feature3_title?: string;
  // 新增特色卡片圖片欄位
  feature1_image_url?: string;
  feature1_hover_image_url?: string;
  feature2_image_url?: string;
  feature2_hover_image_url?: string;
  feature3_image_url?: string;
  feature3_hover_image_url?: string;
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

interface SectionItem {
  id: string;
  section_name: string;
  section_key: string;
  display_order: number;
  is_visible: boolean;
  title?: string;
  subtitle?: string;
  content?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon_class: string;
  display_order: number;
  is_active: boolean;
}

interface WebsiteSettings {
  logo_image_url?: string;
  logo_text?: string;
  logo_subtitle?: string;
  logo_size?: string;
  contact_address?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_facebook_url?: string;
  contact_instagram_url?: string;
  contact_line_url?: string;
  contact_map_embed_url?: string;
  header_height?: string; // 新增導航列高度欄位
}

export default function AdminPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [activeTab, setActiveTab] = useState('content');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  
  // 新增客戶好評相關狀態
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // 新增導航選單和網站設定的狀態
  const [navigationItems, setNavigationItems] = useState<any[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<any>({
    logo_text: '十三洋行',
    logo_subtitle: '共享廚房',
    logo_image_url: '',
    logo_size: 'w-12 h-12' // 新增 LOGO 大小設定
  });
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [showWebsiteSettingsModal, setShowWebsiteSettingsModal] = useState(false);
  const [editingNavigation, setEditingNavigation] = useState<any>(null);

  useEffect(() => {
    // 添加noindex meta標籤，防止搜尋引擎索引管理頁面
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    // 設置頁面標題
    document.title = '網站後台管理 - 十三洋行';

    fetchData();

    return () => {
      // 清理meta標籤
      document.head.removeChild(metaRobots);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 載入所有數據
      await Promise.all([
        loadWebsiteContent(),
        loadPageSections(),
        loadServices(),
        loadCustomerReviews(),
        loadNavigationItems(),
        loadWebsiteSettings()
      ]);
    } catch (error) {
      console.error('載入數據失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 載入網站內容
  const loadWebsiteContent = async () => {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('section', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error('載入網站內容失敗:', error);
    }
  };

  // 載入頁面區塊
  const loadPageSections = async () => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('載入頁面區塊失敗:', error);
    }
  };

  // 載入服務項目
  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('載入服務項目失敗:', error);
    }
  };

  // 載入客戶好評
  const loadCustomerReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCustomerReviews(data || []);
    } catch (error) {
      console.error('載入客戶好評失敗:', error);
    }
  };

  // 載入導航選單
  const loadNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setNavigationItems(data || []);
    } catch (error) {
      console.error('載入導航選單失敗:', error);
    }
  };

  // 載入網站設定
  const loadWebsiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      if (data) setWebsiteSettings(data);
    } catch (error) {
      console.error('載入網站設定失敗:', error);
    }
  };

  // 圖片上傳處理
  const handleImageUpload = async (file: File, itemId: string, fieldName: string) => {
    try {
      setUploadingImages(prev => ({ ...prev, [itemId]: true }));
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上傳失敗');
      }

      const data = await response.json();
      
      if (editingItem) {
        setEditingItem({
          ...editingItem,
          [fieldName]: data.url
        });
      }
      
      alert('圖片上傳成功！');
    } catch (error: any) {
      console.error('圖片上傳錯誤:', error);
      alert(`圖片上傳失敗：${error.message}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // 更新內容
  const updateContent = async (item: ContentItem) => {
    try {
      setUploading(true);
      const { error } = await supabase
        .from('website_content')
        .update({
          title: item.title,
          subtitle: item.subtitle,
          content: item.content,
          description: item.description,
          image_url: item.image_url,
          secondary_image_url: item.secondary_image_url,
          background_color: item.background_color,
          text_color: item.text_color,
          text_size: item.text_size,
          text_shadow: item.text_shadow,
          button_text: item.button_text,
          button_url: item.button_url,
          display_order: item.display_order,
          is_active: item.is_active,
          main_display_image_url: item.main_display_image_url,
          avatar1_url: item.avatar1_url,
          avatar2_url: item.avatar2_url,
          chat_bubble1_name: item.chat_bubble1_name,
          chat_bubble1_time: item.chat_bubble1_time,
          chat_bubble1_message: item.chat_bubble1_message,
          chat_bubble2_name: item.chat_bubble2_name,
          chat_bubble2_time: item.chat_bubble2_time,
          chat_bubble2_message: item.chat_bubble2_message,
          advantage1_title: item.advantage1_title,
          advantage1_description: item.advantage1_description,
          advantage2_title: item.advantage2_title,
          advantage2_description: item.advantage2_description,
          advantage3_title: item.advantage3_title,
          advantage3_description: item.advantage3_description,
          commitment_title: item.commitment_title,
          commitment1: item.commitment1,
          commitment2: item.commitment2,
          commitment3: item.commitment3,
          commitment4: item.commitment4,
          feature1_image_url: item.feature1_image_url,
          feature1_hover_image_url: item.feature1_hover_image_url,
          feature2_image_url: item.feature2_image_url,
          feature2_hover_image_url: item.feature2_hover_image_url,
          feature3_image_url: item.feature3_image_url,
          feature3_hover_image_url: item.feature3_hover_image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) throw error;
      
      await loadWebsiteContent();
      setEditingItem(null);
      alert('更新成功！');
    } catch (error) {
      console.error('更新失敗:', error);
      alert('更新失敗，請重試');
    } finally {
      setUploading(false);
    }
  };

  // 更新區塊
  const updateSection = async (section: SectionItem) => {
    try {
      setUploading(true);
      const { error } = await supabase
        .from('page_sections')
        .update({
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);

      if (error) throw error;
      
      await loadPageSections();
      setEditingSection(null);
      alert('更新成功！');
    } catch (error) {
      console.error('更新失敗:', error);
      alert('更新失敗，請重試');
    } finally {
      setUploading(false);
    }
  };

  // 更新區塊排序
  const updateSectionOrder = async (sectionId: string, newOrder: number) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .update({ display_order: newOrder })
        .eq('id', sectionId);

      if (error) throw error;
      await loadPageSections();
    } catch (error) {
      console.error('更新排序失敗:', error);
    }
  };

  // 保存服務項目
  const handleSaveService = async (serviceData: Partial<ServiceItem>) => {
    try {
      if (editingService) {
        const { error } = await supabase
          .from('service_items')
          .update(serviceData)
          .eq('id', editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('service_items')
          .insert([serviceData]);
        if (error) throw error;
      }

      await loadServices();
      setShowServiceModal(false);
      setEditingService(null);
      alert('保存成功！');
    } catch (error) {
      console.error('保存服務項目失敗:', error);
      alert('保存失敗，請重試');
    }
  };

  // 刪除服務項目
  const handleDeleteService = async (id: string) => {
    if (!confirm('確定要刪除這個服務項目嗎？')) return;

    try {
      const { error } = await supabase
        .from('service_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadServices();
      alert('刪除成功！');
    } catch (error) {
      console.error('刪除服務項目失敗:', error);
      alert('刪除失敗，請重試');
    }
  };

  // 切換服務項目狀態
  const handleToggleServiceStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('service_items')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      await loadServices();
    } catch (error) {
      console.error('更新服務狀態失敗:', error);
    }
  };

  // 保存客戶好評
  const handleSaveReview = async (reviewData: any) => {
    try {
      if (editingReview) {
        const { error } = await supabase
          .from('customer_reviews')
          .update(reviewData)
          .eq('id', editingReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customer_reviews')
          .insert([reviewData]);
        if (error) throw error;
      }

      await loadCustomerReviews();
      setShowReviewModal(false);
      setEditingReview(null);
      alert('客戶好評保存成功！');
    } catch (error) {
      console.error('保存客戶好評失敗:', error);
      alert('保存失敗，請重試');
    }
  };

  // 刪除客戶好評
  const handleDeleteReview = async (id: string) => {
    if (!confirm('確定要刪除這個客戶好評嗎？')) return;

    try {
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCustomerReviews();
      alert('刪除成功！');
    } catch (error) {
      console.error('刪除客戶好評失敗:', error);
      alert('刪除失敗，請重試');
    }
  };

  // 切換好評狀態
  const handleToggleReviewStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      await loadCustomerReviews();
    } catch (error) {
      console.error('更新好評狀態失敗:', error);
    }
  };

  // 新增/編輯導航選單
  const handleNavigationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const navigationData = {
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: formData.get('is_active') === 'on'
    };

    try {
      setUploading(true);
      
      if (editingNavigation) {
        console.log('更新導航項目:', navigationData);
        const { error } = await supabase
          .from('navigation_items')
          .update({
            ...navigationData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingNavigation.id);
        
        if (error) throw error;
        console.log('導航項目更新成功');
      } else {
        console.log('新增導航項目:', navigationData);
        const { error } = await supabase
          .from('navigation_items')
          .insert([{
            ...navigationData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
        console.log('導航項目新增成功');
      }

      setShowNavigationModal(false);
      setEditingNavigation(null);
      await loadNavigationItems();
      alert('導航選單保存成功！前台將自動更新。');
    } catch (error: any) {
      console.error('保存導航選單失敗:', error);
      alert(`保存失敗：${error.message || '請重試'}`);
    } finally {
      setUploading(false);
    }
  };

  // 刪除導航選單
  const deleteNavigationItem = async (id: number) => {
    if (!confirm('確定要刪除這個導航選單項目嗎？')) return;

    try {
      setUploading(true);
      console.log('刪除導航項目 ID:', id);
      
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      console.log('導航項目刪除成功');
      await loadNavigationItems();
      alert('刪除成功！前台將自動更新。');
    } catch (error: any) {
      console.error('刪除導航選單失敗:', error);
      alert(`刪除失敗：${error.message || '請重試'}`);
    } finally {
      setUploading(false);
    }
  };

  // 切換導航項目狀態
  const toggleNavigationStatus = async (id: number, currentStatus: boolean) => {
    try {
      setUploading(true);
      console.log('切換導航項目狀態:', id, !currentStatus);
      
      const { error } = await supabase
        .from('navigation_items')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      console.log('導航項目狀態更新成功');
      await loadNavigationItems();
    } catch (error: any) {
      console.error('更新導航狀態失敗:', error);
      alert(`更新失敗：${error.message || '請重試'}`);
    } finally {
      setUploading(false);
    }
  };

  // 更新網站設定
  const handleWebsiteSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const { error } = await supabase
        .from('website_settings')
        .upsert({
          id: 1,
          ...websiteSettings,
          contact_address: websiteSettings.contact_address,
          contact_phone: websiteSettings.contact_phone,
          contact_email: websiteSettings.contact_email,
          contact_facebook_url: websiteSettings.contact_facebook_url,
          contact_instagram_url: websiteSettings.contact_instagram_url,
          contact_line_url: websiteSettings.contact_line_url,
          contact_map_embed_url: websiteSettings.contact_map_embed_url,
          header_height: websiteSettings.header_height, // 儲存導航列高度
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('網站設定（包含聯絡資訊）更新成功');
      setShowWebsiteSettingsModal(false);
      await loadWebsiteSettings();
      
      // 發送即時更新通知到前台
      const channel = supabase.channel(`contact-info-updates-${Date.now()}`);
      channel.send({
        type: 'broadcast',
        event: 'contact_info_updated',
        payload: { 
          message: '聯絡資訊已更新',
          timestamp: Date.now(),
          data: websiteSettings
        }
      });
      
      alert('網站設定和聯絡資訊保存成功！前台將自動更新。');
    } catch (error: any) {
      console.error('保存網站設定失敗:', error);
      alert(`保存失敗：${error.message || '請重試'}`);
    } finally {
      setUploading(false);
    }
  };

  const getSectionDisplayName = (sectionKey: string) => {
    const names: Record<string, string> = {
      hero: '首頁橫幅',
      about: '關於我們',
      services: '服務介紹',
      team: '團隊介紹',
      testimonials: '客戶見證',
      contact: '聯絡我們'
    };
    return names[sectionKey] || sectionKey;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">網站後台管理</h1>
            <a 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              返回網站
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                內容管理
              </button>
              <button
                onClick={() => setActiveTab('sections')}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'sections'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                頁面排序
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                客戶好評管理
              </button>
              <button
                onClick={() => setActiveTab('navigation')}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'navigation'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                導航選單
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                網站設定
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">內容編輯</h2>
                
                {/* 新增聯絡資訊編輯區塊 */}
                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-orange-800">
                      <i className="ri-contacts-line mr-2"></i>
                      聯絡資訊編輯
                    </h3>
                    <button
                      onClick={() => setShowWebsiteSettingsModal(true)}
                      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <i className="ri-edit-line mr-2"></i>
                      編輯聯絡資訊
                    </button>
                  </div>
                  
                  <p className="text-orange-700 text-sm mb-4">
                    <i className="ri-information-line mr-1"></i>
                    這裡可以編輯前台「聯絡我們」區塊顯示的所有聯絡資訊，包含地址、電話、Email、社群連結和地圖
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 bg-white rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        <i className="ri-map-pin-line text-orange-600 mr-1"></i>
                        聯絡地址
                      </p>
                      <p className="text-sm text-gray-600">{websiteSettings.contact_address || '未設定'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        <i className="ri-phone-line text-blue-600 mr-1"></i>
                        聯絡電話
                      </p>
                      <p className="text-sm text-gray-600">{websiteSettings.contact_phone || '未設定'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        <i className="ri-mail-line text-green-600 mr-1"></i>
                        聯絡 Email
                      </p>
                      <p className="text-sm text-gray-600">{websiteSettings.contact_email || '未設定'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        <i className="ri-global-line text-purple-600 mr-1"></i>
                        社群連結
                      </p>
                      <div className="flex gap-2">
                        {websiteSettings.contact_facebook_url && (
                          <i className="ri-facebook-fill text-blue-600"></i>
                        )}
                        {websiteSettings.contact_instagram_url && (
                          <i className="ri-instagram-line text-pink-600"></i>
                        )}
                        {!websiteSettings.contact_facebook_url && !websiteSettings.contact_instagram_url && (
                          <span className="text-sm text-gray-400">未設定</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 頁面區塊標題編輯 */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium text-yellow-800 mb-4">
                    <i className="ri-edit-box-line mr-2"></i>
                    頁面區塊標題編輯
                  </h3>
                  <p className="text-yellow-700 text-sm mb-4">
                    這裡可以編輯各個頁面區塊的主標題和副標題（如「專業服務團隊」等）
                  </p>
                  
                  <div className="grid gap-4">
                    {sections.map((section) => (
                      <div key={section.id} className="border border-yellow-300 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {section.section_name}
                          </h4>
                          <button
                            onClick={() => setEditingSection(section)}
                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            編輯標題
                          </button>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>主標題:</strong> {section.title || '未設定'}</p>
                            <p><strong>副標題:</strong> {section.subtitle || '未設定'}</p>
                          </div>
                          <div>
                            <p><strong>區塊代碼:</strong> {section.section_key}</p>
                            <p><strong>顯示順序:</strong> {section.display_order}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {contents.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {getSectionDisplayName(item.section_key)}
                        </h3>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          編輯
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>標題:</strong> {item.title}</p>
                          <p><strong>副標題:</strong> {item.subtitle}</p>
                          <p><strong>內容:</strong> {item.content?.substring(0, 50)}...</p>
                        </div>
                        <div>
                          <p><strong>背景顏色:</strong> 
                            <span 
                              className="inline-block w-4 h-4 ml-2 rounded border"
                              style={{backgroundColor: item.background_color}}
                            ></span>
                            {item.background_color}
                          </p>
                          <p><strong>文字顏色:</strong> 
                            <span style={{color: item.text_color}}>{item.text_color}</span>
                          </p>
                          <p><strong>圖片:</strong> {item.image_url ? '已上傳' : '未上傳'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sections' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">頁面區塊排序</h2>
                
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={section.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-medium text-gray-600">#{section.display_order}</span>
                        <span className="text-lg text-gray-900">{section.section_name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateSectionOrder(section.id, section.display_order - 1)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <i className="ri-arrow-up-line text-xl"></i>
                        </button>
                        <button
                          onClick={() => updateSectionOrder(section.id, section.display_order + 1)}
                          disabled={index === sections.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <i className="ri-arrow-down-line text-xl"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">客戶好評管理</h2>
                  <button
                    onClick={() => {
                      setEditingReview(null);
                      setShowReviewModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-add-line mr-2"></i>
                    新增客戶好評
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customerReviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.customer_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{review.customer_name}</h3>
                            <p className="text-sm text-gray-600">{review.customer_title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, index) => (
                            <i
                              key={index}
                              className={`ri-star-${index < review.rating ? 'fill' : 'line'} text-yellow-400 text-sm`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{review.company_name}</p>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">"{review.review_content}"</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            review.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {review.is_active ? '顯示中' : '已隱藏'}
                          </span>
                          <span className="text-xs text-gray-500">順序: {review.display_order}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleReviewStatus(review.id, review.is_active)}
                            className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                          >
                            {review.is_active ? '隱藏' : '顯示'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingReview(review);
                              setShowReviewModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 text-sm cursor-pointer"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {customerReviews.length === 0 && (
                  <div className="text-center py-12">
                    <i className="ri-star-line text-4xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500 mb-4">還沒有客戶好評</p>
                    <button
                      onClick={() => {
                        setEditingReview(null);
                        setShowReviewModal(true);
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      新增第一個客戶好評
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 導航選單管理 */}
            {activeTab === 'navigation' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">導航選單管理</h2>
                  <button
                    onClick={() => {
                      setEditingNavigation(null);
                      setShowNavigationModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                    disabled={uploading}
                  >
                    <i className="ri-add-line mr-2"></i>
                    新增導航項目
                  </button>
                </div>

                {/* 導航項目列表 */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名稱</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">連結</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {navigationItems.length > 0 ? (
                          navigationItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.order_index}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 max-w-xs truncate">{item.url}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => toggleNavigationStatus(item.id, item.is_active)}
                                  disabled={uploading}
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                                    item.is_active 
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  {item.is_active ? '顯示中' : '已隱藏'}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => {
                                      setEditingNavigation(item);
                                      setShowNavigationModal(true);
                                    }}
                                    disabled={uploading}
                                    className="text-blue-600 hover:text-blue-800 cursor-pointer disabled:opacity-50"
                                  >
                                    編輯
                                  </button>
                                  <button
                                    onClick={() => deleteNavigationItem(item.id)}
                                    disabled={uploading}
                                    className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                                  >
                                    刪除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <div className="text-gray-500">
                                <i className="ri-navigation-line text-4xl mb-4"></i>
                                <p className="text-lg mb-2">還沒有導航項目</p>
                                <p className="text-sm">點擊上方「新增導航項目」按鈕開始建立導航選單</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 使用說明 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    <i className="ri-information-line mr-1"></i>
                    使用說明
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 內部連結格式：/about、/services、/contact</li>
                    <li>• 外部連結格式：https://example.com</li>
                    <li>• 排序數字越小越靠前顯示</li>
                    <li>• 只有「顯示中」的項目會在前台顯示</li>
                    <li>• 修改後會立即更新前台顯示</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 網站設定管理 */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">網站設定管理</h2>
                  <button
                    onClick={() => setShowWebsiteSettingsModal(true)}
                    disabled={uploading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    <i className="ri-settings-line mr-2"></i>
                    編輯設定
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo設定預覽 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      <i className="ri-image-line mr-2"></i>
                      Logo設定預覽
                    </h3>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                      <div className={`${websiteSettings.logo_size || 'w-12 h-12'} bg-black rounded-full flex items-center justify-center`}>
                        {websiteSettings.logo_image_url ? (
                          <img 
                            src={websiteSettings.logo_image_url} 
                            alt="Logo" 
                            className={`${websiteSettings.logo_size || 'w-12 h-12'} object-cover rounded-full`}
                          />
                        ) : (
                          <span className="text-white font-bold">13</span>
                        )}
                      </div>
                      <div className="text-white">
                        <p className="font-bold text-lg">{websiteSettings.logo_text}</p>
                        <p className="text-sm opacity-90">{websiteSettings.logo_subtitle}</p>
                      </div>
                    </div>
                  </div>

                  {/* 聯絡資訊預覽 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">
                      <i className="ri-contacts-line mr-2"></i>
                      聯絡資訊預覽
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>📍 地址：</strong>{websiteSettings.contact_address || '未設定'}</p>
                      <p><strong>📞 電話：</strong>{websiteSettings.contact_phone || '未設定'}</p>
                      <p><strong>✉️ Email：</strong>{websiteSettings.contact_email || '未設定'}</p>
                      <p><strong>🌐 Facebook：</strong>{websiteSettings.contact_facebook_url || '未設定'}</p>
                      <p><strong>📷 Instagram：</strong>{websiteSettings.contact_instagram_url || '未設定'}</p>
                      <p><strong>💬 官方 LINE：</strong>{websiteSettings.contact_line_url || '未設定'}</p>
                    </div>
                  </div>
                </div>

                {/* 導航選單預覽 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    <i className="ri-navigation-line mr-2"></i>
                    導航選單預覽
                  </h3>
                  <div className="space-y-2">
                    {navigationItems.filter(item => item.is_active).length > 0 ? (
                      navigationItems.filter(item => item.is_active).map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.url}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <i className="ri-navigation-line text-2xl mb-2"></i>
                        <p className="text-sm">沒有啟用的導航項目</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 設定詳情 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">
                    <i className="ri-settings-2-line mr-2"></i>
                    當前設定詳情
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo主標題</label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {websiteSettings.logo_text}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo副標題</label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {websiteSettings.logo_subtitle}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">聯絡地址</label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {websiteSettings.contact_address || '未設定'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電話</label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {websiteSettings.contact_phone || '未設定'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">聯絡 Email</label>
                      <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                        {websiteSettings.contact_email || '未設定'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 客戶好評編輯彈窗 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingReview ? '編輯客戶好評' : '新增客戶好評'}
              </h3>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const reviewData = {
                customer_name: formData.get('customer_name') as string,
                customer_title: formData.get('customer_title') as string,
                company_name: formData.get('company_name') as string,
                rating: parseInt(formData.get('rating') as string),
                review_content: formData.get('review_content') as string,
                display_order: parseInt(formData.get('display_order') as string),
                is_active: formData.get('is_active') === 'on',
                avatar_url: formData.get('avatar_url') as string
              };
              handleSaveReview(reviewData);
            }}>
              <div className="p-6 space-y-6">
                {/* 客戶頭像照片上傳區域 */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                  <h4 className="font-medium text-blue-700 mb-4">
                    <i className="ri-user-line mr-2"></i>
                    客戶頭像照片
                    <span className="text-xs text-blue-600 block mt-1">（上傳客戶的專業頭像照片，會顯示為圓形頭像）</span>
                  </h4>
                  
                  <div className="space-y-4">
                    {/* 文件上傳 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        上傳頭像圖片
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              setUploading(true);
                              
                              const formData = new FormData();
                              formData.append('file', file);

                              const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/upload-image`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
                                },
                                body: formData,
                              });

                              if (!response.ok) {
                                throw new Error('上傳失敗');
                              }

                              const data = await response.json();
                              
                              // 更新頭像URL輸入框的值
                              const avatarInput = document.querySelector('input[name="avatar_url"]') as HTMLInputElement;
                              if (avatarInput) {
                                avatarInput.value = data.url;
                                avatarInput.dispatchEvent(new Event('input', { bubbles: true }));
                              }
                              
                              alert('頭像上傳成功！');
                            } catch (error) {
                              console.error('頭像上傳錯誤:', error);
                              alert('頭像上傳失敗，請重試');
                            } finally {
                              setUploading(false);
                            }
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        disabled={uploading}
                      />
                      {uploading && (
                        <div className="text-sm text-blue-600 mt-2">
                          <i className="ri-loader-4-line animate-spin mr-1"></i>
                          上傳中...
                        </div>
                      )}
                    </div>

                    {/* URL輸入 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        或輸入頭像圖片網址
                      </label>
                      <input
                        type="url"
                        name="avatar_url"
                        defaultValue={editingReview?.avatar_url || ''}
                        className="w-full px-3 py-2 border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                        placeholder="https://example.com/avatar.jpg"
                        onInput={(e) => {
                          const target = e.target as HTMLInputElement;
                          const previewContainer = document.getElementById('avatar-preview');
                          if (previewContainer && target.value) {
                            previewContainer.innerHTML = `
                              <div class="flex items-center space-x-3">
                                <img src="${target.value}" alt="頭像預覽" class="w-16 h-16 object-cover rounded-full border-2 border-blue-300" onerror="this.style.display='none'" />
                                <div class="text-sm text-blue-700">
                                  <p class="font-medium">預覽效果</p>
                                  <p class="text-xs">圓形頭像，顯示在客戶好評卡片中</p>
                                </div>
                              </div>
                            `;
                          } else if (previewContainer) {
                            previewContainer.innerHTML = '';
                          }
                        }}
                      />
                    </div>

                    {/* 頭像預覽 */}
                    <div id="avatar-preview">
                      {editingReview?.avatar_url && (
                        <div className="flex items-center space-x-3">
                          <img 
                            src={editingReview.avatar_url} 
                            alt="頭像預覽" 
                            className="w-16 h-16 object-cover rounded-full border-2 border-blue-300" 
                          />
                          <div className="text-sm text-blue-700">
                            <p className="font-medium">預覽效果</p>
                            <p className="text-xs">圓形頭像，顯示在客戶好評卡片中</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <i className="ri-lightbulb-line mr-1"></i>
                        <strong>提示：</strong>建議使用正方形的專業頭像照片，系統會自動裁切成圓形顯示。圖片尺寸建議 200x200 像素以上。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      客戶姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      defaultValue={editingReview?.customer_name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="例如：王小明"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      職稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_title"
                      defaultValue={editingReview?.customer_title || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="例如：行銷總監"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    公司名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    defaultValue={editingReview?.company_name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="例如：科技創新公司"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    評分 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="rating"
                    defaultValue={editingReview?.rating || 5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5星)</option>
                    <option value={4}>⭐⭐⭐⭐ (4星)</option>
                    <option value={3}>⭐⭐⭐ (3星)</option>
                    <option value={2}>⭐⭐ (2星)</option>
                    <option value={1}>⭐ (1星)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    好評內容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="review_content"
                    rows={4}
                    defaultValue={editingReview?.review_content || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="請輸入客戶的好評內容..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      顯示順序
                    </label>
                    <input
                      type="number"
                      name="display_order"
                      defaultValue={editingReview?.display_order || customerReviews.length + 1}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={editingReview?.is_active !== false}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      在前台顯示此好評
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setEditingReview(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                  disabled={uploading}
                >
                  {uploading ? '處理中...' : (editingReview ? '更新好評' : '新增好評')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 頁面區塊標題編輯彈窗 */}
      {editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                編輯 {editingSection.section_name} 區塊標題
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm mb-4">
                  <i className="ri-information-line mr-1"></i>
                  這裡編輯的是頁面上顯示的區塊主標題和副標題
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      區塊主標題
                      <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 block">（顯示在頁面上的大標題）</span>
                    </label>
                    <input
                      type="text"
                      value={editingSection.title || ''}
                      onChange={(e) => setEditingSection({...editingSection, title: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                      placeholder="例如：專業服務團隊"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      區塊副標題
                      <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 block">（顯示在主標題下方的描述文字）</span>
                    </label>
                    <textarea
                      value={editingSection.subtitle || ''}
                      onChange={(e) => setEditingSection({...editingSection, subtitle: e.target.value})}
                      className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                      placeholder="例如：我們擁有完整的專業團隊，為您提供全方位的服務解決方案"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      區塊內容描述
                      <span className="text-xs text-gray-500 block">（可選，額外的內容描述）</span>
                    </label>
                    <textarea
                      value={editingSection.content || ''}
                      onChange={(e) => setEditingSection({...editingSection, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="額外的內容描述（可選）"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => updateSection(editingSection)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
                disabled={uploading}
              >
                {uploading ? '處理中...' : '儲存變更'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                編輯 {getSectionDisplayName(editingItem.section_key)}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 基本資訊 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">標題</label>
                  <input
                    type="text"
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">副標題</label>
                  <input
                    type="text"
                    value={editingItem.subtitle || ''}
                    onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 內容區域 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">主要內容</label>
                  <textarea
                    value={editingItem.content || ''}
                    onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">詳細描述</label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 首頁橫幅專用欄位 */}
              {editingItem.section_key === 'hero' && (
                <div className="space-y-6 border-t pt-6">
                  <h4 className="font-medium text-gray-700 text-red-600">
                    <i className="ri-image-line mr-2"></i>
                    首頁橫幅區塊 - 聊天氣泡頭像圖片設定
                  </h4>
                  
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                    <p className="text-red-700 text-sm mb-6 font-medium">
                      <i className="ri-information-line mr-1"></i>
                      這裡可以編輯首頁橫幅右側聊天氣泡中的兩個頭像圖片和對話內容
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Avatar 1 - Clara */}
                      <div className="bg-white border-2 border-red-400 rounded-lg p-4">
                        <label className="block text-sm font-medium text-red-700 mb-3">
                          <i className="ri-user-line mr-1"></i>
                          左側聊天氣泡頭像 (Clara)
                          <span className="text-red-500">*</span>
                          <span className="text-xs text-red-600 block mt-1">（目前顯示在左上角聊天氣泡中的女性頭像）</span>
                        </label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && editingItem) {
                                handleImageUpload(file, editingItem.id, 'avatar1_url');
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
                            disabled={uploadingImages[editingItem?.id || '']}
                          />
                          <input
                            type="text"
                            value={editingItem.avatar1_url || ''}
                            onChange={(e) => setEditingItem({...editingItem, avatar1_url: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                            placeholder="或輸入頭像圖片網址"
                          />
                          {uploadingImages[editingItem?.id || ''] && (
                            <div className="text-sm text-red-600">
                              <i className="ri-loader-4-line animate-spin mr-1"></i>
                              上傳中...
                            </div>
                          )}
                          {editingItem.avatar1_url && (
                            <div className="flex items-center space-x-3">
                              <img src={editingItem.avatar1_url} alt="Clara頭像" className="w-16 h-16 object-cover rounded-full border-2 border-red-300" />
                              <div className="text-sm text-red-700">
                                <p className="font-medium">預覽效果</p>
                                <p className="text-xs">圓形頭像，顯示在左側聊天氣泡</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* 聊天氣泡1文字內容 */}
                        <div className="mt-6 pt-4 border-t border-red-300">
                          <h5 className="font-medium text-red-700 mb-3">
                            <i className="ri-chat-3-line mr-1"></i>
                            左側聊天氣泡對話內容
                          </h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                顯示名稱
                              </label>
                              <input
                                type="text"
                                value={(editingItem as any).chat_bubble1_name || '行銷主管Clara'}
                                onChange={(e) => setEditingItem({...editingItem, chat_bubble1_name: e.target.value} as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="行銷主管Clara"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                時間顯示
                              </label>
                              <input
                                type="text"
                                value={(editingItem as any).chat_bubble1_time || '7AM'}
                                onChange={(e) => setEditingItem({...editingItem, chat_bubble1_time: e.target.value} as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="7AM"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                對話內容
                              </label>
                              <textarea
                                value={(editingItem as any).chat_bubble1_message || '公司內部行銷人力不足'}
                                onChange={(e) => setEditingItem({...editingItem, chat_bubble1_message: e.target.value} as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={2}
                                placeholder="公司內部行銷人力不足"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Avatar 2 - 十三洋行 */}
                      <div className="bg-white border-2 border-red-400 rounded-lg p-4">
                        <label className="block text-sm font-medium text-red-700 mb-3">
                          <i className="ri-user-line mr-1"></i>
                          右側聊天氣泡頭像 (十三洋行)
                          <span className="text-red-500">*</span>
                          <span className="text-xs text-red-600 block mt-1">（目前顯示在右下角聊天氣泡中的男性頭像）</span>
                        </label>
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && editingItem) {
                                handleImageUpload(file, editingItem.id, 'avatar2_url');
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-700 hover:file:bg-red-200"
                            disabled={uploadingImages[editingItem?.id || '']}
                          />
                          <input
                            type="text"
                            value={editingItem.avatar2_url || ''}
                            onChange={(e) => setEditingItem({...editingItem, avatar2_url: e.target.value})}
                            className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                            placeholder="或輸入頭像圖片網址"
                          />
                          {uploadingImages[editingItem?.id || ''] && (
                            <div className="text-sm text-red-600">
                              <i className="ri-loader-4-line animate-spin mr-1"></i>
                              上傳中...
                            </div>
                          )}
                          {editingItem.avatar2_url && (
                            <div className="flex items-center space-x-3">
                              <img src={editingItem.avatar2_url} alt="十三洋行頭像" className="w-16 h-16 object-cover rounded-full border-2 border-red-300" />
                              <div className="text-sm text-red-700">
                                <p className="font-medium">預覽效果</p>
                                <p className="text-xs">圓形頭像，顯示在右側聊天氣泡</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* 聊天氣泡2文字內容 */}
                        <div className="mt-6 pt-4 border-t border-red-300">
                          <h5 className="font-medium text-red-700 mb-3">
                            <i className="ri-chat-3-line mr-1"></i>
                            右側聊天氣泡對話內容
                          </h5>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                顯示名稱
                              </label>
                              <input
                                type="text"
                                value={(editingItem as any).chat_bubble2_name || '十三洋行'}
                                onChange={(e) => setEditingItem({...editingItem, chat_bubble2_name: e.target.value} as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="十三洋行"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                時間顯示
                              </label>
                              <input
                                type="text"
                                value={(editingItem as any).chat_bubble2_time || '9AM'}
                                onChange={(e) => setEditingItem({...editingItem, chat_bubble2_time: e.target.value} as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="9AM"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                對話內容
                              </label>
                              <textarea
                                value={(editingItem as any).chat_bubble2_message || '沒問題!我們可以提供整合解決方案'}
                                onChange={(e) => setEditingItem({...editingItem, chat_bubble2_message: e.target.value} as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={2}
                                placeholder="沒問題!我們可以提供整合解決方案"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <i className="ri-lightbulb-line mr-1"></i>
                        <strong>提示：</strong>建議使用正方形的專業頭像照片，系統會自動裁切成圓形顯示。圖片尺寸建議 100x100 像素以上。
                      </p>
                    </div>
                  </div>

                  {/* 主要展示圖片 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      <i className="ri-image-line mr-1"></i>
                      主要展示圖片
                      <span className="text-xs text-blue-600 block">（右側顯示的主要產品展示圖片）</span>
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && editingItem) {
                            handleImageUpload(file, editingItem.id, 'main_display_image_url');
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                        disabled={uploadingImages[editingItem?.id || '']}
                      />
                      <input
                        type="text"
                        value={editingItem.main_display_image_url || ''}
                        onChange={(e) => setEditingItem({...editingItem, main_display_image_url: e.target.value})}
                        className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50"
                        placeholder="或輸入主要展示圖片網址"
                      />
                      {uploadingImages[editingItem?.id || ''] && (
                        <div className="text-sm text-blue-600">
                          <i className="ri-loader-4-line animate-spin mr-1"></i>
                          上傳中...
                        </div>
                      )}
                    </div>
                    {editingItem.main_display_image_url && (
                      <img src={editingItem.main_display_image_url} alt="主要展示圖片" className="mt-2 w-48 h-32 object-cover rounded" />
                    )}
                  </div>
                </div>
              )}

              {/* 團隊介紹頁面專用欄位 */}
              {editingItem.section_key === 'team' && (
                <div className="space-y-6 border-t pt-6">
                  <h4 className="font-medium text-gray-700 text-red-600">
                    <i className="ri-team-line mr-2"></i>
                    團隊介紹區塊 - 主標題與副標題設定
                  </h4>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm mb-4">
                      <i className="ri-information-line mr-1"></i>
                      這裡可以編輯團隊介紹區塊的主標題和副標題內容
                    </p>
                    
                    {/* 主標題和副標題設定 */}
                    <div className="grid md:grid-cols-1 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          區塊主標題
                          <span className="text-red-500">*</span>
                          <span className="text-xs text-gray-500 block">（目前顯示在頁面上的大標題）</span>
                        </label>
                        <input
                          type="text"
                          value={editingItem.title || '專業服務團隊'}
                          onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="專業服務團隊"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          區塊副標題
                          <span className="text-red-500">*</span>
                          <span className="text-xs text-gray-500 block">（目前顯示在主標題下方的描述文字）</span>
                        </label>
                        <textarea
                          value={editingItem.subtitle || '我們擁有完整的專業團隊，為您提供全方位的服務解決方案'}
                          onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="我們擁有完整的專業團隊，為您提供全方位的服務解決方案"
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* 團隊優勢設定 */}
                    <div className="mb-6 bg-white rounded-lg p-4 border-2 border-red-300">
                      <h5 className="font-medium text-gray-800 mb-4 text-red-600">
                        <i className="ri-award-line mr-2"></i>
                        團隊優勢卡片內容
                      </h5>
                      
                      <div className="space-y-4">
                        {/* 優勢1 */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              優勢1 - 標題
                              <span className="text-xs text-gray-500 block">（目前：豐富經驗）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).advantage1_title || '豐富經驗'}
                              onChange={(e) => setEditingItem({...editingItem, advantage1_title: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="豐富經驗"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              優勢1 - 描述
                              <span className="text-xs text-gray-500 block">（目前：十年以上專業服務經驗，成功服務近2000家客戶）</span>
                            </label>
                            <textarea
                              value={(editingItem as any).advantage1_description || '十年以上專業服務經驗，成功服務近2000家客戶'}
                              onChange={(e) => setEditingItem({...editingItem, advantage1_description: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              rows={2}
                              placeholder="十年以上專業服務經驗，成功服務近2000家客戶"
                            />
                          </div>
                        </div>

                        {/* 優勢2 */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              優勢2 - 標題
                              <span className="text-xs text-gray-500 block">（目前：專業背景）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).advantage2_title || '專業背景'}
                              onChange={(e) => setEditingItem({...editingItem, advantage2_title: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="專業背景"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              優勢2 - 描述
                              <span className="text-xs text-gray-500 block">（目前：專業級團隊，具備深厚的理論基礎與實戰經驗）</span>
                            </label>
                            <textarea
                              value={(editingItem as any).advantage2_description || '專業級團隊，具備深厚的理論基礎與實戰經驗'}
                              onChange={(e) => setEditingItem({...editingItem, advantage2_description: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              rows={2}
                              placeholder="專業級團隊，具備深厚的理論基礎與實戰經驗"
                            />
                          </div>
                        </div>

                        {/* 優勢3 */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              優勢3 - 標題
                              <span className="text-xs text-gray-500 block">（目前：品質保證）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).advantage3_title || '品質保證'}
                              onChange={(e) => setEditingItem({...editingItem, advantage3_title: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="品質保證"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              優勢3 - 描述
                              <span className="text-xs text-gray-500 block">（目前：認真負責的服務態度，確保每個專案都能達到最佳效果）</span>
                            </label>
                            <textarea
                              value={(editingItem as any).advantage3_description || '認真負責的服務態度，確保每個專案都能達到最佳效果'}
                              onChange={(e) => setEditingItem({...editingItem, advantage3_description: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              rows={2}
                              placeholder="認真負責的服務態度，確保每個專案都能達到最佳效果"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 服務承諾設定 */}
                    <div className="mb-6 bg-white rounded-lg p-4 border-2 border-red-300">
                      <h5 className="font-medium text-gray-800 mb-4 text-red-600">
                        <i className="ri-shield-check-line mr-2"></i>
                        服務承諾卡片內容
                      </h5>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            服務承諾標題
                            <span className="text-xs text-gray-500 block">（目前：服務承諾）</span>
                          </label>
                          <input
                            type="text"
                            value={(editingItem as any).commitment_title || '服務承諾'}
                            onChange={(e) => setEditingItem({...editingItem, commitment_title: e.target.value} as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="服務承諾"
                          />
                        </div>

                        {/* 承諾項目 */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              承諾1
                              <span className="text-xs text-gray-500 block">（目前：專業諮詢與策略規劃）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).commitment1 || '專業諮詢與策略規劃'}
                              onChange={(e) => setEditingItem({...editingItem, commitment1: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="專業諮詢與策略規劃"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              承諾2
                              <span className="text-xs text-gray-500 block">（目前：快速響應與執行）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).commitment2 || '快速響應與執行'}
                              onChange={(e) => setEditingItem({...editingItem, commitment2: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="快速響應與執行"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              承諾3
                              <span className="text-xs text-gray-500 block">（目前：定期成效追蹤與優化）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).commitment3 || '定期成效追蹤與優化'}
                              onChange={(e) => setEditingItem({...editingItem, commitment3: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="定期成效追蹤與優化"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              承諾4
                              <span className="text-xs text-gray-500 block">（目前：透明化報告與溝通）</span>
                            </label>
                            <input
                              type="text"
                              value={(editingItem as any).commitment4 || '透明化報告與溝通'}
                              onChange={(e) => setEditingItem({...editingItem, commitment4: e.target.value} as any)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="透明化報告與溝通"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 團隊主要圖片 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        團隊主要圖片
                        <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 block">（右側顯示的團隊會議圖片）</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'image_url');
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={editingItem.image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="或輸入圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-red-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {editingItem.image_url && (
                        <img src={editingItem.image_url} alt="團隊主要圖片" className="mt-2 w-48 h-32 object-cover rounded" />
                      )}
                    </div>

                    {/* 背景圖片設定 */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        區塊背景圖片
                        <span className="text-xs text-gray-500 block">（可選，整個區塊的背景圖片）</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'secondary_image_url');
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={editingItem.secondary_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, secondary_image_url: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="或輸入背景圖片網址"
                        />
                      </div>
                      {editingItem.secondary_image_url && (
                        <img src={editingItem.secondary_image_url} alt="背景圖片" className="mt-2 w-48 h-32 object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 聯絡我們頁面專用欄位 */}
              {editingItem.section_key === 'contact' && (
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-700 text-red-600">
                    <i className="ri-image-line mr-2"></i>
                    聯絡我們區塊 - 左側圖片內容設定
                  </h4>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm mb-4">
                      <i className="ri-information-line mr-1"></i>
                      這裡可以編輯聯絡我們區塊左側圖片上顯示的標題和描述文字
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          左側圖片標題
                          <span className="text-red-500">*</span>
                          <span className="text-xs text-gray-500 block">（目前：預約企業行銷健檢）</span>
                        </label>
                        <input
                          type="text"
                          value={editingItem.subtitle || ''}
                          onChange={(e) => setEditingItem({...editingItem, subtitle: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="預約企業行銷健檢"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          左側圖片描述文字
                          <span className="text-red-500">*</span>
                          <span className="text-xs text-gray-500 block">（目前：專業團隊為您提供免費諮詢服務）</span>
                        </label>
                        <input
                          type="text"
                          value={editingItem.content || ''}
                          onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="專業團隊為您提供免費諮詢服務"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        左側背景圖片
                        <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 block">（辦公大樓圖片）</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'image_url');
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={editingItem.image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, image_url: e.target.value})}
                          className="w-full px-3 py-2 border-2 border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-red-50"
                          placeholder="或輸入圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-red-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {editingItem.image_url && (
                        <img src={editingItem.image_url} alt="聯絡我們背景圖片" className="mt-2 w-48 h-32 object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 關於我們頁面專用欄位 */}
              {editingItem.section_key === 'about' && (
                <div className="space-y-6 border-t pt-6">
                  <h4 className="font-medium text-gray-700 text-red-600">
                    <i className="ri-image-line mr-2"></i>
                    特色卡片圖片設定 (滑鼠懸停效果圖片)
                  </h4>
                  
                  {/* 特色1圖片 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特色1 - 正常顯示圖片
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'feature1_image_url' as any);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={(editingItem as any).feature1_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, feature1_image_url: e.target.value} as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="或輸入圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {(editingItem as any).feature1_image_url && (
                        <img src={(editingItem as any).feature1_image_url} alt="特色1圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特色1 - 滑鼠懸停圖片
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'feature1_hover_image_url' as any);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={(editingItem as any).feature1_hover_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, feature1_hover_image_url: e.target.value} as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="或輸入懸停時顯示的圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {(editingItem as any).feature1_hover_image_url && (
                        <img src={(editingItem as any).feature1_hover_image_url} alt="特色1懸停圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>
                  </div>

                  {/* 特色2圖片 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特色2 - 正常顯示圖片
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'feature2_image_url' as any);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={(editingItem as any).feature2_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, feature2_image_url: e.target.value} as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="或輸入圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {(editingItem as any).feature2_image_url && (
                        <img src={(editingItem as any).feature2_image_url} alt="特色2圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特色2 - 滑鼠懸停圖片
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'feature2_hover_image_url' as any);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={(editingItem as any).feature2_hover_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, feature2_hover_image_url: e.target.value} as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="或輸入懸停時顯示的圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {(editingItem as any).feature2_hover_image_url && (
                        <img src={(editingItem as any).feature2_hover_image_url} alt="特色2懸停圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>
                  </div>

                  {/* 特色3圖片 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特色3 - 正常顯示圖片
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'feature3_image_url' as any);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={(editingItem as any).feature3_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, feature3_image_url: e.target.value} as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="或輸入圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {(editingItem as any).feature3_image_url && (
                        <img src={(editingItem as any).feature3_image_url} alt="特色3圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        特色3 - 滑鼠懸停圖片
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && editingItem) {
                              handleImageUpload(file, editingItem.id, 'feature3_hover_image_url' as any);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          disabled={uploadingImages[editingItem?.id || '']}
                        />
                        <input
                          type="text"
                          value={(editingItem as any).feature3_hover_image_url || ''}
                          onChange={(e) => setEditingItem({...editingItem, feature3_hover_image_url: e.target.value} as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="或輸入懸停時顯示的圖片網址"
                        />
                        {uploadingImages[editingItem?.id || ''] && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                      </div>
                      {(editingItem as any).feature3_hover_image_url && (
                        <img src={(editingItem as any).feature3_hover_image_url} alt="特色3懸停圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 按鈕設定 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">按鈕文字</label>
                  <input
                    type="text"
                    value={editingItem.button_text || ''}
                    onChange={(e) => setEditingItem({...editingItem, button_text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">按鈕連結</label>
                  <input
                    type="text"
                    value={editingItem.button_url || ''}
                    onChange={(e) => setEditingItem({...editingItem, button_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 顏色設定 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文字顏色</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingItem.text_color?.startsWith('#') ? editingItem.text_color : '#000000'}
                      onChange={(e) => setEditingItem({...editingItem, text_color: e.target.value})}
                      className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingItem.text_color || ''}
                      onChange={(e) => setEditingItem({...editingItem, text_color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: #000000 或 text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">背景顏色</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingItem.background_color?.startsWith('#') ? editingItem.background_color : '#ffffff'}
                      onChange={(e) => setEditingItem({...editingItem, background_color: e.target.value})}
                      className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingItem.background_color || ''}
                      onChange={(e) => setEditingItem({...editingItem, background_color: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如: #ffffff 或 from-teal-400 to-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* 樣式設定 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文字大小</label>
                  <select
                    value={editingItem.text_size || 'text-base'}
                    onChange={(e) => setEditingItem({...editingItem, text_size: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text-xs">極小 (12px)</option>
                    <option value="text-sm">小 (14px)</option>
                    <option value="text-base">正常 (16px)</option>
                    <option value="text-lg">大 (18px)</option>
                    <option value="text-xl">極大 (20px)</option>
                    <option value="text-2xl">超大 (24px)</option>
                    <option value="text-3xl">巨大 (30px)</option>
                    <option value="text-4xl">特大 (36px)</option>
                    <option value="text-5xl">超特大 (48px)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文字陰影</label>
                  <select
                    value={editingItem.text_shadow || 'none'}
                    onChange={(e) => setEditingItem({...editingItem, text_shadow: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">無陰影</option>
                    <option value="drop-shadow-sm">淺陰影</option>
                    <option value="drop-shadow">正常陰影</option>
                    <option value="drop-shadow-md">中等陰影</option>
                    <option value="drop-shadow-lg">深陰影</option>
                    <option value="drop-shadow-xl">超深陰影</option>
                  </select>
                </div>
              </div>

              {/* 圖片上傳 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">其他圖片設定</h4>
                
                {/* 背景圖片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    背景圖片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'image_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.image_url && (
                    <img src={editingItem.image_url} alt="背景圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>

                {/* 次要圖片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    次要圖片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'secondary_image_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.secondary_image_url && (
                    <img src={editingItem.secondary_image_url} alt="次要圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>
              </div>

              {/* 圖片上傳 */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">圖片設定</h4>
                
                {/* 背景圖片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    背景圖片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'image_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.image_url && (
                    <img src={editingItem.image_url} alt="背景圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>

                {/* 次要圖片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    次要圖片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'secondary_image_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.secondary_image_url && (
                    <img src={editingItem.secondary_image_url} alt="次要圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>

                {/* 主要展示圖片 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    主要展示圖片
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'main_display_image_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.main_display_image_url && (
                    <img src={editingItem.main_display_image_url} alt="主要展示圖片" className="mt-2 w-32 h-20 object-cover rounded" />
                  )}
                </div>

                {/* Avatar 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    頭像圖片 1 (Clara)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'avatar1_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.avatar1_url && (
                    <img src={editingItem.avatar1_url} alt="頭像圖片 1" className="mt-2 w-12 h-12 object-cover rounded-full" />
                  )}
                </div>

                {/* Avatar 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    頭像圖片 2 (十三洋行)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && editingItem) {
                        handleImageUpload(file, editingItem.id, 'avatar2_url');
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editingItem.avatar2_url && (
                    <img src={editingItem.avatar2_url} alt="頭像圖片 2" className="mt-2 w-12 h-12 object-cover rounded-full" />
                  )}
                </div>
              </div>

              {/* 其他設定 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">顯示順序</label>
                  <input
                    type="number"
                    value={editingItem.display_order || 1}
                    onChange={(e) => setEditingItem({...editingItem, display_order: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">是否啟用</label>
                  <select
                    value={editingItem.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({...editingItem, is_active: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">啟用</option>
                    <option value="false">停用</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => updateContent(editingItem)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
                disabled={uploading}
              >
                {uploading ? '處理中...' : '儲存變更'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 導航選單編輯彈窗 */}
      {showNavigationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingNavigation ? '編輯導航項目' : '新增導航項目'}
            </h3>
            <form onSubmit={handleNavigationSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    項目名稱 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingNavigation?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：關於我們"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    連結網址 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="url"
                    defaultValue={editingNavigation?.url || ''}
                    placeholder="例如: /about 或 https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    內部頁面使用 /about 格式，外部網站使用完整網址
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    排序順序
                  </label>
                  <input
                    type="number"
                    name="order_index"
                    defaultValue={editingNavigation?.order_index || navigationItems.length + 1}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    數字越小越靠前顯示
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={editingNavigation?.is_active !== false}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    在前台顯示此導航項目
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowNavigationModal(false);
                    setEditingNavigation(null);
                  }}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {uploading ? '處理中...' : (editingNavigation ? '更新項目' : '新增項目')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 網站設定編輯彈窗 */}
      {showWebsiteSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">編輯網站設定</h3>
            <form onSubmit={handleWebsiteSettingsSubmit}>
              <div className="space-y-6">
                {/* Logo設定區塊 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-4">
                    <i className="ri-image-line mr-2"></i>
                    Logo設定
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo主標題 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="logo_text"
                        defaultValue={websiteSettings.logo_text}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="例如：十三洋行"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo副標題 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="logo_subtitle"
                        defaultValue={websiteSettings.logo_subtitle}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="例如：共享廚房"
                        required
                      />
                    </div>

                    {/* 新增 LOGO 大小選擇 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo圖片大小
                      </label>
                      <select
                        name="logo_size"
                        value={websiteSettings.logo_size || 'w-12 h-12'}
                        onChange={(e) => setWebsiteSettings(prev => ({
                          ...prev,
                          logo_size: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="w-8 h-8">極小 (32px)</option>
                        <option value="w-10 h-10">小 (40px)</option>
                        <option value="w-12 h-12">正常 (48px)</option>
                        <option value="w-14 h-14">中等 (56px)</option>
                        <option value="w-16 h-16">大 (64px)</option>
                        <option value="w-20 h-20">極大 (80px)</option>
                        <option value="w-24 h-24">超大 (96px)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        選擇 Logo 圖片的顯示大小
                      </p>
                    </div>

                    {/* 新增導航列高度選擇 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        導航列高度
                      </label>
                      <select
                        name="header_height"
                        value={websiteSettings.header_height || 'py-4'}
                        onChange={(e) => setWebsiteSettings(prev => ({
                          ...prev,
                          header_height: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="py-2">極小 (上下各 8px)</option>
                        <option value="py-3">小 (上下各 12px)</option>
                        <option value="py-4">正常 (上下各 16px)</option>
                        <option value="py-5">中等 (上下各 20px)</option>
                        <option value="py-6">大 (上下各 24px)</option>
                        <option value="py-8">極大 (上下各 32px)</option>
                        <option value="py-10">超大 (上下各 40px)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        調整導航列的上下內距，數值越大導航列越高
                      </p>
                    </div>
                    
                    {/* Logo圖片上傳 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo圖片上傳
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setUploading(true);
                                
                                const formData = new FormData();
                                formData.append('file', file);

                                const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/upload-image`, {
                                  method: 'POST',
                                  headers: {
                                    'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
                                  },
                                  body: formData,
                                });

                                if (!response.ok) {
                                  throw new Error('上傳失敗');
                                }

                                const data = await response.json();
                                
                                // 更新Logo圖片URL輸入框的值
                                const logoInput = document.querySelector('input[name="logo_image_url"]') as HTMLInputElement;
                                if (logoInput) {
                                  logoInput.value = data.url;
                                  logoInput.dispatchEvent(new Event('input', { bubbles: true }));
                                }
                                
                                alert('Logo圖片上傳成功！');
                              } catch (error) {
                                console.error('Logo圖片上傳錯誤:', error);
                                alert('Logo圖片上傳失敗，請重試');
                              } finally {
                                setUploading(false);
                              }
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                          disabled={uploading}
                        />
                        
                        <input
                          type="url"
                          name="logo_image_url"
                          value={websiteSettings.logo_image_url || ''}
                          onChange={(e) => setWebsiteSettings(prev => ({
                            ...prev,
                            logo_image_url: e.target.value
                          }))}
                          placeholder="或輸入Logo圖片網址"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            const previewContainer = document.getElementById('logo-preview');
                            const sizeSelect = document.querySelector('select[name="logo_size"]') as HTMLSelectElement;
                            const logoSize = sizeSelect?.value || 'w-12 h-12';
                            
                            if (previewContainer && target.value) {
                              previewContainer.innerHTML = `
                                <div class="flex items-center space-x-3">
                                  <img src="${target.value}" alt="Logo預覽" class="${logoSize} object-cover rounded-full border-2 border-blue-300" onerror="this.style.display='none'" />
                                  <div class="text-sm text-blue-700">
                                    <p class="font-medium">Logo預覽</p>
                                    <p class="text-xs">圓形Logo，顯示在導航列中</p>
                                  </div>
                                </div>
                              `;
                            } else if (previewContainer) {
                              previewContainer.innerHTML = '';
                            }
                          }}
                        />
                        
                        {uploading && (
                          <div className="text-sm text-blue-600">
                            <i className="ri-loader-4-line animate-spin mr-1"></i>
                            上傳中...
                          </div>
                        )}
                        
                        {/* Logo預覽 */}
                        <div id="logo-preview">
                          {websiteSettings.logo_image_url && (
                            <div className="flex items-center space-x-3">
                              <img 
                                src={websiteSettings.logo_image_url} 
                                alt="Logo預覽" 
                                className={`${websiteSettings.logo_size || 'w-12 h-12'} object-cover rounded-full border-2 border-blue-300`}
                              />
                              <div className="text-sm text-blue-700">
                                <p className="font-medium">Logo預覽</p>
                                <p className="text-xs">圓形Logo，顯示在導航列中</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          留空則顯示預設的「13」圓形圖示。建議使用正方形圖片，系統會自動裁切成圓形。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 聯絡資訊設定區塊 */}
                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-4">
                    <i className="ri-contacts-line mr-2"></i>
                    聯絡資訊設定
                    <span className="text-sm text-orange-600 block mt-1">（這裡的設定會即時更新到前台聯絡我們區塊）</span>
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        聯絡地址 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contact_address"
                        defaultValue={websiteSettings.contact_address || ''}
                        className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                        placeholder="例如：220 新北市板橋區文化路二段331號6樓"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          聯絡電話 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contact_phone"
                          defaultValue={websiteSettings.contact_phone || ''}
                          className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                          placeholder="例如：02-8252-0008"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          聯絡 Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="contact_email"
                          defaultValue={websiteSettings.contact_email || ''}
                          className="w-full px-3 py-2 border-2 border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50"
                          placeholder="例如：service@13ocean.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Facebook 連結
                        </label>
                        <input
                          type="url"
                          value={websiteSettings.contact_facebook_url || ''}
                          onChange={(e) => setWebsiteSettings(prev => ({
                            ...prev,
                            contact_facebook_url: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://www.facebook.com/yourpage"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram 連結
                        </label>
                        <input
                          type="url"
                          value={websiteSettings.contact_instagram_url || ''}
                          onChange={(e) => setWebsiteSettings(prev => ({
                            ...prev,
                            contact_instagram_url: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://www.instagram.com/yourpage"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          官方 LINE 連結
                        </label>
                        <input
                          type="url"
                          value={websiteSettings.contact_line_url || ''}
                          onChange={(e) => setWebsiteSettings(prev => ({
                            ...prev,
                            contact_line_url: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://line.me/ti/p/your-line-id"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Google 地圖嵌入網址
                        </label>
                        <input
                          type="url"
                          value={websiteSettings.contact_map_embed_url || ''}
                          onChange={(e) => setWebsiteSettings(prev => ({
                            ...prev,
                            contact_map_embed_url: e.target.value
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Google 地圖的嵌入網址"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 導航列顏色設定 */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-4">
                    <i className="ri-palette-line mr-2"></i>
                    導航列顏色設定
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        導航列背景顏色
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="header_bg_color_picker"
                          defaultValue="#3B82F6"
                          onChange={(e) => {
                            const headerBgInput = document.querySelector('input[name="header_bg_color"]') as HTMLInputElement;
                            if (headerBgInput) {
                              headerBgInput.value = e.target.value;
                            }
                          }}
                          className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          name="header_bg_color"
                          defaultValue={websiteSettings.header_bg_color || 'from-blue-500 to-blue-600'}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="例如: from-blue-500 to-blue-600 或 #3B82F6"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        可使用Tailwind漸層類別（如：from-blue-500 to-blue-600）或十六進位顏色碼
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        導航文字顏色
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="header_text_color_picker"
                          defaultValue="#FFFFFF"
                          onChange={(e) => {
                            const headerTextInput = document.querySelector('input[name="header_text_color"]') as HTMLInputElement;
                            if (headerTextInput) {
                              headerTextInput.value = e.target.value;
                            }
                          }}
                          className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          name="header_text_color"
                          defaultValue={websiteSettings.header_text_color || 'text-white'}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="例如: text-white 或 #FFFFFF"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        可使用Tailwind文字顏色類別（如：text-white）或十六進位顏色碼
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        按鈕背景顏色
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="button_bg_color_picker"
                          defaultValue="#10B981"
                          onChange={(e) => {
                            const buttonBgInput = document.querySelector('input[name="button_bg_color"]') as HTMLInputElement;
                            if (buttonBgInput) {
                              buttonBgInput.value = e.target.value;
                            }
                          }}
                          className="w-16 h-10 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <input
                          type="text"
                          name="button_bg_color"
                          defaultValue={websiteSettings.button_bg_color || 'bg-green-600 hover:bg-green-700'}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="例如: bg-green-600 hover:bg-green-700"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        免費諮詢按鈕的背景顏色，可包含hover效果
                      </p>
                    </div>
                  </div>
                </div>

                {/* 顏色預覽 */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-4">
                    <i className="ri-eye-line mr-2"></i>
                    導航列預覽效果
                  </h4>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`${websiteSettings.logo_size || 'w-12 h-12'} bg-black rounded-full flex items-center justify-center`}>
                          {websiteSettings.logo_image_url ? (
                            <img 
                              src={websiteSettings.logo_image_url} 
                              alt="Logo" 
                              className={`${websiteSettings.logo_size || 'w-12 h-12'} object-cover rounded-full`}
                            />
                          ) : (
                            <span className="text-white font-bold">13</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{websiteSettings.logo_text}</p>
                          <p className="text-sm opacity-90">{websiteSettings.logo_subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="hover:opacity-80 cursor-pointer">首頁</span>
                        <span className="hover:opacity-80 cursor-pointer">關於我們</span>
                        <span className="hover:opacity-80 cursor-pointer">服務項目</span>
                        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm">
                          免費諮詢
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    這是導航列的預覽效果，實際顏色會根據您的設定調整
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowWebsiteSettingsModal(false)}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                >
                  {uploading ? '處理中...' : '儲存變更'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 服務項目管理區塊 */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              🛠️ 服務項目管理
            </h3>
            <button
              onClick={() => {
                setEditingService(null);
                setShowServiceModal(true);
              }}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200"
            >
              新增服務
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <i className={`${service.icon_class} text-xl text-teal-600 mr-2`}></i>
                    <h4 className="font-medium text-gray-900">{service.title}</h4>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleToggleServiceStatus(service.id, service.is_active)}
                      className={`px-2 py-1 text-xs rounded ${
                        service.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.is_active ? '啟用' : '停用'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">順序: {service.display_order}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setShowServiceModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 服務編輯彈窗 */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingService ? '編輯服務項目' : '新增服務項目'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const serviceData = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  icon_class: formData.get('icon_class') as string,
                  display_order: parseInt(formData.get('display_order') as string),
                  is_active: formData.get('is_active') === 'on'
                };
                handleSaveService(serviceData);
              }}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      服務名稱
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingService?.title || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      服務描述
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={editingService?.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      圖示類別 (Remix Icon)
                    </label>
                    <input
                      type="text"
                      name="icon_class"
                      defaultValue={editingService?.icon_class || 'ri-service-line'}
                      placeholder="例如: ri-user-star-line"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      請使用 Remix Icon 的類別名稱，例如: ri-user-star-line
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      顯示順序
                    </label>
                    <input
                      type="number"
                      name="display_order"
                      defaultValue={editingService?.display_order || services.length + 1}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={editingService?.is_active !== false}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      啟用此服務項目
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceModal(false);
                      setEditingService(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700"
                  >
                    {editingService ? '更新' : '新增'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editingSection === 'services' && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">編輯服務介紹</h3>
              <button
                onClick={() => setEditingSection(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* 服務區塊標題和副標題 */}
              <div className="border-2 border-red-200 bg-red-50 p-4 rounded-lg">
                <h4 className="font-bold text-red-700 mb-4">服務介紹區塊 - 主標題與副標題設定</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      區塊主標題
                    </label>
                    <input
                      type="text"
                      value={editData.sectionInfo?.title || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        sectionInfo: {
                          ...editData.sectionInfo,
                          title: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="例如：專業服務團隊"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      區塊副標題
                    </label>
                    <textarea
                      value={editData.sectionInfo?.subtitle || ''}
                      onChange={(e) => setEditData({
                        ...editData,
                        sectionInfo: {
                          ...editData.sectionInfo,
                          subtitle: e.target.value
                        }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="例如：我們擁有完整的行銷專業團隊，為您提供全方位的行銷解決方案"
                    />
                  </div>
                </div>
              </div>

              {/* 服務項目列表 */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">服務項目管理</h4>
                <div className="space-y-4">
                  {editData.services?.map((service: any, index: number) => (
                    <div key={service.id} className="border border-gray-200 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            服務標題
                          </label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e: any) => {
                              const updatedServices = [...editData.services];
                              updatedServices[index].title = e.target.value;
                              setEditData({
                                ...editData,
                                services: updatedServices
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            圖示類別
                          </label>
                          <input
                            type="text"
                            value={service.icon_class}
                            onChange={(e: any) => {
                              const updatedServices = [...editData.services];
                              updatedServices[index].icon_class = e.target.value;
                              setEditData({
                                ...editData,
                                services: updatedServices
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="例如：ri-palette-line"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          服務描述
                        </label>
                        <textarea
                          value={service.description}
                          onChange={(e: any) => {
                            const updatedServices = [...editData.services];
                            updatedServices[index].description = e.target.value;
                            setEditData({
                              ...editData,
                              services: updatedServices
                            });
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div className="mt-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={service.is_active}
                          onChange={(e: any) => {
                            const updatedServices = [...editData.services];
                            updatedServices[index].is_active = e.target.checked;
                            setEditData({
                              ...editData,
                              services: updatedServices
                            });
                          }}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700">啟用此服務項目</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveSection}
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
