import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('開始處理圖片上傳請求')
    
    // 使用 Service Role Key 創建 Supabase 客戶端
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('Supabase 客戶端創建成功')

    // 解析表單數據
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.error('沒有找到文件')
      return new Response(
        JSON.stringify({ error: '沒有找到文件' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`文件信息: 名稱=${file.name}, 大小=${file.size}, 類型=${file.type}`)

    // 檢查文件類型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      console.error(`不支持的文件類型: ${file.type}`)
      return new Response(
        JSON.stringify({ error: '不支持的文件類型。請上傳 JPEG、PNG、WebP 或 GIF 格式的圖片。' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 檢查文件大小 (5MB 限制)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.error(`文件太大: ${file.size} bytes`)
      return new Response(
        JSON.stringify({ error: '文件太大。請上傳小於 5MB 的圖片。' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 生成唯一文件名
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    console.log(`生成的文件名: ${fileName}`)

    // 將文件轉換為 ArrayBuffer
    const fileBuffer = await file.arrayBuffer()
    console.log(`文件轉換為 ArrayBuffer 成功，大小: ${fileBuffer.byteLength} bytes`)

    // 上傳文件到 Supabase Storage
    console.log('開始上傳文件到 Storage')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('上傳文件失敗:', uploadError)
      return new Response(
        JSON.stringify({ error: `上傳失敗: ${uploadError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('文件上傳成功:', uploadData)

    // 獲取公開 URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    console.log('獲取公開 URL 成功:', urlData.publicUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: urlData.publicUrl,
        fileName: fileName
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('處理請求時發生錯誤:', error)
    return new Response(
      JSON.stringify({ error: `服務器錯誤: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})