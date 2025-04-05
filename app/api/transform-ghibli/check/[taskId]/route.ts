import { NextRequest, NextResponse } from 'next/server';
import { processingTasks } from '../../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    console.log(`[Check API] Checking task: ${taskId}`);

    // 找到任务
    const task = processingTasks.get(taskId);
    if (!task) {
      console.log(`[Check API] Task not found: ${taskId}`);
      return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }

    // 任务已完成并有图片数据
    if (task.status === 'completed' && task.resultImage) {
      console.log(`[Check API] Task completed, returning image data. Size: ${task.resultImage.byteLength} bytes`);
      
      // 从processingTasks中删除任务
      processingTasks.delete(taskId);
      
      // 返回图片并设置正确的content-type
      return new NextResponse(task.resultImage, {
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    }

    // 任务正在处理中，返回状态
    console.log(`[Check API] Task in progress: ${taskId}, status: ${task.status}, progress: ${task.progress}`);
    return NextResponse.json({
      status: task.status,
      progress: task.progress,
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