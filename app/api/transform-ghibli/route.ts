import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';
import { tokenManager, type HuggingFaceToken } from '@/lib/token-manager';

// 设置最大超时时间（符合Vercel Hobby计划限制）
export const maxDuration = 60; // 60秒超时

// 存储进行中的任务的简单内存缓存
// 注意：这在Serverless环境中只在函数实例生命周期内有效
// 对于生产环境，应使用外部存储如Redis或数据库
const processingTasks = new Map<string, {
  status: 'processing' | 'completed' | 'failed',
  result?: ArrayBuffer,
  error?: string,
  startTime: number,
  token: HuggingFaceToken
}>();

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const action = formData.get('action') as string || 'submit';
  
  // 处理提交请求
  if (action === 'submit') {
    return handleSubmission(formData);
  }
  
  // 处理状态检查请求
  if (action === 'check') {
    const taskId = formData.get('taskId') as string;
    if (!taskId) {
      return NextResponse.json({ error: 'No task ID provided' }, { status: 400 });
    }
    return checkTaskStatus(taskId);
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

// 处理图像提交
async function handleSubmission(formData: FormData) {
  let usedToken: HuggingFaceToken | null = null;
  
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
    usedToken = tokenManager.getToken();
    
    if (!usedToken) {
      console.error('所有 Token 已达到使用限制，无法继续处理请求');
      return NextResponse.json(
        { error: '服务暂时不可用，所有 API 配额已用完，请稍后再试' },
        { status: 503 }
      );
    }
    
    // 创建任务ID
    const taskId = generateTaskId();
    
    // 记录任务开始
    processingTasks.set(taskId, {
      status: 'processing',
      startTime: Date.now(),
      token: usedToken
    });
    
    // 记录 token 使用开始
    tokenManager.startUsingToken(usedToken);
    
    // 在后台异步处理图像
    processImageAsync(taskId, imageFile, prompt, height, width, seed, usedToken);
    
    // 立即返回任务ID
    return NextResponse.json({ 
      taskId, 
      message: 'Image processing started',
      estimatedTime: '30-60 seconds'
    });
    
  } catch (error: any) {
    console.error('Error starting image processing:', error);
    
    if (usedToken) {
      tokenManager.releaseToken(usedToken);
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to start image processing' },
      { status: 500 }
    );
  }
}

// 检查任务状态
async function checkTaskStatus(taskId: string) {
  const task = processingTasks.get(taskId);
  
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  // 如果任务仍在处理中
  if (task.status === 'processing') {
    const elapsedSeconds = Math.floor((Date.now() - task.startTime) / 1000);
    return NextResponse.json({ 
      status: 'processing',
      message: 'Image is still being processed',
      elapsedTime: elapsedSeconds
    });
  }
  
  // 如果任务失败
  if (task.status === 'failed') {
    // 清理任务数据
    processingTasks.delete(taskId);
    return NextResponse.json({ 
      status: 'failed',
      error: task.error || 'Unknown error occurred'
    }, { status: 500 });
  }
  
  // 如果任务完成
  if (task.status === 'completed' && task.result) {
    // 获取结果并清理任务数据
    const result = task.result;
    processingTasks.delete(taskId);
    
    // 返回处理后的图像
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'image/webp',
      },
    });
  }
  
  // 这种情况不应该发生
  return NextResponse.json({ 
    status: 'unknown',
    error: 'Invalid task state'
  }, { status: 500 });
}

// 异步处理图像（在后台运行）
async function processImageAsync(
  taskId: string, 
  imageFile: File, 
  prompt: string, 
  height: number, 
  width: number, 
  seed: number,
  token: HuggingFaceToken
) {
  try {
    // 连接到Gradio客户端
    const spaceUrl = "https://jamesliu1217-easycontrol-ghibli.hf.space/";
    
    console.log(`[Task ${taskId}] Connecting to Gradio API...`, { 
      spaceUrl,
      tokenPrefix: token.substring(0, 10) + '...'
    });
    
    const client = await Client.connect(spaceUrl, {
      hf_token: token
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

    console.log(`[Task ${taskId}] Sending request to generate image...`, {
      prompt,
      height,
      width,
      seed
    });

    // 调用API
    const result = await client.predict("/single_condition_generate_image", params);

    if (Array.isArray(result.data) && result.data.length > 0 && result.data[0].url) {
      console.log(`[Task ${taskId}] Downloading generated image...`);
      const imageUrl = result.data[0].url;
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const imageData = await response.arrayBuffer();
      
      // 记录 token 成功使用时间
      const elapsedSeconds = (Date.now() - processingTasks.get(taskId)!.startTime) / 1000;
      tokenManager.finishUsingToken(token, elapsedSeconds);
      
      console.log(`[Task ${taskId}] 图片处理完成，耗时 ${elapsedSeconds.toFixed(1)} 秒`);
      
      // 更新任务状态为已完成
      processingTasks.set(taskId, {
        status: 'completed',
        result: imageData,
        startTime: processingTasks.get(taskId)!.startTime,
        token
      });
      
    } else {
      throw new Error('No valid image URL found in the response');
    }

  } catch (error: any) {
    console.error(`[Task ${taskId}] Error processing image:`, error);
    
    // 释放token（不计入使用时间）
    tokenManager.releaseToken(token);
    
    // 更新任务状态为失败
    let errorMessage = error.message;
    if (error.message?.includes("metadata could not be loaded")) {
      errorMessage = "API connection failed. Please check API status or try again later.";
    } else if (error.message?.includes("fetch failed")) {
      errorMessage = "Network connection error. Please check your internet connection.";
    }
    
    processingTasks.set(taskId, {
      status: 'failed',
      error: errorMessage,
      startTime: processingTasks.get(taskId)!.startTime,
      token
    });
  }
}

// 生成唯一任务ID
function generateTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
} 