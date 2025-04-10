// lib/cache-service.ts

import { Redis } from 'ioredis';

// 创建Redis客户端实例
const redis = new Redis({
  host: process.env.REDIS_HOST || 'api-ip.grokghibli.com',
  // 无需指定端口，因为域名已经通过反向代理指向正确的端口
  password: process.env.REDIS_PASSWORD || 'redis_akyGdb'
});

// 监听Redis连接错误
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// 本地内存缓存作为降级选项
const localCache = new Map();

/**
 * 保存任务状态到Redis
 */
export async function saveTaskStatus(taskId: string, taskData: any): Promise<boolean> {
  try {
    console.log(`Saving task status for ${taskId} to Redis`);
    
    // 保存到Redis（1小时过期）
    await redis.set(
      `task:${taskId}:status`, 
      JSON.stringify(taskData), 
      'EX', 
      3600
    );
    
    console.log(`Task status saved successfully for ${taskId}`);
    return true;
  } catch (error) {
    console.error('Error saving task status:', error);
    
    // 当Redis不可用时，回退到本地内存缓存
    console.warn('Redis unavailable, using local fallback');
    localCache.set(`task:${taskId}:status`, {
      ...taskData,
      timestamp: Date.now()
    });
    
    // 设置1小时过期
    setTimeout(() => {
      if (localCache.has(`task:${taskId}:status`)) {
        localCache.delete(`task:${taskId}:status`);
      }
    }, 3600 * 1000);
    
    return true;
  }
}

/**
 * 从Redis获取任务状态
 */
export async function getTaskStatus(taskId: string): Promise<any | null> {
  try {
    console.log(`Getting task status for ${taskId} from Redis`);
    
    const taskData = await redis.get(`task:${taskId}:status`);
    if (!taskData) {
      console.log(`Task ${taskId} not found in Redis`);
      return null;
    }
    
    console.log(`Task status retrieved for ${taskId}`);
    return JSON.parse(taskData);
  } catch (error) {
    console.error('Error getting task status:', error);
    
    // 尝试从本地缓存获取
    if (localCache.has(`task:${taskId}:status`)) {
      console.log(`Retrieved task ${taskId} from local fallback cache`);
      return localCache.get(`task:${taskId}:status`);
    }
    
    return null;
  }
}

/**
 * 保存图像数据到Redis
 */
export async function saveTaskImage(taskId: string, imageBuffer: ArrayBuffer): Promise<boolean> {
  try {
    console.log(`Saving image for task ${taskId} to Redis, size: ${imageBuffer.byteLength} bytes`);
    
    // 转换ArrayBuffer为Base64
    const base64 = Buffer.from(new Uint8Array(imageBuffer)).toString('base64');
    
    // 保存到Redis（1小时过期）
    await redis.set(`task:${taskId}:image`, base64, 'EX', 3600);
    
    console.log(`Image saved successfully for task ${taskId}`);
    return true;
  } catch (error) {
    console.error('Error saving image:', error);
    
    // 当Redis不可用时，回退到本地内存缓存
    console.warn('Redis unavailable, using local fallback for image');
    localCache.set(`task:${taskId}:image`, imageBuffer);
    
    // 设置1小时过期
    setTimeout(() => {
      if (localCache.has(`task:${taskId}:image`)) {
        localCache.delete(`task:${taskId}:image`);
      }
    }, 3600 * 1000);
    
    return true;
  }
}

/**
 * 从Redis获取图像
 */
export async function getTaskImage(taskId: string): Promise<ArrayBuffer | null> {
  try {
    console.log(`Getting image for task ${taskId} from Redis`);
    
    const base64 = await redis.get(`task:${taskId}:image`);
    if (!base64) {
      console.log(`Image for task ${taskId} not found in Redis`);
      return null;
    }
    
    console.log(`Image retrieved for task ${taskId}`);
    
    // 使用Buffer处理Base64，更可靠的方法
    const buffer = Buffer.from(base64, 'base64');
    
    // 返回ArrayBuffer
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  } catch (error) {
    console.error('Error getting image:', error);
    
    // 尝试从本地缓存获取
    if (localCache.has(`task:${taskId}:image`)) {
      console.log(`Retrieved image for task ${taskId} from local fallback cache`);
      return localCache.get(`task:${taskId}:image`);
    }
    
    return null;
  }
}

/**
 * 删除任务及其相关数据
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    console.log(`Deleting task ${taskId} from Redis`);
    
    // 从Redis删除任务状态和图像
    await redis.del(`task:${taskId}:status`);
    await redis.del(`task:${taskId}:image`);
    
    // 同时从本地缓存中删除
    localCache.delete(`task:${taskId}:status`);
    localCache.delete(`task:${taskId}:image`);
    
    console.log(`Task ${taskId} deleted successfully`);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    
    // 至少从本地缓存中删除
    localCache.delete(`task:${taskId}:status`);
    localCache.delete(`task:${taskId}:image`);
    
    return false;
  }
}

/**
 * 检查Redis连接健康状态
 */
export async function checkCacheServiceHealth(): Promise<boolean> {
  try {
    const pong = await redis.ping();
    return pong === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

/**
 * 更新任务进度
 */
export async function updateTaskProgress(taskId: string, progress: number): Promise<boolean> {
  try {
    console.log(`Updating progress for task ${taskId} to ${progress}%`);
    
    // 从Redis获取当前任务状态
    const taskDataStr = await redis.get(`task:${taskId}:status`);
    if (!taskDataStr) {
      console.log(`Task ${taskId} not found when updating progress`);
      return false;
    }
    
    // 解析任务数据
    const taskData = JSON.parse(taskDataStr);
    
    // 更新进度
    taskData.progress = progress;
    
    // 保存回Redis
    await redis.set(
      `task:${taskId}:status`, 
      JSON.stringify(taskData), 
      'EX', 
      3600
    );
    
    console.log(`Progress updated for task ${taskId}`);
    return true;
  } catch (error) {
    console.error('Error updating task progress:', error);
    
    // 尝试从本地缓存获取并更新
    if (localCache.has(`task:${taskId}:status`)) {
      const taskData = localCache.get(`task:${taskId}:status`);
      taskData.progress = progress;
      localCache.set(`task:${taskId}:status`, taskData);
      console.log(`Updated progress for task ${taskId} in local cache`);
      return true;
    }
    
    return false;
  }
}