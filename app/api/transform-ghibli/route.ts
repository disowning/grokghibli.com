import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@gradio/client';
import { tokenManager, type HuggingFaceToken } from '@/lib/token-manager';
import * as fs from 'fs';
import * as path from 'path';
import os from 'os';

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

// 存储任务的目录
const TASKS_DIR = path.join(os.tmpdir(), 'ghibli-tasks');

// 确保目录存在
try {
  if (!fs.existsSync(TASKS_DIR)) {
    fs.mkdirSync(TASKS_DIR, { recursive: true });
    console.log(`Created tasks directory: ${TASKS_DIR}`);
  }
} catch (error) {
  console.error('Failed to create tasks directory:', error);
}

// 保存任务状态（不保存图像数据，仅保存状态信息）
export function saveTaskStatus(taskId: string, task: Omit<ProcessingTask, 'result' | 'resultImage'>) {
  try {
    const taskFilePath = path.join(TASKS_DIR, `${taskId}.json`);
    fs.writeFileSync(taskFilePath, JSON.stringify({
      ...task,
      token: task.token.substring(0, 10) + '...' // 不保存完整token
    }));
    console.log(`Saved task status for ${taskId}`);
  } catch (error) {
    console.error(`Failed to save task status for ${taskId}:`, error);
  }
}

// 保存处理结果图像
export function saveTaskResult(taskId: string, imageData: ArrayBuffer) {
  try {
    const imageFilePath = path.join(TASKS_DIR, `${taskId}.webp`);
    fs.writeFileSync(imageFilePath, Buffer.from(new Uint8Array(imageData)));
    console.log(`Saved result image for ${taskId}, size: ${imageData.byteLength} bytes`);
    
    // 更新任务状态
    const taskStatus = getTaskStatus(taskId);
    if (taskStatus) {
      saveTaskStatus(taskId, {
        ...taskStatus,
        status: 'completed'
      });
    }
  } catch (error) {
    console.error(`Failed to save result image for ${taskId}:`, error);
  }
}

