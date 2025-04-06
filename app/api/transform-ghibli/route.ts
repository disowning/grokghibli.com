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
  
  try {
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
    const taskId = generateTaskId();
    
    // 记录任务开始
    const taskData = {
      status: 'processing' as const,
      startTime: Date.now(),
      token: usedToken,
      progress: 0,
      prompt
    };
    
    // 保存任务状态到Redis
    await saveTaskStatus(taskId, taskData);
    
    // 记录 token 使用开始
    tokenManager.startUsingToken(usedToken);
    
    // 将图像转为Base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(new Uint8Array(imageBuffer)).toString('base64');
    
    // 发送请求到处理服务器
    console.log(`Sending processing request to external server for task ${taskId}`);
    
    fetch('https://api.grokghibli.com/process/' + taskId, {
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
        imageBase64
      })
    }).catch(err => console.error('Failed to start processing:', err));
    
    // 立即返回任务ID
    return NextResponse.json({ 
      taskId, 
      message: 'Image processing started',
      estimatedTime: '30-60 seconds'
    });
    
  } catch (error: any) {
    console.error('Error starting image processing:', error);
    
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