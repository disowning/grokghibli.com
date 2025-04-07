import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 返回一个固定的演示用户，没有真实的数据库连接
  return NextResponse.json({
    id: 'demo_user',
    name: '演示用户',
    email: 'demo@example.com',
    monthlyCredits: 30,
    creditsResetAt: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
  });
} 