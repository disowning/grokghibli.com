import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // 检查环境变量
  const envInfo = {
    nextAuthUrl: process.env.NEXTAUTH_URL,
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  };
  
  // 隐藏敏感信息细节，只返回是否存在
  return NextResponse.json(envInfo);
} 