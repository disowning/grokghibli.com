import { NextRequest, NextResponse } from 'next/server';
import { getTaskStatus, getTaskImage, deleteTask } from '@/lib/cache-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    console.log(`[Check API] Checking task: ${taskId}`);

    // 从Redis获取任务状态
    const task = await getTaskStatus(taskId);
    if (!task) {
      console.log(`[Check API] Task not found: ${taskId}`);
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    // 任务已完成，读取图片数据
    if (task.status === 'completed') {
      console.log(`[Check API] Task completed, fetching image data for ${taskId}`);
      
      // 获取结果图像
      const imageData = await getTaskImage(taskId);
      
      if (!imageData) {
        console.log(`[Check API] No image data found for ${taskId}`);
        return NextResponse.json({ 
          status: 'error',
          error: 'Image data not found' 
        }, { status: 404 });
      }
      
      console.log(`[Check API] Successfully got image for ${taskId}, returning image data`);
      
      // 返回图片并设置正确的content-type
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    }

    // 任务失败
    if (task.status === 'failed') {
      console.log(`[Check API] Task failed for ${taskId}: ${task.error}`);
      return NextResponse.json({ 
        status: 'failed',
        error: task.error || 'Unknown error occurred' 
      }, { status: 500 });
    }

    // 任务正在处理中，返回状态
    console.log(`[Check API] Task in progress: ${taskId}, status: ${task.status}, progress: ${task.progress}`);
    return NextResponse.json({
      status: task.status,
      progress: task.progress || 0,
      elapsedTime: Date.now() - task.startTime
    });
  } catch (error: any) {
    console.error(`[Check API] Error checking task ${params.taskId}:`, error);
    return NextResponse.json(
      { error: error.message || 'Error checking task status' },
      { status: 500 }
    );
  }
}