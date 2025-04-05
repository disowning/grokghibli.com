import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';
import { tokenManager, type HuggingFaceToken } from '@/lib/token-manager';

// 设置最大超时时间（符合Vercel Hobby计划限制）
export const maxDuration = 60; // 60秒超时

export async function POST(request: NextRequest) {
  let startTime = Date.now();
  let usedToken: HuggingFaceToken | null = null;
  
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string || "Ghibli Studio style, colorful landscape";
    const height = Number(formData.get('height')) || 512;
    const width = Number(formData.get('width')) || 512;
    const seed = Number(formData.get('seed')) || 42;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // 从 Token 管理器获取一个可用的 token
    usedToken = tokenManager.getToken();
    
    if (!usedToken) {
      console.error('所有 Token 已达到使用限制，无法继续处理请求');
      return NextResponse.json(
        { error: '服务暂时不可用，所有 API 配额已用完，请稍后再试' },
        { status: 503 }
      );
    }
    
    // 开始记录 token 使用
    tokenManager.startUsingToken(usedToken);

    // 连接到Gradio客户端
    const spaceUrl = "https://jamesliu1217-easycontrol-ghibli.hf.space/";

    console.log('Connecting to Gradio API...', { 
      spaceUrl,
      tokenPrefix: usedToken.substring(0, 10) + '...'
    });
    
    const client = await Client.connect(spaceUrl, {
      hf_token: usedToken
    });

    // 准备图片数据
    const arrayBuffer = await imageFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: imageFile.type });

    // 设置API调用参数
    const params = {
      prompt: prompt,
      spatial_img: blob,
      height: height,
      width: width,
      seed: seed,
      control_type: "Ghibli"
    };

    console.log('Sending request to generate image...', {
      prompt,
      height,
      width,
      seed
    });

    // 调用API
    const result = await client.predict("/single_condition_generate_image", params);

    if (Array.isArray(result.data) && result.data.length > 0 && result.data[0].url) {
      console.log('Downloading generated image...');
      const imageUrl = result.data[0].url;
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const imageData = await response.arrayBuffer();
      
      // 记录 token 成功使用时间
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      tokenManager.finishUsingToken(usedToken, elapsedSeconds);
      
      console.log(`图片处理完成，耗时 ${elapsedSeconds.toFixed(1)} 秒`);
      
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': 'image/webp',
        },
      });
    } else {
      throw new Error('No valid image URL found in the response');
    }

  } catch (error: any) {
    console.error('Error processing image:', error);
    
    // 如果使用了 token 但失败了，释放该 token（不计入使用时间）
    if (usedToken) {
      tokenManager.releaseToken(usedToken);
    }
    
    // 详细的错误信息
    let errorMessage = error.message;
    if (error.message?.includes("metadata could not be loaded")) {
      errorMessage = "API connection failed. Please check API status or try again later.";
    } else if (error.message?.includes("fetch failed")) {
      errorMessage = "Network connection error. Please check your internet connection.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 