import { NextRequest, NextResponse } from 'next/server';
import { tokenManager, type HuggingFaceToken } from '@/lib/token-manager';
import { saveTaskStatus } from '@/lib/cache-service';

// 设置最大超时时间（符合Vercel Hobby计划限制）
export const maxDuration = 60; // 60 seconds timeout

// 任务类型定义
export type ProcessingTask = {
  status: 'processing' | 'completed' | 'failed',
  result?: ArrayBuffer,
  resultImage?: ArrayBuffer,
  error?: string,
  startTime: number,
  token: HuggingFaceToken,
  progress?: number
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  let taskId: string | null = null;
  
  try {
    const imageFile = formData.get('image') as File;
    const prompt = formData.get('prompt') as string || "Ghibli Studio style, colorful landscape";
    const height = Number(formData.get('height')) || 512;
    const width = Number(formData.get('width')) || 512;
    const seed = Number(formData.get('seed')) || 42;
    
    if (!imageFile) {
      console.error('No image file provided in request');
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // 从 Token 管理器获取可用token
    const usedToken = tokenManager.getToken();
    
    if (!usedToken) {
      console.error('All tokens have reached usage limits, cannot process requests');
      return NextResponse.json(
        { error: 'Service temporarily unavailable. All API quota used. Please try again later.' },
        { status: 503 }
      );
    }
    
    // 创建任务ID
    taskId = generateTaskId();
    console.log(`Created task ID: ${taskId}`);
    
    // 记录任务开始
    const taskData = {
      status: 'processing' as const,
      startTime: Date.now(),
      token: usedToken,
      progress: 0,
      prompt
    };
    
    // 保存任务状态到Redis
    console.log(`Saving initial task status to Redis for task ${taskId}`);
    await saveTaskStatus(taskId, taskData);
    
    // 记录 token 使用开始
    tokenManager.startUsingToken(usedToken);
    
    // 将图像转为Base64
    console.log(`Converting image to Base64 for task ${taskId}`);
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(new Uint8Array(imageBuffer)).toString('base64');
    
    // 构建处理服务器URL
    const apiServer = process.env.API_SERVER || 'api.grokghibli.com';
    const processingUrl = `https://${apiServer}/process/${taskId}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://grokghibli.com';
    const progressEndpoint = `${baseUrl}/api/transform-ghibli/progress/${taskId}`;
    
    console.log(`Task ${taskId} configuration:`, {
      apiServer,
      baseUrl,
      imageSize: imageBuffer.byteLength,
      prompt,
      height,
      width,
      seed
    });
    
    // 发送请求到处理服务器
    console.log(`Sending processing request to ${processingUrl}`);
    
    try {
      const response = await fetch(processingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          height,
          width,
          seed,
          token: usedToken,
          imageBase64,
          progressEndpoint
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Processing server returned error for task ${taskId}:`, {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        // 更新任务状态为失败
        await saveTaskStatus(taskId, {
          ...taskData,
          status: 'failed',
          error: `Processing server error: ${response.status} ${response.statusText}`
        });
        
        throw new Error(`Processing server returned ${response.status}: ${errorText}`);
      }
      
      console.log(`Successfully initiated processing for task ${taskId}`);
      
    } catch (processingError: any) {
      console.error(`Error sending request to processing server for task ${taskId}:`, processingError);
      
      // 更新任务状态为失败
      await saveTaskStatus(taskId, {
        ...taskData,
        status: 'failed',
        error: processingError.message || 'Failed to contact processing server'
      });
      
      throw processingError;
    }
    
    // 立即返回任务ID
    return NextResponse.json({ 
      taskId, 
      message: 'Image processing started',
      estimatedTime: '30-60 seconds'
    });
    
  } catch (error: any) {
    console.error(`Error processing request${taskId ? ` for task ${taskId}` : ''}:`, error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to start image processing' },
      { status: 500 }
    );
  }
}

// 生成任务ID
function generateTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
} 