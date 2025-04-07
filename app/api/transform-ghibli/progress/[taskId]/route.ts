import { NextRequest, NextResponse } from 'next/server';
import { updateTaskProgress, getTaskStatus } from '@/lib/cache-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    const requestData = await request.json();
    
    // 验证进度值
    const progress = Number(requestData.progress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid progress value' 
      }, { status: 400 });
    }
    
    console.log(`[Progress API] Receiving progress update for task ${taskId}: ${progress}%`);
    
    // 验证任务是否存在
    const task = await getTaskStatus(taskId);
    if (!task) {
      console.log(`[Progress API] Task not found: ${taskId}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Task not found' 
      }, { status: 404 });
    }
    
    // 更新任务进度
    const updated = await updateTaskProgress(taskId, progress);
    
    if (!updated) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update progress' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true,
      message: `Progress updated to ${progress}%`
    });
    
  } catch (error: any) {
    console.error(`[Progress API] Error updating progress for task ${params.taskId}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
} 