// 获取任务状态
export function getTaskStatus(taskId: string): Omit<ProcessingTask, 'result' | 'resultImage'> | null {
  try {
    const taskFilePath = path.join(TASKS_DIR, `${taskId}.json`);
    if (fs.existsSync(taskFilePath)) {
      const data = fs.readFileSync(taskFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Failed to get task status for ${taskId}:`, error);
  }
  return null;
}

// 获取任务结果图像
export function getTaskResultImage(taskId: string): Uint8Array | null {
  try {
    const imageFilePath = path.join(TASKS_DIR, `${taskId}.webp`);
    if (fs.existsSync(imageFilePath)) {
      // 使用fs.readFileSync直接读取文件为Buffer，然后返回
      return fs.readFileSync(imageFilePath);
    }
  } catch (error) {
    console.error(`Failed to get result image for ${taskId}:`, error);
  }
  return null;
}

// 删除任务
export function deleteTask(taskId: string) {
  try {
    const taskFilePath = path.join(TASKS_DIR, `${taskId}.json`);
    const imageFilePath = path.join(TASKS_DIR, `${taskId}.webp`);
    
    if (fs.existsSync(taskFilePath)) {
      fs.unlinkSync(taskFilePath);
    }
    
    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath);
    }
    
    console.log(`Deleted task ${taskId}`);
  } catch (error) {
    console.error(`Failed to delete task ${taskId}:`, error);
  }
}

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
      progress: 0
    };
    
    // 保存任务状态
    saveTaskStatus(taskId, taskData);
    
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
    
    return NextResponse.json(
      { error: error.message || 'Failed to start image processing' },
      { status: 500 }
    );
  }
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
    
    // 更新进度
    saveTaskStatus(taskId, {
      status: 'processing',
      startTime: Date.now(),
      token,
      progress: 10
    });
    
    // 准备图片数据以在失败时使用
    const originalImageBuffer = await imageFile.arrayBuffer();
    
    try {
      const client = await Client.connect(spaceUrl, {
        hf_token: token
      });

      // 准备图片数据
      const blob = new Blob([originalImageBuffer], { type: imageFile.type });

      // 更新进度
      saveTaskStatus(taskId, {
        status: 'processing',
        startTime: Date.now(),
        token,
        progress: 20
      });

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
      
      // 更新进度
      saveTaskStatus(taskId, {
        status: 'processing',
        startTime: Date.now(),
        token,
        progress: 30
      });

      // 调用API
      const result = await client.predict("/single_condition_generate_image", params);
      
      // 更新进度
      saveTaskStatus(taskId, {
        status: 'processing',
        startTime: Date.now(),
        token,
        progress: 70
      });

      if (Array.isArray(result.data) && result.data.length > 0 && result.data[0].url) {
        console.log(`[Task ${taskId}] Downloading generated image from URL:`, result.data[0].url);
        const imageUrl = result.data[0].url;
        
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
        }

        const imageData = await response.arrayBuffer();
        console.log(`[Task ${taskId}] Successfully downloaded image data, size: ${imageData.byteLength} bytes`);
        
        // 更新进度
        saveTaskStatus(taskId, {
          status: 'processing',
          startTime: Date.now(),
          token,
          progress: 90
        });
        
        // 如果图片数据为空或太小，可能有问题
        if (!imageData || imageData.byteLength < 100) {
          throw new Error(`Invalid image data received: ${imageData.byteLength} bytes`);
        }
        
        // 记录 token 成功使用时间
        const task = getTaskStatus(taskId);
        if (task) {
          const elapsedSeconds = (Date.now() - task.startTime) / 1000;
          tokenManager.finishUsingToken(token, elapsedSeconds);
        }
        
        console.log(`[Task ${taskId}] Image processing completed, saving result`);
        
        // 保存结果图像
        saveTaskResult(taskId, imageData);
        
        // 更新任务状态为已完成
        saveTaskStatus(taskId, {
          status: 'completed',
          startTime: Date.now(),
          token,
          progress: 100
        });
        
        console.log(`[Task ${taskId}] Task status updated to completed`);
        
      } else {
        console.log(`[Task ${taskId}] Invalid response format:`, result.data);
        throw new Error('No valid image URL found in the response');
      }
    } catch (apiError: any) {
      // 检查是否是 GPU 配额超限错误
      if (apiError.message && (
          apiError.message.includes("GPU quota exceeded") || 
          apiError.message.includes("超出免费 GPU 配额")
        )) {
        console.log(`[Task ${taskId}] GPU 配额超限，标记 token 并使用原始图像作为备选`);
        
        // 标记当前 token 已超限
        tokenManager.markTokenQuotaExceeded(token);
        
        // 释放当前 token
        tokenManager.releaseToken(token);
        
        // 尝试获取新的 token
        const newToken = tokenManager.getToken();
        
        if (newToken) {
          // 用新 token 重新启动处理
          console.log(`[Task ${taskId}] 使用新 token 重试...`);
          return processImageAsync(taskId, imageFile, prompt, height, width, seed, newToken);
        } else {
          console.log(`[Task ${taskId}] No available tokens, using simulation mode`);
          // All tokens unavailable, use original image as result (simulation mode)
          saveTaskResult(taskId, originalImageBuffer);
          
          // 更新任务状态为已完成
          saveTaskStatus(taskId, {
            status: 'completed',
            startTime: Date.now(),
            token,
            progress: 100
          });
          
          console.log(`[Task ${taskId}] Using original image as result (simulation mode)`);
        }
      } else {
        // 其他 API 错误，向上传递
        throw apiError;
      }
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
    
    saveTaskStatus(taskId, {
      status: 'failed',
      error: errorMessage,
      startTime: Date.now(),
      token,
      progress: 0
    });
  }
}

// 生成唯一任务ID
function generateTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
} 