import { NextRequest, NextResponse } from 'next/server';
import { tokenManager } from '@/lib/token-manager';

export async function GET(request: NextRequest) {
  // 获取查询参数中的 secret 密钥
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  
  // 简单安全验证
  const validSecret = process.env.ADMIN_SECRET || 'ghibli-admin-2025';
  if (secret !== validSecret) {
    return NextResponse.json(
      { error: 'Unauthorized access' },
      { status: 401 }
    );
  }
  
  // 获取所有 token 的状态
  const tokenStatus = tokenManager.getTokensStatus();
  
  // 计算总体统计
  const totalTokens = tokenStatus.length;
  const availableTokens = tokenStatus.filter(t => t.available).length;
  const totalUsageMinutes = tokenStatus.reduce((sum, t) => sum + t.usageMinutes, 0);
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    summary: {
      totalTokens,
      availableTokens,
      usedTokens: totalTokens - availableTokens,
      totalUsageMinutes: totalUsageMinutes.toFixed(1),
      averageUsageMinutes: (totalUsageMinutes / totalTokens).toFixed(1)
    },
    tokens: tokenStatus
  });
} 